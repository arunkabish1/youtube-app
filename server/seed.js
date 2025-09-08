require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('./models/Video');

const seedVideoIds = [
  'dQw4w9WgXcQ', '3JZ_D3ELwOQ', 'kXYiU_JCYtU', 'YQHsXMglC9A', 'e-ORhEE9VVg',
  'fRh_vgS2dFE', '2Vv-BfVoq4g', 'LsoLEjrDogU', 'RgKAFK5djSk', 'hT_nvWreIhg'
];

async function run() {
  await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to Mongo — seeding');

  for (const id of seedVideoIds) {
    try {
      await Video.updateOne({ videoId: id }, { videoId: id }, { upsert: true });
      console.log('Upserted', id);
    } catch (err) {
      console.error('Error seeding', id, err.message);
    }
  }

  console.log('Done seeding.');
  process.exit(0);
}

run();
