import { useEffect, useState } from 'react';
import { fetchData, createData, updateData, deleteData } from '../utils/api';
import { Plus, Trash2, Edit2, X, Lock } from 'lucide-react';
import MultiSelect from '../components/MultiSelect';
import ErrorPage from './ErrorPage';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('adminAuth') === 'true');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [serverError, setServerError] = useState(false);

  const [activeTab, setActiveTab] = useState('entitas');
  const [data, setData] = useState({ entitas: [], dokumen: [], aksi: [] });
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const loadAll = async () => {
    setLoading(true);
    setServerError(false);
    try {
      const [e, d, a] = await Promise.all([
        fetchData('entitas'),
        fetchData('dokumen'),
        fetchData('aksi')
      ]);
      setData({ entitas: e, dokumen: d, aksi: a });
    } catch (err) {
      console.error(err);
      setServerError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAll();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    const envPasscode = import.meta.env.VITE_ADMIN_PASSCODE;
    
    if (passcodeInput === envPasscode) {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleDelete = async (id) => {
    if(confirm('Hapus data ini?')) {
      await deleteData(activeTab, id);
      loadAll();
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      if (activeTab === 'entitas') setFormData({ nama: '' });
      if (activeTab === 'dokumen') setFormData({ nama: '', penjelasanSingkat: '', penandatangan: [], butuhCap: false });
      if (activeTab === 'aksi') setFormData({ nama: '', deskripsi: '', proses: '', dokumenPersyaratan: [], dokumenHasil: [], aktor: [] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await updateData(activeTab, editingItem.id, formData);
    } else {
      await createData(activeTab, formData);
    }
    closeModal();
    loadAll();
  };

  const handleMultiSelectChange = (values, field) => {
    setFormData({ ...formData, [field]: values });
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nama</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder={`Masukkan nama ${activeTab}...`}
            required 
            value={formData.nama || ''} 
            onChange={e => setFormData({...formData, nama: e.target.value})} 
          />
        </div>

        {activeTab === 'dokumen' && (
          <>
            <div className="form-group">
              <label className="form-label">Penjelasan Singkat</label>
              <textarea 
                className="form-control" 
                placeholder="Tuliskan penjelasan singkat mengenai dokumen ini..."
                value={formData.penjelasanSingkat || ''} 
                onChange={e => setFormData({...formData, penjelasanSingkat: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Penandatangan (Pilih beberapa)</label>
              <MultiSelect 
                options={data.entitas}
                selected={formData.penandatangan || []}
                onChange={(values) => handleMultiSelectChange(values, 'penandatangan')}
                placeholder="Pilih penandatangan..."
              />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                checked={formData.butuhCap || false} 
                onChange={e => setFormData({...formData, butuhCap: e.target.checked})} 
              />
              <label className="form-label" style={{ margin: 0 }}>Butuh Cap/Stempel</label>
            </div>
          </>
        )}

        {activeTab === 'aksi' && (
          <>
            <div className="form-group">
              <label className="form-label">Deskripsi Singkat</label>
              <textarea 
                className="form-control" 
                placeholder="Jelaskan secara singkat mengenai tahapan aksi ini..."
                value={formData.deskripsi || ''} 
                onChange={e => setFormData({...formData, deskripsi: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Proses / Tahapan</label>
              <textarea 
                className="form-control" 
                placeholder="Jelaskan detail proses/approval (teks bebas)..."
                value={formData.proses || ''} 
                onChange={e => setFormData({...formData, proses: e.target.value})} 
                style={{ minHeight: '100px' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Pihak Terlibat (Aktor)</label>
              <MultiSelect 
                options={data.entitas}
                selected={formData.aktor || []}
                onChange={(values) => handleMultiSelectChange(values, 'aktor')}
                placeholder="Pilih aktor..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Dokumen Persyaratan</label>
              <MultiSelect 
                options={data.dokumen}
                selected={formData.dokumenPersyaratan || []}
                onChange={(values) => handleMultiSelectChange(values, 'dokumenPersyaratan')}
                placeholder="Pilih dokumen persyaratan..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Dokumen Hasil</label>
              <MultiSelect 
                options={data.dokumen}
                selected={formData.dokumenHasil || []}
                onChange={(values) => handleMultiSelectChange(values, 'dokumenHasil')}
                placeholder="Pilih dokumen hasil..."
              />
            </div>
          </>
        )}

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={closeModal}>Batal</button>
          <button type="submit" className="btn btn-primary">Simpan Data</button>
        </div>
      </form>
    );
  };

  if (serverError) return <ErrorPage code={500} />;

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ margin: '0 auto 1rem', color: 'var(--primary-blue)' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '500' }}>Akses Admin</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '0.5rem' }}>Masukkan kode unik untuk masuk ke panel admin.</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Kode Unik..." 
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              style={{ textAlign: 'center', letterSpacing: '0.1em' }}
              autoFocus
            />
          </div>
          {authError && (
            <p style={{ color: '#dc3545', fontSize: '12px', textAlign: 'center', marginBottom: '1rem' }}>
              Kode unik salah. Silakan coba lagi.
            </p>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Masuk
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="page-title" style={{ borderBottom: 'none', marginBottom: 0 }}>Pengelolaan Data Alur Skripsi</h2>
        <button className="btn btn-outline" onClick={() => {
          sessionStorage.removeItem('adminAuth');
          setIsAuthenticated(false);
        }}>
          Keluar (Logout)
        </button>
      </div>
      <hr style={{ margin: '1rem 0 1.5rem 0', borderColor: 'var(--border-color)', borderTop: 'none' }} />

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        {['entitas', 'dokumen', 'aksi'].map(tab => (
          <button 
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab(tab)}
            style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px' }}>
            <span>Tampilkan</span>
            <select className="form-control" style={{ width: 'auto', display: 'inline-block' }}>
              <option>50</option>
            </select>
            <span>entri</span>
          </div>
          <button className="btn btn-success" onClick={() => openModal()}>
            <Plus size={16} /> Tambah {activeTab}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Memuat data...</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama</th>
                  {activeTab === 'dokumen' && <th>Penjelasan</th>}
                  {activeTab === 'aksi' && <th>Deskripsi</th>}
                  <th style={{ width: '100px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data[activeTab].map(item => (
                  <tr key={item.id}>
                    <td>{item.nama}</td>
                    {activeTab === 'dokumen' && <td>{item.penjelasanSingkat}</td>}
                    {activeTab === 'aksi' && <td>{item.deskripsi}</td>}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                        <button className="btn btn-info" style={{ backgroundColor: '#17a2b8', color: 'white', padding: '0.25rem 0.5rem' }} onClick={() => openModal(item)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(item.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data[activeTab].length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>Tidak ada entri yang ditemukan</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h5 style={{ margin: 0, fontWeight: 'bold', textTransform: 'capitalize' }}>{editingItem ? 'Edit' : 'Tambah'} {activeTab}</h5>
              <button className="btn btn-outline" style={{ border: 'none', padding: '0.25rem' }} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {renderForm()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
