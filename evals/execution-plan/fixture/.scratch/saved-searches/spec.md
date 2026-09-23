# Saved searches

Status: ready-for-agent

## Problem Statement

Tanoa's customers run the same catalogue search every week and rebuild its filters each time.

## Solution

A signed-in customer saves the current search (query, filters, sort) and reopens it from a menu next
to the search field. A saved search can be shared as a link, and can send a weekly email digest of
new results.

## Implementation Decisions

- Saved searches belong to one user, at most 20 each; the results are never stored.
- The search state is encoded in the URL, so a link reproduces a search without an account.
- Deleting asks for no confirmation; an undo toast stays for 8 seconds.
- The digest is opt-in per saved search.
