import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const TermohonPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, nama_termohon: '', kategori_termohon: 'Badan Publik Negara' });

  const fetchData = async () => {
    try {
      const res = await api.get('/termohon');
      setData(res.data);
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
        await api.put(`/termohon/${formData.id}`, formData);
        toast.success('Data berhasil diubah');
      } else {
        await api.post('/termohon', formData);
        toast.success('Data berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Gagal menyimpan data');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      try {
        await api.delete(`/termohon/${id}`);
        toast.success('Data berhasil dihapus');
        fetchData();
      } catch (error) {
        toast.error('Gagal menghapus data');
      }
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({ id: null, nama_termohon: '', kategori_termohon: 'Badan Publik Negara' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Data Termohon</h1>
          <p className="text-base-content/60 mt-1">Kelola data pihak termohon sengketa (Badan Publik)</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary shadow-sm">
          <Plus size={20} /> Tambah Termohon
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200 text-base-content">
              <tr>
                <th>No</th>
                <th>Nama Termohon</th>
                <th>Kategori</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8"><span className="loading loading-spinner text-primary"></span></td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-base-content/50">Belum ada data</td></tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id}>
                    <th className="font-medium">{index + 1}</th>
                    <td className="font-semibold">{item.nama_termohon}</td>
                    <td>
                      <div className="badge badge-accent gap-2 badge-sm py-3 px-3 font-semibold">
                        {item.kategori_termohon}
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
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

      {/* DaisyUI Modal */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-6 border-b pb-4">
            {formData.id ? 'Edit Termohon' : 'Tambah Termohon'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Nama Termohon</span>
              </label>
              <input
                type="text"
                required
                className="input input-bordered w-full"
                value={formData.nama_termohon}
                onChange={(e) => setFormData({ ...formData, nama_termohon: e.target.value })}
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Kategori</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.kategori_termohon}
                onChange={(e) => setFormData({ ...formData, kategori_termohon: e.target.value })}
              >
                <option value="Badan Publik Negara">Badan Publik Negara</option>
                <option value="Badan Publik Selain Negara">Badan Publik Selain Negara</option>
              </select>
            </div>
            
            <div className="modal-action mt-6 border-t pt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Batal</button>
              <button type="submit" className="btn btn-primary px-8">Simpan</button>
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

export default TermohonPage;
