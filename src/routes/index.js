const express = require('express');
const router = express.Router();
const Clothe = require('../models/clothes');

router.get('/', async (req, res) => {
  
  const clothes = await Clothe.find();
  res.render('index', { clothes });

});



module.exports = router;
