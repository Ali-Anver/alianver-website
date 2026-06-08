import fs from 'node:fs';
import path from 'node:path';

const redirectFilePath = path.resolve('./public/_redirects');

const manualRules = [
    '# --- Manual Fixes ---',
    '/2025/11/10/CM-screenshot/       /archive/ 301',
    '/masonry/                        /archive/ 301',
    '/posts/2026/01/08/cepato-aio-architecture/ /404 301'
];

const baseContent = `# --- Static Assets Passthrough (MUST BE FIRST) ---
/_astro/*  /_astro/:splat  200
/fonts/*   /fonts/:splat   200
/images/*  /images/:splat  200

# --- Tags & Categories redirection to Archive ---
/tags/*                      /archive/ 301
/categories/*                /archive/ 301

# --- Pagination redirects ---
/page/*                      / 301
`;

const finalContent = baseContent + '\n' + manualRules.join('\n') + '\n';

fs.writeFileSync(redirectFilePath, finalContent);
console.log('Successfully updated _redirects with minimal rules.');