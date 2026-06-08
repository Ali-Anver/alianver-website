import sharp from 'sharp';
import fs from 'fs';

async function optimizeBanner() {
    const input = 'public/images/qwq.webp';
    const output = 'public/images/qwq_new.webp';
    
    if (fs.existsSync(output)) {
        console.log('Output banner already exists, skipping optimization to save time.');
        return;
    }
    
    const metadata = await sharp(input).metadata();
    console.log(`Original: ${metadata.width}x${metadata.height}, Size: ${(fs.statSync(input).size/1024).toFixed(2)} KB`);

    await sharp(input)
        .resize(1920, null, { withoutEnlargement: true }) // 限制最大宽度为 1920px
        .webp({ quality: 90, effort: 6 })
        .toFile(output);

    console.log(`Optimized Size: ${(fs.statSync(output).size/1024).toFixed(2)} KB`);
}

optimizeBanner();
