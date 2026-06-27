import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = 'C:\\Users\\AviRazput\\.gemini\\antigravity-ide\\brain\\0ae30d13-e91c-41a9-af23-63a6f8c2d0ba';
const destDir = path.join(__dirname, 'public', 'courses');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const images = {
    'adca_course': 'adca',
    'dca_course': 'dca',
    'dtp_course': 'dtp',
    'cfa_course': 'cfa',
    'dfa_course': 'dfa',
    'ccc_course': 'ccc',
    'ms_office_course': 'ms_office'
};

const files = fs.readdirSync(srcDir);

for (const file of files) {
    if (file.endsWith('.png')) {
        for (const [key, destName] of Object.entries(images)) {
            if (file.startsWith(key)) {
                const srcPath = path.join(srcDir, file);
                const destPath = path.join(destDir, `${destName}.png`);
                fs.copyFileSync(srcPath, destPath);
                console.log(`Copied ${destName}.png successfully!`);
            }
        }
    }
}
console.log('All available generated images copied to public/courses!');
