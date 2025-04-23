const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '..', '..', 'data');

const getFilePath = (filename) => path.join(dataPath, filename);

async function leerJSON(filename) {
  const filePath = getFilePath(filename);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error(`Error al leer ${filename}:`, error);
    return [];
  }
}

async function guardarJSON(filename, data) {
  const filePath = getFilePath(filename);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error al guardar ${filename}:`, error);
  }
}

module.exports = { leerJSON, guardarJSON };
