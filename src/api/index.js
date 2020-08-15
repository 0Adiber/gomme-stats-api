const express = require('express');

const stats = require('./stats');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Unofficial GommeHD.net Stats API 👋🌎🌍🌏'
  });
});

router.use('/stats', stats);


module.exports = router;
