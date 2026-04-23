const fs = require('fs');
let content = fs.readFileSync('components/pages/ai-smile-simulator-page.tsx', 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync('components/pages/ai-smile-simulator-page.tsx', content, 'utf8');
console.log('Fixed backticks');
