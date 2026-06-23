const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pemohonRoutes = require('./routes/pemohon');
const termohonRoutes = require('./routes/termohon');
const agendaRoutes = require('./routes/agenda');
const jadwalRoutes = require('./routes/jadwal');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/pemohon', pemohonRoutes);
app.use('/api/termohon', termohonRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/jadwal', jadwalRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
