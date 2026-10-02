#!/usr/bin/env bash
# A Next.js dashboard on shadcn/ui with twelve months of revenue in a data file and no chart yet.
set -euo pipefail
mkdir -p app/dashboard components/ui lib
cat > package.json <<'EOF'
{ "name": "painel-pousada", "private": true, "scripts": { "dev": "next dev", "build": "next build" }, "dependencies": { "next": "^16.0.0", "react": "^19.0.0", "react-dom": "^19.0.0", "lucide-react": "^0.500.0" }, "devDependencies": { "tailwindcss": "^4.0.0", "typescript": "^5.0.0" } }
EOF
cat > components.json <<'EOF'
{ "$schema": "https://ui.shadcn.com/schema.json", "style": "new-york", "rsc": true, "tsx": true, "tailwind": { "config": "", "css": "app/globals.css", "baseColor": "neutral", "cssVariables": true }, "aliases": { "components": "@/components", "ui": "@/components/ui", "lib": "@/lib", "utils": "@/lib/utils" }, "iconLibrary": "lucide" }
EOF
cat > lib/revenue.ts <<'EOF'
export const revenue = [
  { month: "2025-10", total: 41200 }, { month: "2025-11", total: 38900 }, { month: "2025-12", total: 61500 },
  { month: "2026-01", total: 72300 }, { month: "2026-02", total: 58800 }, { month: "2026-03", total: 44100 },
  { month: "2026-04", total: 39700 }, { month: "2026-05", total: 35200 }, { month: "2026-06", total: 37900 },
  { month: "2026-07", total: 52600 }, { month: "2026-08", total: 40300 }, { month: "2026-09", total: 43800 },
];
EOF
cat > lib/utils.ts <<'EOF'
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
EOF
cat > components/ui/card.tsx <<'EOF'
import { cn } from "@/lib/utils";
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-xl border bg-card p-6 text-card-foreground", className)} {...props} />;
}
EOF
cat > app/dashboard/page.tsx <<'EOF'
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-8">
      <h1 className="text-2xl font-semibold">Painel</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><p className="text-sm text-muted-foreground">Ocupação</p><p className="text-3xl font-semibold">78%</p></Card>
        <Card><p className="text-sm text-muted-foreground">Diária média</p><p className="text-3xl font-semibold">R$ 412</p></Card>
        <Card><p className="text-sm text-muted-foreground">Reservas no mês</p><p className="text-3xl font-semibold">96</p></Card>
      </div>
    </main>
  );
}
EOF
