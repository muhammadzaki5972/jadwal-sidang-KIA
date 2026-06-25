import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AgendaPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, nama_agenda: '', warna: '#eab308' });

  const fetchData = async () => {
    try {
      const response = await api.get('/agenda');
      setData(response.data);
    } catch (error) {
      toast.error('Gagal mengambil data agenda');
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
        await api.put(`/agenda/${formData.id}`, { nama_agenda: formData.nama_agenda, warna: formData.warna });
        toast.success('Agenda berhasil diubah');
      } else {
        await api.post('/agenda', { nama_agenda: formData.nama_agenda, warna: formData.warna });
        toast.success('Agenda berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Gagal menyimpan agenda');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus agenda ini?')) {
      try {
        await api.delete(`/agenda/${id}`);
        toast.success('Agenda berhasil dihapus');
        fetchData();
      } catch (error) {
        toast.error('Gagal menghapus agenda');
      }
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData({ id: item.id, nama_agenda: item.nama_agenda, warna: item.warna || '#eab308' });
    } else {
      setFormData({ id: null, nama_agenda: '', warna: '#eab308' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Manajemen Agenda</h1>
          <p className="text-base-content/60 mt-1">Kelola data opsi agenda sidang</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary shadow-sm hover:shadow-md transition-all">
          <Plus className="w-5 h-5" /> Tambah Agenda
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200/50">
                <th className="w-16">No</th>
                <th>Nama Agenda</th>
                <th className="w-24 text-center">Warna</th>
                <th className="w-32 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-10">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-base-content/50 font-medium">
                    Belum ada data agenda.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className="hover">
                    <td className="font-medium text-base-content/60">{index + 1}</td>
                    <td className="font-semibold">{item.nama_agenda}</td>
                    <td className="text-center">
                      <div className="w-6 h-6 rounded-full mx-auto border shadow-sm" style={{ backgroundColor: item.warna || '#eab308' }}></div>
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openModal(item)} className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10">
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal Form */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box p-0 overflow-hidden max-w-md rounded-2xl">
          <div className="bg-primary p-6 text-primary-content">
            <h3 className="font-black text-2xl">{formData.id ? 'Edit Agenda' : 'Tambah Agenda'}</h3>
            <p className="text-primary-content/80 text-sm mt-1">Silakan isi formulir di bawah ini</p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="p-6 space-y-4 flex-1">
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Nama Agenda</span></label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mediasi Tahap 1"
                  className="input input-bordered w-full focus:input-primary transition-all"
                  value={formData.nama_agenda}
                  onChange={(e) => setFormData({ ...formData, nama_agenda: e.target.value })}
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Warna Label</span></label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    className="w-12 h-12 rounded cursor-pointer border-none p-0"
                    value={formData.warna || '#eab308'}
                    onChange={(e) => setFormData({ ...formData, warna: e.target.value })}
                  />
                  <span className="text-sm font-mono bg-base-200 px-3 py-1 rounded">{formData.warna || '#eab308'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-base-200 bg-base-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost px-6">Batal</button>
              <button type="submit" className="btn btn-primary px-8 shadow-sm">Simpan</button>
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

export default AgendaPage;
