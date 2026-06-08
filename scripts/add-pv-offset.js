import fs from 'fs';
import path from 'path';

function getRandomOffset(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const postsDir = 'src/content/posts';

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.md')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const files = getAllFiles(postsDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // 匹配 frontmatter
    const match = content.match(/^---\n([\s\S]+?)\n---/);
    if (match) {
        let frontmatter = match[1];
        
        // 检查是否已有 pv_offset
        if (!frontmatter.includes('pv_offset:')) {
            const offset = getRandomOffset(9000, 12000);
            // 在末尾添加，保持良好的格式
            const newFrontmatter = frontmatter.trim() + `\npv_offset: ${offset}`;
            content = content.replace(frontmatter, newFrontmatter);
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated: ${file} -> +${offset}`);
        } else {
            console.log(`Skipped (already exists): ${file}`);
        }
    }
});
