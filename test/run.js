// Lightweight runner for the pure-module unit tests.
// Avoids spinning up the full VS Code test host — most logic is pure.

const assert = require("assert");

const { findSectionRanges, findBlockCommentRanges, findAllRanges } =
  require("../src/provideFoldingRanges");
const { formatSx } = require("../src/formatSx");
const { transformStackIdxs } = require("../src/stackIdxTransform");
const { lookup, formatOp } = require("../src/provideHover");

let pass = 0;
let fail = 0;

function t(name, fn) {
  try {
    fn();
    pass++;
    console.log(`  ok  ${name}`);
  } catch (e) {
    fail++;
    console.log(`  FAIL ${name}`);
    console.log(`       ${e.message}`);
  }
}

console.log("provideFoldingRanges");
t("section + ! close", () => {
  const text = "@section:'A'\n  dup\n!\n";
  const r = findSectionRanges(text);
  assert.strictEqual(r.length, 1);
  assert.strictEqual(r[0].start, 1);
  assert.strictEqual(r[0].end, 3);
});

t("@s alias + end close", () => {
  const text = "@s:'B'\n  dup\nend\n";
  const r = findSectionRanges(text);
  assert.strictEqual(r.length, 1);
});

t("nested sections", () => {
  const text = "@section:'A'\n@s:'B'\ndup\n!\n!\n";
  const r = findSectionRanges(text);
  assert.strictEqual(r.length, 2);
});

t("multiline /* */ comment", () => {
  const text = "code\n/* line1\nline2 */\nmore\n";
  const r = findBlockCommentRanges(text);
  assert.strictEqual(r.length, 1);
  assert.strictEqual(r[0].start, 2);
  assert.strictEqual(r[0].end, 3);
});

t("single-line /* */ not folded", () => {
  const text = "/* short */\n";
  const r = findBlockCommentRanges(text);
  assert.strictEqual(r.length, 0);
});

t("findAllRanges merges sections + comments", () => {
  const text = "@section:'A'\n/* x\ny */\n!\n";
  const r = findAllRanges(text);
  assert.ok(r.length >= 2);
});

console.log("formatSx");
t("strips trailing whitespace", () => {
  const out = formatSx("dup   \n");
  assert.strictEqual(out, "dup\n");
});

t("tab → 4 spaces (leading)", () => {
  const out = formatSx("\tdup\n");
  assert.strictEqual(out, "    dup\n");
});

t("collapses multi-blanks", () => {
  const out = formatSx("a\n\n\n\nb\n");
  assert.strictEqual(out, "a\n\nb\n");
});

t("removes empty `//`", () => {
  // Step 3 strips `//\n` → ''. Leading blank is preserved (tm parity).
  const out = formatSx("//\ndup\n");
  assert.strictEqual(out, "\ndup\n");
});

t("adds space after //", () => {
  const out = formatSx("//comment\n");
  assert.strictEqual(out, "// comment\n");
});

t("preserves hex annotation //ad68", () => {
  const out = formatSx("//ad68\n");
  assert.strictEqual(out, "//ad68\n");
});

console.log("transformStackIdxs");
t("simple ++", () => {
  assert.strictEqual(transformStackIdxs("2n pick", 1), "3n pick");
});

t("simple --", () => {
  assert.strictEqual(transformStackIdxs("3n pick", -1), "2n pick");
});

t("threshold filters", () => {
  assert.strictEqual(transformStackIdxs("2n pick 5n pick", 1, 3), "2n pick 6n pick");
});

t("clamps at 0", () => {
  assert.strictEqual(transformStackIdxs("0n pick", -1), "0n pick");
});

t("works with roll", () => {
  assert.strictEqual(transformStackIdxs("7n roll", -3), "4n roll");
});

t("preserves comments between Nn and op", () => {
  assert.strictEqual(
    transformStackIdxs("3n /*x*/ pick", 1),
    "4n /*x*/ pick"
  );
});

console.log("provideHover");
t("lookup dup → OP_DUP", () => {
  const op = lookup("dup");
  assert.ok(op);
  assert.strictEqual(op.value, "OP_DUP");
});

t("lookup OP_HASH256", () => {
  const op = lookup("OP_HASH256");
  assert.ok(op);
  assert.strictEqual(op.opcodeNum, 170);
});

t("formatOp includes hex + description", () => {
  const op = lookup("dup");
  const md = formatOp(op);
  assert.ok(md.includes("0x76"));
  assert.ok(md.includes("Duplicates"));
});

t("unknown → null", () => {
  assert.strictEqual(lookup("zzznotreal"), null);
});

console.log("");
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
