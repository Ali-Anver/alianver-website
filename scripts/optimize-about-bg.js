import sharp from 'sharp';
import fs from 'fs';

async function optimize() {
    const input = 'public/images/about-bg.png';
    const output = 'public/images/about-bg.webp';
    
    if (fs.existsSync(input)) {
        await sharp(input)
            .webp({ quality: 80 }) // 80% 质量是平衡点
            .toFile(output);
        console.log('Success: about-bg.webp created.');
        
        const oldSize = fs.statSync(input).size / 1024;
        const newSize = fs.statSync(output).size / 1024;
        console.log(`Size reduction: ${oldSize.toFixed(2)}KB -> ${newSize.toFixed(2)}KB`);
    }
}

optimize();
