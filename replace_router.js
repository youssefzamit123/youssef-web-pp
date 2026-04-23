const fs = require('fs');
const path = require('path');

function processFile(file) {
  if (!fs.statSync(file).isFile() || !file.endsWith('.tsx')) return;
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('setCurrentPage')) {
    // Add import { useRouter } from 'next/navigation';
    if (!content.includes('next/navigation')) {
      const importIndex = content.lastIndexOf('import ');
      const importEnd = content.indexOf(';\n', importIndex) > -1 ? content.indexOf(';\n', importIndex) + 1 : content.indexOf('\n', importIndex);
      content = content.slice(0, importEnd) + '\nimport { useRouter } from \'next/navigation\';\n' + content.slice(importEnd);
    }
    
    // add router hook
    if (!content.includes('const router = useRouter()')) {
        content = content.replace(/const\s*{\s*([^}]*)setCurrentPage([^}]*)\s*}\s*=\s*useAppContext\(\);?/, (match, p1, p2) => {
            const others = (p1 + p2).trim().split(',').filter(Boolean).map(s => s.trim()).join(', ');
            let replacement = 'const router = useRouter();';
            if (others) {
               replacement += `\n  const { ${others} } = useAppContext();`;
            }
            return replacement;
        });
    }

    // replace setCurrentPage('route') with router.push('/route')
    // except for 'landing', which should be '/'
    content = content.replace(/setCurrentPage\('([^']+)'\)/g, (match, route) => {
        if (route === 'landing') return 'router.push(\'/\')';
        return `router.push('/${route}')`;
    });
    
    // Update active tab logic in Navbar
    content = content.replace(/currentPage === '([^']+)'/g, (match, route) => {
        if (route === 'landing') return "typeof window !== 'undefined' && window.location.pathname === '/'";
        return `typeof window !== 'undefined' && window.location.pathname === '/${route}'`;
    });

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else processFile(p);
  });
}

walk('components');
walk('app');

