const fs = require('fs');
const path = require('path');

// Paths
const distDir = path.join(__dirname, 'dist', "assets");
const htmlFilePath = path.join(distDir, 'index.html');

// Function to find the first file with a specific extension in a directory
function findFileByExtension(dir, ext) {
  const files = fs.readdirSync(dir);
  return files.find(file => file.endsWith(ext)) || null;
}

// Load HTML file
let htmlContent;
try {
  htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
} catch (error) {
  console.error(`Error reading HTML file: ${error.message}`);
  process.exit(1);
}

// Inline CSS
const cssFileName = findFileByExtension(path.join(__dirname, 'dist', "assets"), '.css');
if (cssFileName) {
  const cssFilePath = path.join(distDir, cssFileName);
  const cssContent = fs.readFileSync(cssFilePath, 'utf-8');
  const cssTag = `<style>${cssContent}</style>`;
  htmlContent = htmlContent.replace('</head>', `${cssTag}</head>`);
  console.log(`Inlined CSS file: ${cssFileName}`);
} else {
  console.warn('No CSS file found to inline.');
}

// Inline JavaScript
const jsFileName = findFileByExtension(path.join(__dirname, 'dist', "assets"), '.js');
if (jsFileName) {
  const jsFilePath = path.join(distDir, jsFileName);
  const jsContent = fs.readFileSync(jsFilePath, 'utf-8');
  const jsTag = `<script>${jsContent}</script>`;
  htmlContent = htmlContent.replace('</body>', `${jsTag}</body>`);
  console.log(`Inlined JavaScript file: ${jsFileName}`);
} else {
  console.warn('No JavaScript file found to inline.');
}

// Write the modified HTML back to disk
try {
  fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');
  console.log('Assets have been inlined into the HTML file successfully!');
} catch (error) {
  console.error(`Error writing inlined HTML file: ${error.message}`);
}
