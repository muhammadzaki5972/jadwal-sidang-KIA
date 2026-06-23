const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET all agenda
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('agenda_sidang').select('*').order('id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;
