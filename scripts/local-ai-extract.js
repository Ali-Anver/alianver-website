
import fs from 'fs';
import yaml from 'js-yaml';
import { glob } from 'glob';

/**
 * Local AI Entity Extractor using Ollama
 * Usage: node scripts/local-ai-extract.js
 */

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'qwen2.5:1.5b'; // 确保你已经 ollama pull 了这个模型
const POSTS_DIR = 'src/content/posts/**/*.md';

async function askOllama(content) {
  const prompt = `
    你是一个专业的语义分析助手。请分析以下博文内容，提取其中的关键实体（人物、组织、技术、事件、产品）。
    
    输出要求：
    1. 必须输出为一个符合 JSON 格式的数组。
    2. 每个实体包含： "@type" (Schema.org 类型), "name" (名称), "description" (简短描述)。
    3. 语言必须与原文一致。
    4. 只输出 JSON 数组本身，不要包含任何解释或 Markdown 标签。

    内容：
    ${content.substring(0, 3000)}
  `;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: false,
        format: 'json'
      })
    });

    const data = await response.json();
    return JSON.parse(data.response);
  } catch (e) {
    console.error('Ollama 调用失败，请检查服务是否启动:', e.message);
    return [];
  }
}

async function processFile(filePath) {
  console.log(`正在分析: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  const parts = content.split('---');
  if (parts.length < 3) return;

  const frontmatter = yaml.load(parts[1]);
  const body = parts.slice(2).join('---');

  if (frontmatter.entities && frontmatter.entities.length > 0) {
    console.log(`跳过: ${filePath} (已有实体)`);
    return;
  }

  const entities = await askOllama(body);
  
  if (entities && entities.length > 0) {
    frontmatter.entities = entities;
    const newContent = `---\n${yaml.dump(frontmatter)}---\n${body}`;
    fs.writeFileSync(filePath, newContent);
    console.log(`成功更新: ${filePath}，提取了 ${entities.length} 个实体。`);
  }
}

async function main() {
  const files = await glob(POSTS_DIR);
  console.log(`找到 ${files.length} 篇文章，准备开始本地分析...`);
  for (const file of files) {
    await processFile(file);
  }
}

main().catch(console.error);
