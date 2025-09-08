require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const videosRoute = require('./routes/videos');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongo connected'))
  .catch(err => {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  });

app.use('/videos', videosRoute);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
