const fs = require('fs');

const pages = [
  'login', 'home', 'patient-detail', 'patient-dashboard', 
  'kids-zone', 'ai-smile', 'admin-dashboard'
];

pages.forEach(p => {
  const dir = 'app/' + p;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const compName = p.split('-').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('') + 'Page';
  
  const code = `'use client';

import { ${compName} } from '@/components/pages/${p}-page';

export default function Page() {
  return <${compName} />;
}
`;

  fs.writeFileSync(dir + '/page.tsx', code);
});

console.log('Pages generated successfully.');