const express = require('express');
const router = express.Router();
const Persona = require('../models/Persona');

router.post('/personas', async (req, res) => {
  try {
    const nuevaPersona = new Persona(req.body);
    await nuevaPersona.save();
    res.status(201).json(nuevaPersona);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;