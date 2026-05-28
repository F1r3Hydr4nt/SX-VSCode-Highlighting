// stackIdxTransform — pure index transform for `Nn pick|roll` opcodes.
//
// Ported from `tm/src/vscode/stackIdxTransform.js`. String in → string out.
//
// Supports:
//   - Simple ++/-- (delta=+1/-1, threshold=0)
//   - Advanced: only modify indices >= threshold, by +/-N delta

function transformStackIdxs(text, delta, threshold = 0) {
  const pattern = /([+-]?0*)(\d+)(n)((?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*)(pick|roll)\b/gi;

  return text.replace(pattern, (match, prefix, digits, nSuffix, gap, opcode) => {
    const currentValue = parseInt(digits, 10);
    if (currentValue < threshold) return match;
    const newValue = currentValue + delta;
    if (newValue < 0) return match;
    return String(newValue) + nSuffix + gap + opcode;
  });
}

module.exports = { transformStackIdxs };
