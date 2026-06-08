import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath = 'public/images/14.svg';
const outputWebP = 'public/images/14.webp';
const outputPng = 'public/images/14.png';

async function optimize() {
  try {
    const svgBuffer = fs.readFileSync(inputPath);
    console.log(`Original SVG size: ${(svgBuffer.length / 1024).toFixed(2)} KB`);

    // Convert to WebP
    await sharp(svgBuffer, { density: 300 })
      .resize(512, 512)
      .webp({ quality: 90 })
      .toFile(outputWebP);
    
    // Convert to PNG
    await sharp(svgBuffer, { density: 300 })
      .resize(512, 512)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(outputPng);

    const webpStats = fs.statSync(outputWebP);
    const pngStats = fs.statSync(outputPng);

    console.log(`Optimized WebP size: ${(webpStats.size / 1024).toFixed(2)} KB`);
    console.log(`Optimized PNG size: ${(pngStats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error("Error processing image:", error);
  }
}

optimize();
