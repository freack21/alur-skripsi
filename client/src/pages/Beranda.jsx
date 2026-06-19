import { useEffect, useState } from 'react';
import { fetchData } from '../utils/api';
import ErrorPage from './ErrorPage';

export default function Beranda() {
  const [aksi, setAksi] = useState([]);
  const [dokumen, setDokumen] = useState([]);
  const [entitas, setEntitas] = useState([]);
  const [selectedAksi, setSelectedAksi] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [a, d, e] = await Promise.all([
          fetchData('aksi'),
          fetchData('dokumen'),
          fetchData('entitas')
        ]);
        setAksi(a);
        setDokumen(d);
        setEntitas(e);
        if (a.length > 0) {
          setSelectedAksi(a[0]);
        }
      } catch (err) {
        console.error('Failed to load data', err);
        setHasError(true);
      }
    };
    loadAllData();
  }, []);

  if (hasError) return <ErrorPage code={500} />;

  const getDokumenNames = (docIds) => {
    return docIds?.map(id => dokumen.find(d => d.id === id)).filter(Boolean) || [];
  };

  const getEntitasNames = (entIds) => {
    return entIds?.map(id => entitas.find(e => e.id === id)?.nama).filter(Boolean) || [];
  };

  return (
    <div>
      <h2 className="page-title">Alur Penyelesaian Skripsi</h2>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginTop: '1.5rem' }}>
        
        {/* Kolom Kiri: Timeline Vertikal */}
        <div className="card" style={{ flex: '0 0 350px', margin: 0 }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Tahapan Alur</h3>
          
          <div style={{ position: 'relative', paddingLeft: '0.5rem' }}>
            {/* Garis vertikal di belakang bulatan */}
            <div style={{ 
              position: 'absolute', top: '15px', bottom: '15px', left: '20px', 
              width: '2px', backgroundColor: 'var(--border-color)', zIndex: 1 
            }}></div>

            {aksi.map((item, index) => {
              const isActive = selectedAksi?.id === item.id;
              // We could also do "completed" logic if we want, but for now just highlight active
              return (
                <div 
                  key={item.id} 
                  style={{ 
                    position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '1rem', 
                    marginBottom: '1.5rem', cursor: 'pointer', zIndex: 2
                  }}
                  onClick={() => setSelectedAksi(item)}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--primary-blue)' : 'var(--bg-white)',
                    border: `2px solid ${isActive ? 'var(--primary-blue)' : 'var(--border-color)'}`,
                    color: isActive ? 'white' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 'bold', zIndex: 2, flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ paddingTop: '4px' }}>
                    <div style={{ 
                      fontSize: '14px', fontWeight: isActive ? '700' : '500', 
                      color: isActive ? 'var(--primary-blue)' : 'var(--text-dark)' 
                    }}>
                      {item.nama}
                    </div>
                  </div>
                </div>
              );
            })}
            {aksi.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada data alur.</div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Penjelasan Aksi dan Dokumen */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {selectedAksi ? (
            <>
              {/* Penjelasan Aksi */}
              <div className="card" style={{ margin: 0 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>
                  {selectedAksi.nama}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
                  {selectedAksi.deskripsi}
                </p>

                {selectedAksi.proses && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Proses / Tahapan
                    </h4>
                    <div style={{ fontSize: '14px', color: 'var(--text-dark)', backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px', borderLeft: '3px solid var(--primary-blue)', whiteSpace: 'pre-wrap' }}>
                      {selectedAksi.proses}
                    </div>
                  </div>
                )}

                {selectedAksi.aktor?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Pihak Terlibat
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {getEntitasNames(selectedAksi.aktor).map((name, i) => (
                        <span key={i} className="badge badge-info">{name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dokumen Persyaratan & Hasil */}
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div className="card" style={{ flex: 1, margin: 0 }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    Dokumen Persyaratan
                  </h4>
                  {selectedAksi.dokumenPersyaratan?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {getDokumenNames(selectedAksi.dokumenPersyaratan).map((doc, i) => (
                        <div key={i} style={{ borderLeft: '3px solid #ffc107', paddingLeft: '0.75rem' }}>
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>{doc.nama}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{doc.penjelasanSingkat}</div>
                          <div style={{ fontSize: '11px', marginTop: '0.5rem' }}>
                            <span style={{ fontWeight: 'bold' }}>Tanda Tangan: </span> 
                            {getEntitasNames(doc.penandatangan).join(', ')}
                            {doc.butuhCap && <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>Butuh Cap</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tidak ada dokumen persyaratan.</div>
                  )}
                </div>

                <div className="card" style={{ flex: 1, margin: 0 }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    Dokumen Hasil
                  </h4>
                  {selectedAksi.dokumenHasil?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {getDokumenNames(selectedAksi.dokumenHasil).map((doc, i) => (
                        <div key={i} style={{ borderLeft: '3px solid var(--primary-green)', paddingLeft: '0.75rem' }}>
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>{doc.nama}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{doc.penjelasanSingkat}</div>
                          <div style={{ fontSize: '11px', marginTop: '0.5rem' }}>
                            <span style={{ fontWeight: 'bold' }}>Tanda Tangan: </span> 
                            {getEntitasNames(doc.penandatangan).join(', ')}
                            {doc.butuhCap && <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>Butuh Cap</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tidak ada dokumen hasil.</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="card" style={{ margin: 0, textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Pilih alur di sebelah kiri untuk melihat detailnya.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
