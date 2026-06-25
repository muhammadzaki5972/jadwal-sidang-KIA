const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET all jadwal
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('jadwal_sidang')
        .select(`
            *,
            pemohon:pemohon_id(id, nama_pemohon, kategori_pemohon),
            termohon:termohon_id(id, nama_termohon, kategori_termohon),
            agenda:agenda_id(id, nama_agenda, warna)
        `)
        .order('tanggal', { ascending: true })
        .order('waktu', { ascending: true });
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST create jadwal
router.post('/', async (req, res) => {
    const { 
        tanggal, waktu, no_register, ketua_majelis, anggota_1, anggota_2, 
        mediator, panitera, pemohon_id, termohon_id, agenda_id 
    } = req.body;
    
    const { data, error } = await supabase.from('jadwal_sidang').insert([{ 
        tanggal, waktu, no_register, ketua_majelis, anggota_1, anggota_2, 
        mediator, panitera, pemohon_id, termohon_id, agenda_id 
    }]).select();
    
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

// PUT update jadwal
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { 
        tanggal, waktu, no_register, ketua_majelis, anggota_1, anggota_2, 
        mediator, panitera, pemohon_id, termohon_id, agenda_id 
    } = req.body;
    
    const { data, error } = await supabase.from('jadwal_sidang').update({ 
        tanggal, waktu, no_register, ketua_majelis, anggota_1, anggota_2, 
        mediator, panitera, pemohon_id, termohon_id, agenda_id 
    }).eq('id', id).select();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// DELETE jadwal
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('jadwal_sidang').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Deleted successfully' });
});

module.exports = router;
