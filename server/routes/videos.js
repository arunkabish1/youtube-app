const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const axios = require('axios');

// helper to convert ISO8601 duration to mm:ss or HH:MM:SS
function parseDuration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  const hours = parseInt(match[1] || 0, 10);
  const mins = parseInt(match[2] || 0, 10);
  const secs = parseInt(match[3] || 0, 10);
  const parts = [];
  if (hours) parts.push(String(hours).padStart(2, '0'));
  parts.push(String(mins).padStart(2, '0'));
  parts.push(String(secs).padStart(2, '0'));
  return parts.join(':');
}

router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().lean();
    if (!videos || videos.length === 0) return res.json([]);

    const ids = videos.map(v => v.videoId).join(',');
    const apiKey = process.env.YOUTUBE_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ids}&key=${apiKey}`;

    const r = await axios.get(url);
    const items = r.data.items.map(item => ({
      videoId: item.id,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnails: item.snippet.thumbnails,
      duration: parseDuration(item.contentDetails.duration)
    }));

    return res.json(items);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
