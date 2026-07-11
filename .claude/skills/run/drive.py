#!/usr/bin/env python3
"""Drive the running full-stack-gallore client in Chromium and verify pages render.

Usage:
    python drive.py [PATH[:EXPECTED_SUBSTRING] ...]

Each arg is a route to visit, optionally with an expected text substring the rendered <body>
must contain (case-insensitive). With no args, runs a default sweep of the newest content.
Screenshots (full page) are written to the OS temp dir and the paths are printed. Exits non-zero
if any expected substring is missing or a real page error (not a Sandpack CDN timeout) occurs.

Requires: the dev server running on :5173, Python Playwright, and the installed Chromium.
"""
import os
import sys
import tempfile
from playwright.sync_api import sync_playwright

BASE = os.environ.get("GALLORE_BASE", "http://localhost:5173")
OUT = os.path.join(tempfile.gettempdir(), "gallore-shots")
os.makedirs(OUT, exist_ok=True)

DEFAULT = [
    ("/module/fe-paradigms", "Functional Programming"),
    ("/lesson/fe-fp-pure", "Pure functions"),
    ("/module/fe-react-depth", "React Depth"),
    ("/lesson/fe-react-equality", "shallowEqual"),
    ("/module/adv-sysdesign", "System Design"),
    ("/lesson/adv-sd-typeahead", "Typeahead"),
]

# Console errors matching these are expected offline (Sandpack's remote bundler) — not failures.
IGNORE = ("ERR_CONNECTION", "ERR_NAME_NOT_RESOLVED", "Failed to load resource", "sandpack", "codesandbox")


def parse(args):
    out = []
    for a in args:
        path, _, expect = a.partition(":")
        out.append((path, expect or None))
    return out


def main():
    targets = parse(sys.argv[1:]) if len(sys.argv) > 1 else DEFAULT
    misses, real_errors = [], []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 1600})
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append("PAGEERROR: " + str(e)))
        for i, (path, expect) in enumerate(targets, 1):
            before = len(errors)
            page.goto(BASE + path, wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(1200)
            body = page.inner_text("body")
            name = f"{i:02d}-{path.strip('/').replace('/', '-') or 'home'}"
            shot = os.path.join(OUT, name + ".png")
            page.screenshot(path=shot, full_page=True)
            found = (expect is None) or (expect.lower() in body.lower())
            new = [e for e in errors[before:] if not any(t.lower() in e.lower() for t in IGNORE)]
            real_errors += new
            if not found:
                misses.append((path, expect))
            flag = "OK  " if found else "MISS"
            print(f"{flag} {path:34s} expect={expect!r:24s} found={found} errs={len(new)} -> {shot}")
        browser.close()

    if real_errors:
        print("\n=== unexpected page errors ===")
        for e in real_errors:
            print(" -", e[:200])
    print(f"\nScreenshots in: {OUT}")
    if misses:
        print("MISSING expected text on:", ", ".join(p for p, _ in misses))
    sys.exit(1 if (misses or real_errors) else 0)


if __name__ == "__main__":
    main()
