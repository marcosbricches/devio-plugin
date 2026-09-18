# -*- coding: utf-8 -*-
"""
python build.py <text.md> [--project NAME] [--out FILE.docx]

Turns a report's markdown into a .docx on Devio's paper. The markdown is the
artifact people edit and review; this script only dresses it.

Markdown understood, and what each becomes:
    # H1      document title
    ## H2     subtitle under the title
    ### H3    magenta section label, small caps, letterspaced
    #### H4   bold lead-in inside a section
    **line**  standalone: grey label with a short magenta rule under it
    > line    client quote, magenta rule on the left
    | table | header row repeats across pages, rows never split
    text      justified body; **bold** inside a line is honoured

Output name, unless --out says otherwise: "<project> - <title> - Devio.docx",
next to the input. --project defaults to the name of the git repository the
input lives in.

The identity comes from devio.com.br (read 2026-09-16): magenta #FF008D as the
accent, graphite #1C1C21 for text, grey #52525B for support.

The official logo is white on transparent, made for a dark ground. That is why
the header is a graphite band bleeding to the paper's edge rather than a logo
floating on white: putting the mark on a light ground would need a logo version
the brand does not have.

Requires python-docx and Pillow — see requirements.txt.
"""
import argparse
import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image
    from docx import Document
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
    from docx.shared import Cm, Pt, RGBColor
except ImportError as missing:
    sys.exit(
        f"missing dependency: {missing.name}\n"
        f"install it with: pip install -r {Path(__file__).with_name('requirements.txt')}"
    )

HERE = Path(__file__).resolve().parent
LOGO = HERE / "brand" / "logo-devio.png"

MAGENTA = RGBColor(0xFF, 0x00, 0x8D)
GRAPHITE = RGBColor(0x1C, 0x1C, 0x21)
GREY = RGBColor(0x52, 0x52, 0x5B)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

# Calibri, not the site's Inter: Inter is not installed on most machines and Word
# substitutes something arbitrary. A system font keeps the document identical for
# whoever opens it.
FONT = "Calibri"

PAGE_WIDTH = 21.0  # A4, in cm
MARGIN = 2.4


def styled(run, size, colour=GRAPHITE, bold=False, tracking=None, caps=False):
    run.font.name = FONT
    run.font.size = Pt(size)
    run.font.color.rgb = colour
    run.bold = bold
    rpr = run._element.get_or_add_rPr()
    fonts = rpr.find(qn("w:rFonts"))
    if fonts is None:
        fonts = OxmlElement("w:rFonts")
        rpr.append(fonts)
    for attribute in ("w:ascii", "w:hAnsi", "w:cs"):
        fonts.set(qn(attribute), FONT)
    if tracking:
        spacing = OxmlElement("w:spacing")
        spacing.set(qn("w:val"), str(int(tracking * 20)))
        rpr.append(spacing)
    if caps:
        rpr.append(OxmlElement("w:caps"))
    return run


def band(tmp_dir):
    """Graphite band with the logo and the magenta hairline at its foot."""
    target = tmp_dir / "_band.png"
    width, height = 2480, 400  # 21 cm x 3.39 cm at 300 dpi
    canvas = Image.new("RGBA", (width, height), (10, 10, 11, 255))

    logo = Image.open(LOGO).convert("RGBA")
    logo_height = 96
    scale = logo_height / logo.height
    logo = logo.resize((int(logo.width * scale), logo_height), Image.LANCZOS)
    canvas.alpha_composite(logo, (int(MARGIN / PAGE_WIDTH * width), (height - logo_height) // 2 - 14))

    hairline = Image.new("RGBA", (width, 10), (0xFF, 0x00, 0x8D, 255))
    canvas.alpha_composite(hairline, (0, height - 10))
    canvas.convert("RGB").save(target, dpi=(300, 300))
    return target


def bleed(paragraph):
    paragraph.paragraph_format.left_indent = Cm(-MARGIN)
    paragraph.paragraph_format.right_indent = Cm(-MARGIN)
    paragraph.paragraph_format.space_before = Pt(0)
    paragraph.paragraph_format.space_after = Pt(0)


def magenta_rule(paragraph, width_cm=3.2, weight=3):
    """A short rule: the brand accent without becoming a frame."""
    ppr = paragraph._element.get_or_add_pPr()
    borders = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), str(weight * 8))
    bottom.set(qn("w:space"), "2")
    bottom.set(qn("w:color"), "FF008D")
    borders.append(bottom)
    ppr.append(borders)
    paragraph.paragraph_format.right_indent = Cm(PAGE_WIDTH - 2 * MARGIN - width_cm)


def page_number(paragraph):
    for instruction, value in (("begin", None), (None, "PAGE"), ("end", None)):
        run = paragraph.add_run()
        styled(run, 8, GREY)
        if instruction:
            field = OxmlElement("w:fldChar")
            field.set(qn("w:fldCharType"), instruction)
            run._element.append(field)
        else:
            text = OxmlElement("w:instrText")
            text.set(qn("xml:space"), "preserve")
            text.text = value
            run._element.append(text)


def shade(cell, colour):
    properties = cell._tc.get_or_add_tcPr()
    shading = OxmlElement("w:shd")
    shading.set(qn("w:val"), "clear")
    shading.set(qn("w:fill"), colour)
    properties.append(shading)


def underline(cell, colour="E4E4E7", weight=6):
    properties = cell._tc.get_or_add_tcPr()
    borders = OxmlElement("w:tcBorders")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), str(weight))
    bottom.set(qn("w:color"), colour)
    borders.append(bottom)
    properties.append(borders)


def write(paragraph, text, size, colour=GRAPHITE, bold=False):
    """Honours **bold** inside the line."""
    for index, part in enumerate(text.split("**")):
        if part:
            styled(paragraph.add_run(part), size, colour, bold=(bold or index % 2 == 1))


def table(doc, rows):
    """Read-in-a-diagonal table: repeating header, light zebra, no grid.

    Column widths are proportional to average content length so a column of
    numbers does not take the same room as a column of prose, rows carry
    cantSplit so none breaks across a page, and the header repeats when the
    table crosses one.
    """
    columns = len(rows[0])
    usable = PAGE_WIDTH - 2 * MARGIN

    averages = []
    for column in range(columns):
        lengths = [len(row[column]) for row in rows[1:]] or [len(rows[0][column])]
        averages.append(max(6, sum(lengths) / len(lengths)))
    total = sum(averages)
    widths = [Cm(max(2.0, usable * average / total)) for average in averages]
    widths[-1] = Cm(widths[-1].cm + usable - sum(width.cm for width in widths))

    built = doc.add_table(rows=0, cols=columns)
    built.autofit = False
    built.allow_autofit = False

    for index, row in enumerate(rows):
        line = built.add_row()
        properties = line._tr.get_or_add_trPr()
        properties.append(OxmlElement("w:cantSplit"))
        if index == 0:
            properties.append(OxmlElement("w:tblHeader"))

        for position, value in enumerate(row):
            cell = line.cells[position]
            cell.width = widths[position]
            paragraph = cell.paragraphs[0]
            paragraph.paragraph_format.space_before = Pt(5)
            paragraph.paragraph_format.space_after = Pt(5)
            if index == 0:
                shade(cell, "1C1C21")
                write(paragraph, value, 8, WHITE, bold=True)
            else:
                if index % 2 == 0:
                    shade(cell, "FAFAFA")
                underline(cell)
                write(paragraph, value, 9.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)
    return built


def quote(doc, text):
    paragraph = doc.add_paragraph()
    paragraph.paragraph_format.left_indent = Cm(0.7)
    paragraph.paragraph_format.space_before = Pt(6)
    paragraph.paragraph_format.space_after = Pt(10)
    ppr = paragraph._element.get_or_add_pPr()
    borders = OxmlElement("w:pBdr")
    left = OxmlElement("w:left")
    left.set(qn("w:val"), "single")
    left.set(qn("w:sz"), "18")
    left.set(qn("w:space"), "10")
    left.set(qn("w:color"), "FF008D")
    borders.append(left)
    ppr.append(borders)
    styled(paragraph.add_run(text), 10.5, GRAPHITE)
    paragraph.runs[0].italic = True


def title_of(lines, fallback):
    return next((line[2:].strip() for line in lines if line.startswith("# ")), fallback)


def project_name(source):
    try:
        root = subprocess.run(
            ["git", "-C", str(source.parent), "rev-parse", "--show-toplevel"],
            capture_output=True,
            text=True,
            check=True,
        ).stdout.strip()
        return Path(root).name
    except (subprocess.CalledProcessError, FileNotFoundError):
        return source.parent.name


def compose(source, out):
    doc = Document()
    section = doc.sections[0]
    section.page_width, section.page_height = Cm(PAGE_WIDTH), Cm(29.7)
    section.left_margin = section.right_margin = Cm(MARGIN)
    section.top_margin = Cm(3.9)
    section.bottom_margin = Cm(2.2)
    section.header_distance = Cm(0)
    section.footer_distance = Cm(1.1)

    header = section.header.paragraphs[0]
    bleed(header)  # the negative indent is what lets the band reach the paper's edge
    banner = band(out.parent)
    header.add_run().add_picture(str(banner), width=Cm(PAGE_WIDTH))

    footer = section.footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.LEFT
    styled(footer.add_run("Devio  ·  devio.com.br  ·  "), 8, GREY)
    page_number(footer)

    normal = doc.styles["Normal"]
    normal.font.name = FONT
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = GRAPHITE
    normal.paragraph_format.space_after = Pt(9)
    normal.paragraph_format.line_spacing = 1.42

    lines = source.read_text(encoding="utf-8").split("\n")

    index, first_label = 0, True
    while index < len(lines):
        raw = lines[index].rstrip()
        index += 1
        if not raw.strip():
            continue

        if raw.startswith("# "):
            paragraph = doc.add_paragraph()
            paragraph.paragraph_format.space_after = Pt(2)
            styled(paragraph.add_run(raw[2:]), 27, GRAPHITE, bold=True)

        elif raw.startswith("## "):
            paragraph = doc.add_paragraph()
            paragraph.paragraph_format.space_after = Pt(16)
            styled(paragraph.add_run(raw[3:]), 14, GREY)

        elif raw.startswith("### "):
            paragraph = doc.add_paragraph()
            paragraph.paragraph_format.space_before = Pt(0 if first_label else 22)
            paragraph.paragraph_format.space_after = Pt(4)
            paragraph.paragraph_format.keep_with_next = True
            styled(paragraph.add_run(raw[4:]), 8.5, MAGENTA, bold=True, tracking=1.6, caps=True)
            first_label = False

        elif raw.startswith("#### "):
            paragraph = doc.add_paragraph()
            paragraph.paragraph_format.space_before = Pt(14)
            paragraph.paragraph_format.space_after = Pt(6)
            paragraph.paragraph_format.keep_with_next = True
            styled(paragraph.add_run(raw[5:]), 9.5, GRAPHITE, bold=True)

        elif raw.startswith("**") and raw.endswith("**"):
            paragraph = doc.add_paragraph()
            paragraph.paragraph_format.space_after = Pt(14)
            styled(paragraph.add_run(raw.strip("*")), 9, GREY, tracking=0.8)
            magenta_rule(paragraph)

        elif raw.startswith("> "):
            quote(doc, raw[2:])

        elif raw.startswith("|"):
            body = []
            index -= 1
            while index < len(lines) and lines[index].strip().startswith("|"):
                cells = [cell.strip() for cell in lines[index].strip().strip("|").split("|")]
                if not all(set(cell) <= set("-: ") for cell in cells):
                    body.append(cells)
                index += 1
            if not body:
                sys.exit(f"{source}: a markdown table with no rows, at line {index}")
            table(doc, body)

        elif raw.startswith("---"):
            continue

        else:
            text = [raw]
            while index < len(lines) and lines[index].strip() and not lines[index].startswith(("#", "---", "**", "|", "> ")):
                text.append(lines[index].rstrip())
                index += 1
            paragraph = doc.add_paragraph()
            paragraph.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            # A paragraph introducing a table travels to the next page with it.
            following = next((line for line in lines[index:] if line.strip()), "")
            paragraph.paragraph_format.keep_with_next = following.startswith("|")
            write(paragraph, " ".join(text), 10.5)

    doc.save(out)
    banner.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description="Build a client report on Devio's paper.")
    parser.add_argument("source", type=Path, help="the report's markdown")
    parser.add_argument("--project", help="project name for the output file; defaults to the repository name")
    parser.add_argument("--out", type=Path, help="output path; defaults to <project> - <title> - Devio.docx")
    arguments = parser.parse_args()

    source = arguments.source.resolve()
    if not source.exists():
        sys.exit(f"no such file: {source}")

    project = arguments.project or project_name(source)
    title = title_of(source.read_text(encoding="utf-8").split("\n"), source.stem)
    out = arguments.out or source.parent / f"{project} - {title} - Devio.docx"

    compose(source, out.resolve())
    print(f"built: {out}")


if __name__ == "__main__":
    main()
