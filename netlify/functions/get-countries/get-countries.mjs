// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
import dotenv from 'dotenv';
import MongoClient from '../../classes/MongoClient.mjs';

dotenv.config();

const dbPassword = process.env.MONGO_DB_ATLAS_PW;

const dbName = 'ai-travel-guide-db';
const collectionNameCountries = 'countries';
const collectionNameCache = 'gpt-query-cache';
const collectionNameErrors = 'gpt-query-errors';
const uidKeys = ['name'];
// Replace the following with your MongoDB Atlas connection string
const dbUri = `mongodb+srv://admin:${dbPassword}@ai-travel-guide-cluster.yurozgs.mongodb.net/?retryWrites=true&w=majority`;

/** @var MongoClient */
const mongoClientCountries = new MongoClient(
  dbName,
  dbPassword,
  dbUri,
  collectionNameCountries,
  collectionNameCache,
  collectionNameErrors,
  uidKeys
);

async function getCountries() {
  const countries = [];
  const docs = await mongoClientCountries.fetchAll();

  while (await docs.hasNext()) {
    const doc = await docs.next();
    countries.push(doc);
  }

  return countries;
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};

const handler = async (event) => {
  try {
    const countries = await getCountries();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ countries })
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

export { handler }
