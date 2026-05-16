const fs = require('fs/promises');
const path = require('path');
const { seedData } = require('./seedData');

const defaultDataFile = () => {
  if (process.env.DATA_FILE) {
    return process.env.DATA_FILE;
  }

  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    return path.join('/tmp', 'marketplace.json');
  }

  return path.join(__dirname, '..', 'data', 'marketplace.json');
};

const dataFile = () => defaultDataFile();

let mutationQueue = Promise.resolve();

async function ensureDataFile() {
  const filePath = dataFile();
  const directory = path.dirname(filePath);

  await fs.mkdir(directory, { recursive: true });

  try {
    await fs.access(filePath);
  } catch (error) {
    await fs.writeFile(filePath, JSON.stringify(seedData, null, 2));
  }
}

async function readStore() {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile(), 'utf-8');
  return JSON.parse(raw);
}

async function writeStore(nextState) {
  await ensureDataFile();
  await fs.writeFile(dataFile(), JSON.stringify(nextState, null, 2));
}

function mutateStore(mutator) {
  mutationQueue = mutationQueue.then(async () => {
    const state = await readStore();
    const result = await mutator(state);
    await writeStore(state);
    return result;
  });

  return mutationQueue;
}

module.exports = {
  dataFile,
  ensureDataFile,
  readStore,
  writeStore,
  mutateStore,
};
