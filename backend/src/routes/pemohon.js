const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET all pemohon
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('pemohon').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST create pemohon
router.post('/', async (req, res) => {
    const { nama_pemohon, kategori_pemohon } = req.body;
    const { data, error } = await supabase.from('pemohon').insert([{ nama_pemohon, kategori_pemohon }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

// PUT update pemohon
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nama_pemohon, kategori_pemohon } = req.body;
    const { data, error } = await supabase.from('pemohon').update({ nama_pemohon, kategori_pemohon }).eq('id', id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// DELETE pemohon
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('pemohon').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Deleted successfully' });
});

module.exports = router;
