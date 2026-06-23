const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET all termohon
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('termohon').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST create termohon
router.post('/', async (req, res) => {
    const { nama_termohon, kategori_termohon } = req.body;
    const { data, error } = await supabase.from('termohon').insert([{ nama_termohon, kategori_termohon }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

// PUT update termohon
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nama_termohon, kategori_termohon } = req.body;
    const { data, error } = await supabase.from('termohon').update({ nama_termohon, kategori_termohon }).eq('id', id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// DELETE termohon
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('termohon').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Deleted successfully' });
});

module.exports = router;
