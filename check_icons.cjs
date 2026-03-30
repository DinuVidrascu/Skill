const lucide = require('lucide-react');
const fs = require('fs');
const path = require('path');

const iconsFile = fs.readFileSync(path.join(__dirname, 'src', 'constants', 'icons.js'), 'utf8');
const match = iconsFile.match(/import \{([\s\S]+?)\} from 'lucide-react'/);
if (match) {
  const icons = match[1].split(',').map(i => i.trim()).filter(i => i && i !== 'import');
  icons.forEach(i => {
    if (!lucide[i]) {
      console.log(`MISSING: ${i}`);
    }
  });
} else {
  console.log('Could not find imports in icons.js');
}
