// Folding range provider for SX.
//
// Reports foldable ranges for:
//   - @section:'…' / @s:'…' blocks (closed by `!` or `end`)
//   - #function … end|!
//   - repeat … end|!  (block tracked but only folded if section)
//   - multiline /* … */ block comments
//
// Lightweight scanner — keeps working when code is mid-edit and the
// full parser would error. Skips line comments, block comments, and
// string literals so opens/closes inside them are ignored.
//
// Ported from `tm/src/vscode/provideFoldingRanges.js` (CommonJS) and
// extended with /* */ multiline-comment folding (the only addition).

const SECTION_OPEN_RE = /@(?:section|s):/gi;
const FUNCTION_OPEN_RE = /#[a-zA-Z_][a-zA-Z0-9_]*/g;
const REPEAT_OPEN_RE = /\brepeat\b/g;
const END_RE = /\bend\b/g;
const BANG_RE = /(^|\s)!(?=\s|\/\/|\/\*|$)/g;

function stripNonCode(line, state) {
  let out = "";
  let i = 0;
  const n = line.length;
  while (i < n) {
    if (state.inBlockComment) {
      const close = line.indexOf("*/", i);
      if (close === -1) {
        out += " ".repeat(n - i);
        return out;
      }
      out += " ".repeat(close + 2 - i);
      i = close + 2;
      state.inBlockComment = false;
      continue;
    }
    const ch = line[i];
    const nx = line[i + 1];
    if (ch === "/" && nx === "/") {
      out += " ".repeat(n - i);
      return out;
    }
    if (ch === "/" && nx === "*") {
      state.inBlockComment = true;
      out += "  ";
      i += 2;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      out += " ";
      i++;
      while (i < n && line[i] !== quote) {
        if (line[i] === "\\" && i + 1 < n) {
          out += "  ";
          i += 2;
        } else {
          out += " ";
          i++;
        }
      }
      if (i < n) {
        out += " ";
        i++;
      }
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

function collectLineEvents(code) {
  const events = [];
  let m;
  const reset = (re) => (re.lastIndex = 0);

  reset(SECTION_OPEN_RE);
  while ((m = SECTION_OPEN_RE.exec(code)) !== null) {
    events.push({ col: m.index, kind: "open", sub: "section" });
  }
  reset(FUNCTION_OPEN_RE);
  while ((m = FUNCTION_OPEN_RE.exec(code)) !== null) {
    events.push({ col: m.index, kind: "open", sub: "function" });
  }
  reset(REPEAT_OPEN_RE);
  while ((m = REPEAT_OPEN_RE.exec(code)) !== null) {
    events.push({ col: m.index, kind: "open", sub: "repeat" });
  }
  reset(END_RE);
  while ((m = END_RE.exec(code)) !== null) {
    events.push({ col: m.index, kind: "close" });
  }
  reset(BANG_RE);
  while ((m = BANG_RE.exec(code)) !== null) {
    events.push({ col: m.index + m[1].length, kind: "close" });
  }
  events.sort((a, b) => a.col - b.col);
  return events;
}

// Returns ranges for section/#function/repeat blocks. Only sections
// are reported as foldable (functions/repeat are tracked so a stray
// `end` doesn't prematurely pop a section).
function findSectionRanges(text) {
  const lines = text.split(/\r?\n/);
  const state = { inBlockComment: false };
  const stack = [];
  const ranges = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const code = stripNonCode(lines[lineIdx], state);
    const events = collectLineEvents(code);

    for (const ev of events) {
      if (ev.kind === "open") {
        stack.push({ sub: ev.sub, line: lineIdx + 1 });
      } else if (stack.length > 0) {
        const opened = stack.pop();
        const endLine = lineIdx + 1;
        if (opened.sub === "section" && endLine > opened.line) {
          ranges.push({ start: opened.line, end: endLine, kind: "section" });
        }
      }
    }
  }
  return ranges;
}

// Returns ranges for /* … */ block comments that span >1 line.
// Independent pass that scans raw text (does not use stripNonCode
// because we *want* to find comments).
function findBlockCommentRanges(text) {
  const lines = text.split(/\r?\n/);
  const ranges = [];
  let openLine = -1;
  let inStr = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let j = 0;
    const n = line.length;
    while (j < n) {
      if (openLine >= 0) {
        // already inside a block comment, scan for */
        const close = line.indexOf("*/", j);
        if (close === -1) { j = n; break; }
        const endLine = i + 1;
        if (endLine > openLine) ranges.push({ start: openLine, end: endLine, kind: "comment" });
        openLine = -1;
        j = close + 2;
        continue;
      }
      const ch = line[j];
      const nx = line[j + 1];
      if (inStr) {
        if (ch === "\\" && j + 1 < n) { j += 2; continue; }
        if (ch === inStr) { inStr = null; j++; continue; }
        j++;
        continue;
      }
      if (ch === "/" && nx === "/") { j = n; break; }
      if (ch === "/" && nx === "*") {
        openLine = i + 1;
        j += 2;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; j++; continue; }
      j++;
    }
  }
  return ranges;
}

function findAllRanges(text) {
  const sections = findSectionRanges(text);
  const comments = findBlockCommentRanges(text);
  return [...sections, ...comments];
}

function createFoldingRangeProvider(vscode) {
  return {
    provideFoldingRanges(document /* , context, token */) {
      const ranges = findAllRanges(document.getText());
      return ranges.map((r) => new vscode.FoldingRange(
        r.start - 1, // VS Code wants 0-based line numbers
        r.end - 1,
        r.kind === "comment"
          ? vscode.FoldingRangeKind.Comment
          : vscode.FoldingRangeKind.Region
      ));
    },
  };
}

module.exports = {
  findSectionRanges,
  findBlockCommentRanges,
  findAllRanges,
  createFoldingRangeProvider,
};
