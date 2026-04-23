const fs = require('fs');
let code = fs.readFileSync('components/pages/login-page.tsx', 'utf8');

code = code.replace('{/* Role selection */}', '{/* Role selection */}\n            {mode === \'signup\' && (');
code = code.replace('              </div>\n            </div>\n\n            {mode === \'signup\' && (', '              </div>\n            </div>\n            )}\\n\n            {mode === \'signup\' && (');

fs.writeFileSync('components/pages/login-page.tsx', code);
console.log('Fixed UI in LoginPage');