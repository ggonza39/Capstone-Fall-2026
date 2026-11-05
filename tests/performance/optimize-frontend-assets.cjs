// Reproduce with Node 20 and sharp 0.34.5 outside application dependencies:
// node tests/performance/optimize-frontend-assets.cjs <cached node_modules/sharp directory>
// Keep original images; generated variants retain their aspect ratios without enlargement.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require(process.argv[2] || "sharp");

const root = path.resolve(__dirname, "../..");
const assetsDirectory = "capstonefall2026/src/assets";
const reportPath = "tests/performance/2026-11-05-assets-local/image-encoding.json";
const photoOptions = { quality: 82, effort: 6 };
const logoOptions = { lossless: true, effort: 6 };
const imageGroups = [
  {
    kind: "photo",
    files: [
      "senior-tablet-learning.jfif",
      "senior-laptop-learning.jfif",
      "senior-mobile-learning.jfif",
      "senior-group-learning.jfif",
    ],
    widths: [480, 800, 1200],
    options: photoOptions,
  },
  {
    kind: "partner-logo",
    files: [
      "waymoLogo.jfif",
      "insightGlobalLogo.jfif",
      "cumberlandLogo.jfif",
      "hillerLogo.jfif",
      "deltaCommunityLogo.jfif",
    ],
    widths: [210, 420],
    options: logoOptions,
  },
  {
    kind: "header-logo",
    files: ["techsmartLogo.webp"],
    widths: [260, 380],
    options: logoOptions,
  },
];

const hash = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");

function describe(filePath, buffer, metadata) {
  return {
    path: filePath,
    bytes: buffer.length,
    sha256: hash(buffer),
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    colorSpace: metadata.space,
    hasAlpha: metadata.hasAlpha,
  };
}

function photoComparison(reference, decoded) {
  assert.deepEqual(decoded.info, reference.info, "Decoded RGB dimensions/channels must match the resized reference");
  let squaredError = 0;
  for (let index = 0; index < reference.data.length; index += 1) {
    squaredError += (reference.data[index] - decoded.data[index]) ** 2;
  }
  const mse = squaredError / reference.data.length;
  return {
    method: "Decode the WebP and the same-size Lanczos3-resized original to sRGB RGB8; compute channel-wise mean squared error and PSNR with peak sample value 255.",
    reference: "Resized original at the output dimensions; no comparison with a differently sized original.",
    width: reference.info.width,
    height: reference.info.height,
    channels: reference.info.channels,
    samplesCompared: reference.data.length,
    mse,
    psnrDb: mse === 0 ? null : 10 * Math.log10((255 ** 2) / mse),
    identical: mse === 0,
    zeroErrorPsnr: "A null PSNR denotes zero MSE (positive infinity).",
    referenceRgbSha256: hash(reference.data),
    decodedRgbSha256: hash(decoded.data),
  };
}

function logoComparison(reference, decoded) {
  assert.deepEqual(decoded.info, reference.info, "Decoded RGBA dimensions/channels must match the resized reference");
  const identical = decoded.data.equals(reference.data);
  assert.ok(identical, "Lossless WebP must preserve every RGBA byte of the resized reference");
  return {
    method: "Decode the WebP and the same-size Lanczos3-resized original to sRGB RGBA8; compare every channel, including alpha.",
    reference: "Resized original, not the original full-resolution raster; resizing changes the source pixels.",
    width: reference.info.width,
    height: reference.info.height,
    channels: reference.info.channels,
    pixelsCompared: reference.info.width * reference.info.height,
    samplesCompared: reference.data.length,
    identical,
    referenceRgbaSha256: hash(reference.data),
    decodedRgbaSha256: hash(decoded.data),
  };
}

async function main() {
  assert.equal(sharp.versions.sharp, "0.34.5", "Reproduction requires sharp 0.34.5");
  const images = [];
  const pendingWrites = [];

  for (const group of imageGroups) {
    for (const filename of group.files) {
      const inputPath = `${assetsDirectory}/${filename}`;
      const input = await fs.readFile(path.join(root, inputPath));
      const inputMetadata = await sharp(input).metadata();
      const entry = { kind: group.kind, original: describe(inputPath, input, inputMetadata), outputs: [] };

      for (const width of group.widths) {
        assert.ok(width <= inputMetadata.width, `${filename}: requested width must not enlarge the original`);
        const resize = { width, withoutEnlargement: true, kernel: "lanczos3" };
        const outputPath = `${assetsDirectory}/optimized/${path.parse(filename).name}-${width}.webp`;
        const output = await sharp(input).resize(resize).webp(group.options).toBuffer();
        const outputMetadata = await sharp(output).metadata();
        assert.equal(outputMetadata.width, width, `${outputPath}: generated width must match its descriptor`);
        assert.ok(outputMetadata.height <= inputMetadata.height, `${outputPath}: generated height must not enlarge the original`);
        assert.ok(output.length < input.length, `${outputPath}: each derivative must be smaller than the original file`);

        let comparison;
        if (group.kind === "photo") {
          const reference = await sharp(input).resize(resize).toColourspace("srgb").removeAlpha().raw().toBuffer({ resolveWithObject: true });
          const decoded = await sharp(output).toColourspace("srgb").removeAlpha().raw().toBuffer({ resolveWithObject: true });
          comparison = photoComparison(reference, decoded);
        } else {
          const reference = await sharp(input).resize(resize).toColourspace("srgb").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
          const decoded = await sharp(output).toColourspace("srgb").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
          comparison = logoComparison(reference, decoded);
        }

        entry.outputs.push({
          ...describe(outputPath, output, outputMetadata),
          encoding: { format: "webp", options: { ...group.options }, resize },
          savingsFromOriginal: {
            bytes: input.length - output.length,
            percent: (1 - output.length / input.length) * 100,
          },
          comparison,
        });
        pendingWrites.push({ outputPath, output });
      }

      // Source images are retained and must not change while derivatives are generated.
      assert.equal(hash(await fs.readFile(path.join(root, inputPath))), entry.original.sha256, `${inputPath}: original changed during encoding`);
      images.push(entry);
    }
  }

  const report = {
    generatedAtUtc: new Date().toISOString(),
    tool: {
      node: process.version,
      sharp: sharp.versions.sharp,
      libvips: sharp.versions.vips,
      libwebp: sharp.versions.webp,
    },
    originalsPreserved: true,
    aspectRatiosPreserved: "Width-only resizing; height is rounded to the nearest output pixel by sharp.",
    noEnlargement: true,
    metadataPolicy: "Default sharp encoding strips source metadata; sRGB pixel comparisons are recorded below.",
    images,
    totals: {
      originalImages: images.length,
      originalBytes: images.reduce((sum, image) => sum + image.original.bytes, 0),
      generatedImages: pendingWrites.length,
      generatedBytes: pendingWrites.reduce((sum, item) => sum + item.output.length, 0),
      explanation: "Generated bytes include every responsive variant; a browser chooses a candidate per image. These totals are disk inventory, not page-transfer savings.",
    },
  };

  await fs.mkdir(path.join(root, assetsDirectory, "optimized"), { recursive: true });
  for (const { outputPath, output } of pendingWrites) {
    await fs.writeFile(path.join(root, outputPath), output);
  }
  await fs.mkdir(path.dirname(path.join(root, reportPath)), { recursive: true });
  await fs.writeFile(path.join(root, reportPath), `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ reportPath, ...report.totals })}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
