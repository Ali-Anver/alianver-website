
/**
 * Webmention/Backlink Checker for CI
 * Supports WEBMENTION_TOKEN for domain-wide search
 */

async function fetchWebmentions() {
  const DOMAIN = 'xice.cx';
  const TOKEN = process.env.WEBMENTION_TOKEN;
  
  // 如果没有 token，API 不允许查全域，我们提示用户
  if (!TOKEN) {
    console.log(`\nℹ️  Note: WEBMENTION_TOKEN is not set. Domain-wide backlink scanning is disabled.`);
    console.log(`   To enable this, get your token at https://webmention.io/settings and add it as a GitHub Secret.`);
    return;
  }

  const url = `https://webmention.io/api/mentions.jf2?domain=${DOMAIN}&token=${TOKEN}`;

  console.log(`\n🔍 Scanning for external backlinks/republications for ${DOMAIN}...`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ API Error: ${errorData.error_description || response.statusText}`);
      return;
    }

    const data = await response.json();
    if (!data.children || data.children.length === 0) {
      console.log('✅ No new external backlinks detected.');
      return;
    }

    console.log(`🚀 Found ${data.children.length} recent external references:\n`);
    data.children.forEach((mention, index) => {
      const type = mention['wm-property'] === 'repost-of' ? '🔄 REPOST' : '🔗 MENTION';
      console.log(`[${index + 1}] ${type} | ${mention.author?.name || 'Unknown'} -> ${mention.url}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fetchWebmentions();
