import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Printer } from 'lucide-react';
import DatePicker from '../../components/DatePicker';
import TimePicker from '../../components/TimePicker';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import api from '../../services/api';

const JadwalPage = () => {
  const [data, setData] = useState([]);
  const [pemohons, setPemohons] = useState([]);
  const [termohons, setTermohons] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to determine text color based on background brightness
  const getContrastColor = (hexcolor) => {
    if (!hexcolor) return '#ffffff';
    hexcolor = hexcolor.replace('#', '');
    if (hexcolor.length === 3) hexcolor = hexcolor.split('').map(c => c + c).join('');
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 4), 16);
    const b = parseInt(hexcolor.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#0f172a' : '#ffffff';
  };
  
  const initialFormState = {
    id: null,
    tanggal: '',
    waktu: '',
    no_register: '',
    ketua_majelis: '',
    anggota_1: '',
    anggota_2: '',
    mediator: '',
    panitera: '',
    pemohon_id: '',
    termohon_id: '',
    agenda_id: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchData = async () => {
    try {
      const [jadwalRes, pemohonRes, termohonRes, agendaRes] = await Promise.all([
        api.get('/jadwal'),
        api.get('/pemohon'),
        api.get('/termohon'),
        api.get('/agenda')
      ]);
      setData(jadwalRes.data);
      setPemohons(pemohonRes.data);
      setTermohons(termohonRes.data);
      setAgendas(agendaRes.data);
    } catch (error) {
      toast.error('Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/jadwal/${formData.id}`, formData);
        toast.success('Jadwal berhasil diubah');
      } else {
        await api.post('/jadwal', formData);
        toast.success('Jadwal berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Gagal menyimpan jadwal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus jadwal ini?')) {
      try {
        await api.delete(`/jadwal/${id}`);
        toast.success('Jadwal berhasil dihapus');
        fetchData();
      } catch (error) {
        toast.error('Gagal menghapus jadwal');
      }
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Manajemen Jadwal</h1>
          <p className="text-base-content/60 mt-1">Kelola data jadwal persidangan</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="btn btn-outline flex-1 sm:flex-none" onClick={() => window.print()}>
            <Printer size={20} /> Cetak
          </button>
          <button onClick={() => openModal()} className="btn btn-primary flex-1 sm:flex-none shadow-sm">
            <Plus size={20} /> Tambah
          </button>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full whitespace-nowrap text-center">
            <thead className="bg-base-200 text-base-content">
              <tr>
                <th className="text-center">Waktu</th>
                <th className="text-center">Pukul</th>
                <th className="text-center">No. Register</th>
                <th className="text-center">Pemohon</th>
                <th className="text-center">Termohon</th>
                <th className="text-center">Agenda</th>
                <th className="text-center sticky right-0 bg-base-200 z-10 shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8"><span className="loading loading-spinner text-primary"></span></td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-base-content/50">Belum ada jadwal</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="font-semibold text-base-content">
                        {format(new Date(item.tanggal), 'dd MMM yyyy', { locale: idLocale })}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-primary font-bold">{item.waktu?.substring(0, 5)} WIB</div>
                    </td>
                    <td className="font-medium">{item.no_register}</td>
                    <td>
                      <div className="text-sm font-semibold">{item.pemohon?.nama_pemohon}</div>
                    </td>
                    <td>
                      <div className="text-sm text-base-content/80">{item.termohon?.nama_termohon}</div>
                    </td>
                    <td>
                      <span 
                        className="badge badge-sm py-3 px-3 font-semibold gap-1 border-none shadow-sm"
                        style={{ 
                          backgroundColor: item.agenda?.warna || '#eab308',
                          color: getContrastColor(item.agenda?.warna || '#eab308')
                        }}
                      >
                        {item.agenda?.nama_agenda}
                      </span>
                    </td>
                    <td className="sticky right-0 bg-base-100 shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openModal(item)} className="btn btn-sm btn-square btn-ghost text-info hover:bg-info/20">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-square btn-ghost text-error hover:bg-error/20">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DaisyUI Modal for Form */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl">
          <h2 className="text-xl font-bold text-base-content p-6 border-b border-base-200 flex-shrink-0 bg-base-100">
            {formData.id ? 'Edit Jadwal Sidang' : 'Tambah Jadwal Sidang'}
          </h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden bg-base-200/50">
            <div className="space-y-6 overflow-y-auto flex-1 p-6">
              
              {/* Section 1: Informasi Waktu & Register */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-base-100 p-5 rounded-xl shadow-sm border border-base-200">
                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-bold">Tanggal Sidang</span></label>
                  <DatePicker 
                    value={formData.tanggal}
                    onChange={(val) => setFormData({ ...formData, tanggal: val })}
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-bold">Waktu Sidang</span></label>
                  <TimePicker
                    value={formData.waktu}
                    onChange={(val) => setFormData({ ...formData, waktu: val })}
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-bold">Nomor Register</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: 001/I/KIA/2026"
                    className="input input-bordered w-full"
                    value={formData.no_register}
                    onChange={(e) => setFormData({ ...formData, no_register: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 2: Pihak & Agenda */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-base-100 p-5 rounded-xl shadow-sm border border-base-200">
                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-bold">Pemohon</span></label>
                  <select
                    required
                    className="select select-bordered w-full"
                    value={formData.pemohon_id}
                    onChange={(e) => setFormData({ ...formData, pemohon_id: e.target.value })}
                  >
                    <option value="" disabled>Pilih Pemohon...</option>
                    {pemohons.map(p => <option key={p.id} value={p.id}>{p.nama_pemohon}</option>)}
                  </select>
                </div>
                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-bold">Termohon</span></label>
                  <select
                    required
                    className="select select-bordered w-full"
                    value={formData.termohon_id}
                    onChange={(e) => setFormData({ ...formData, termohon_id: e.target.value })}
                  >
                    <option value="" disabled>Pilih Termohon...</option>
                    {termohons.map(t => <option key={t.id} value={t.id}>{t.nama_termohon}</option>)}
                  </select>
                </div>
                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-bold">Agenda Sidang</span></label>
                  <select
                    required
                    className="select select-bordered w-full"
                    value={formData.agenda_id}
                    onChange={(e) => setFormData({ ...formData, agenda_id: e.target.value })}
                  >
                    <option value="" disabled>Pilih Agenda...</option>
                    {agendas.map(a => <option key={a.id} value={a.id}>{a.nama_agenda}</option>)}
                  </select>
                </div>
              </div>

              {/* Section 3: Perangkat Sidang */}
              <div className="bg-base-100 p-5 rounded-xl shadow-sm border border-base-200">
                <h3 className="text-sm font-black text-base-content/50 uppercase tracking-widest mb-4 border-b border-base-200 pb-2">Perangkat Persidangan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Kolom Kiri */}
                  <div className="space-y-4">
                    <div className="form-control w-full">
                      <label className="label"><span className="label-text font-semibold">Ketua Majelis</span></label>
                      <input type="text" required className="input input-bordered w-full" value={formData.ketua_majelis} onChange={(e) => setFormData({ ...formData, ketua_majelis: e.target.value })} />
                    </div>
                    <div className="form-control w-full">
                      <label className="label"><span className="label-text font-semibold">Anggota Majelis 1</span></label>
                      <input type="text" required className="input input-bordered w-full" value={formData.anggota_1} onChange={(e) => setFormData({ ...formData, anggota_1: e.target.value })} />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-semibold">Anggota Majelis 2</span>
                        <span className="label-text-alt text-base-content/50">Opsional</span>
                      </label>
                      <input type="text" className="input input-bordered w-full" value={formData.anggota_2} onChange={(e) => setFormData({ ...formData, anggota_2: e.target.value })} />
                    </div>
                  </div>
                  
                  {/* Kolom Kanan */}
                  <div className="space-y-4">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-semibold">Mediator</span>
                        <span className="label-text-alt text-base-content/50">Opsional</span>
                      </label>
                      <input type="text" className="input input-bordered w-full" value={formData.mediator} onChange={(e) => setFormData({ ...formData, mediator: e.target.value })} />
                    </div>
                    <div className="form-control w-full">
                      <label className="label"><span className="label-text font-semibold">Panitera Pengganti</span></label>
                      <input type="text" required className="input input-bordered w-full" value={formData.panitera} onChange={(e) => setFormData({ ...formData, panitera: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-base-200 flex-shrink-0 bg-base-100">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost px-8">Batal</button>
              <button type="submit" className="btn btn-primary px-8">Simpan Jadwal</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default JadwalPage;
