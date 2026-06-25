const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET all agenda
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('agenda_sidang').select('*').order('id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST create agenda
router.post('/', async (req, res) => {
    const { nama_agenda, warna } = req.body;
    const { data, error } = await supabase.from('agenda_sidang').insert([{ nama_agenda, warna }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

// PUT update agenda
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nama_agenda, warna } = req.body;
    const { data, error } = await supabase.from('agenda_sidang').update({ nama_agenda, warna }).eq('id', id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// DELETE agenda
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('agenda_sidang').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Deleted successfully' });
});

module.exports = router;
