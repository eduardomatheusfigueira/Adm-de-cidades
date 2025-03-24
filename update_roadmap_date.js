const fs = require('fs');
const path = require('path');

function getCurrentDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function updateRoadmapFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const dateTime = getCurrentDateTime();
    const updatedLine = `**Última Atualização:** ${dateTime}`;

    const lines = content.split('\\n');
    let updatedContent = '';
    let updated = false;
    for (const line of lines) {
      if (line.startsWith('**Última Atualização:**')) {
        updatedContent += updatedLine + '\\n';
        updated = true;
      } else {
        updatedContent += line + '\\n';
      }
    }
    if (!updated) { // In case the line is not found, append it at the beginning
        updatedContent = updatedLine + '\\n' + content;
    }


    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated date in ${filePath} to: ${dateTime}`);
  } catch (error) {
    console.error(`Error updating ${filePath}: ${error}`);
  }
}

const roadmapFiles = [
  'brazil-game/roadmap.txt',
  'roadmaps/roadmap_revision_8.txt'
];

roadmapFiles.forEach(file => {
  updateRoadmapFile(file);
});
