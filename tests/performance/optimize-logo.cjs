// Reproduce with Node 20 and sharp 0.34.5 (kept outside app dependencies):
// npm exec --yes --package=sharp@0.34.5 -- node --version
// node tests/performance/optimize-logo.cjs <cached node_modules/sharp directory>
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const sharp = require(process.argv[2] || "sharp");

const root = path.resolve(__dirname, "../..");
const inputPath = "capstonefall2026/src/assets/techsmartLogo.png";
const outputPath = "capstonefall2026/src/assets/techsmartLogo.webp";
const reportPath = "tests/performance/2026-11-05-speed-index-local/logo-encoding.json";
const options = { lossless: true, effort: 6 };
const hash = (data) => crypto.createHash("sha256").update(data).digest("hex");

async function main() {
  if (sharp.versions.sharp !== "0.34.5") {
    throw new Error(`Expected sharp 0.34.5, received ${sharp.versions.sharp}`);
  }
  const input = await fs.readFile(path.join(root, inputPath));
  const output = await sharp(input).webp(options).toBuffer();
  const inputMetadata = await sharp(input).metadata();
  const outputMetadata = await sharp(output).metadata();
  const original = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const encoded = await sharp(output).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (original.info.width !== encoded.info.width || original.info.height !== encoded.info.height) {
    throw new Error("Image dimensions changed");
  }
  let differingBytes = 0;
  let differingPixels = 0;
  let differingVisiblePixels = 0;
  let differingAlphaSamples = 0;
  for (let offset = 0; offset < original.data.length; offset += 4) {
    let different = false;
    for (let channel = 0; channel < 4; channel += 1) {
      if (original.data[offset + channel] !== encoded.data[offset + channel]) {
        differingBytes += 1;
        different = true;
      }
    }
    if (different) {
      differingPixels += 1;
      if (original.data[offset + 3] !== 0 || encoded.data[offset + 3] !== 0) {
        differingVisiblePixels += 1;
      }
    }
    if (original.data[offset + 3] !== encoded.data[offset + 3]) {
      differingAlphaSamples += 1;
    }
  }
  const originalWhite = await sharp(input).flatten({ background: "#ffffff" }).raw().toBuffer();
  const encodedWhite = await sharp(output).flatten({ background: "#ffffff" }).raw().toBuffer();
  const whiteEqual = originalWhite.equals(encodedWhite);
  if (differingVisiblePixels || differingAlphaSamples || !whiteEqual) {
    throw new Error("Visible pixels or alpha changed");
  }
  const describe = (filePath, buffer, metadata, pixels) => ({
    path: filePath,
    bytes: buffer.length,
    sha256: hash(buffer),
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    colorSpace: metadata.space,
    hasAlpha: metadata.hasAlpha,
    decodedRgbaSha256: hash(pixels),
  });
  const report = {
    generatedAt: new Date().toISOString(),
    tool: { node: process.version, sharp: sharp.versions.sharp, libvips: sharp.versions.vips, libwebp: sharp.versions.webp },
    encoding: { format: "webp", options, resize: false },
    input: describe(inputPath, input, inputMetadata, original.data),
    output: describe(outputPath, output, outputMetadata, encoded.data),
    savings: { bytes: input.length - output.length, percent: Number(((1 - output.length / input.length) * 100).toFixed(2)) },
    comparison: {
      method: "Decode both files with sharp 0.34.5 to unpremultiplied RGBA, compare all channels; also flatten both onto white and compare decoded RGB bytes.",
      pixelsCompared: original.info.width * original.info.height,
      rawRgbaEqual: original.data.equals(encoded.data),
      differingBytes,
      differingPixels,
      differingVisiblePixels,
      differingAlphaSamples,
      visiblePixelsEqual: differingVisiblePixels === 0,
      alphaEqual: differingAlphaSamples === 0,
      compositedWhiteEqual: whiteEqual,
      explanation: differingPixels ? "Any differences are restricted to RGB values of fully transparent pixels; visible pixels and all alpha samples are identical." : "All decoded RGBA bytes are identical.",
    },
  };
  await fs.mkdir(path.dirname(path.join(root, reportPath)), { recursive: true });
  await fs.writeFile(path.join(root, outputPath), output);
  await fs.writeFile(path.join(root, reportPath), `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
