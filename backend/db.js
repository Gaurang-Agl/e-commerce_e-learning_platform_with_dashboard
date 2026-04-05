/* ============================================
   JSON File-Based Database
   Zero-config, no native dependencies
   ============================================ */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getCollection(name) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

function saveCollection(name, data) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const db = {
  findAll: (collection) => getCollection(collection),

  findById: (collection, id) => {
    return getCollection(collection).find(item => item.id === id);
  },

  findOne: (collection, predicate) => {
    return getCollection(collection).find(predicate);
  },

  filter: (collection, predicate) => {
    return getCollection(collection).filter(predicate);
  },

  insert: (collection, item) => {
    const data = getCollection(collection);
    data.push(item);
    saveCollection(collection, data);
    return item;
  },

  insertMany: (collection, items) => {
    const data = getCollection(collection);
    data.push(...items);
    saveCollection(collection, data);
    return items;
  },

  update: (collection, id, updates) => {
    const data = getCollection(collection);
    const idx = data.findIndex(item => item.id === id);
    if (idx === -1) return null;
    data[idx] = { ...data[idx], ...updates };
    saveCollection(collection, data);
    return data[idx];
  },

  delete: (collection, id) => {
    const data = getCollection(collection);
    const filtered = data.filter(item => item.id !== id);
    if (data.length === filtered.length) return false;
    saveCollection(collection, filtered);
    return true;
  },

  count: (collection) => getCollection(collection).length,

  clear: (collection) => saveCollection(collection, []),

  seedIfEmpty: (collection, seedData) => {
    const data = getCollection(collection);
    if (data.length === 0) {
      saveCollection(collection, seedData);
      return true;
    }
    return false;
  }
};

module.exports = db;
