-- Supabase Schema for Sistem Manajemen Jadwal Sidang PSI (Komisi Informasi Aceh)

-- 1. Create Tabel Pemohon
CREATE TABLE IF NOT EXISTS public.pemohon (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_pemohon TEXT NOT NULL,
    kategori_pemohon TEXT NOT NULL, -- e.g., Individu, Badan Hukum, Kelompok Orang
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Tabel Termohon
CREATE TABLE IF NOT EXISTS public.termohon (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_termohon TEXT NOT NULL,
    kategori_termohon TEXT NOT NULL, -- e.g., Badan Publik Negara, Badan Publik Selain Negara
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Tabel Agenda Sidang
CREATE TABLE IF NOT EXISTS public.agenda_sidang (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_agenda TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Tabel Jadwal Sidang
CREATE TABLE IF NOT EXISTS public.jadwal_sidang (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanggal DATE NOT NULL,
    waktu TIME NOT NULL,
    no_register TEXT NOT NULL,
    ketua_majelis TEXT NOT NULL,
    anggota_1 TEXT NOT NULL,
    anggota_2 TEXT,
    mediator TEXT,
    panitera TEXT NOT NULL,
    pemohon_id UUID NOT NULL REFERENCES public.pemohon(id) ON DELETE CASCADE,
    termohon_id UUID NOT NULL REFERENCES public.termohon(id) ON DELETE CASCADE,
    agenda_id UUID NOT NULL REFERENCES public.agenda_sidang(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Data: 15 Agenda Dummy
INSERT INTO public.agenda_sidang (nama_agenda) VALUES
('Pemeriksaan Awal'),
('Pembuktian Dokumen'),
('Mendengarkan Keterangan Saksi'),
('Mendengarkan Keterangan Ahli'),
('Pemeriksaan Setempat'),
('Kesimpulan Para Pihak'),
('Pembacaan Putusan Sela'),
('Pembacaan Putusan Akhir'),
('Mediasi Tahap 1'),
('Mediasi Tahap 2'),
('Penyampaian Alat Bukti Tambahan'),
('Klarifikasi Termohon'),
('Klarifikasi Pemohon'),
('Sidang Lanjutan'),
('Penetapan Eksekusi')
ON CONFLICT DO NOTHING;

-- Seed Data: Dummy Pemohon and Termohon for testing
INSERT INTO public.pemohon (nama_pemohon, kategori_pemohon) VALUES
('Ahmad Subarjo', 'Individu'),
('LSM Peduli Aceh', 'Badan Hukum')
ON CONFLICT DO NOTHING;

INSERT INTO public.termohon (nama_termohon, kategori_termohon) VALUES
('Dinas Pendidikan Aceh', 'Badan Publik Negara'),
('Dinas Kesehatan Aceh', 'Badan Publik Negara')
ON CONFLICT DO NOTHING;
