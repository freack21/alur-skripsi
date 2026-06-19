import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldAlert, WifiOff } from 'lucide-react';

export default function ErrorPage({ code = 404 }) {
  let title = "Halaman Tidak Ditemukan";
  let message = "Maaf, halaman yang Anda tuju tidak ada atau telah dipindahkan.";
  let Icon = AlertTriangle;

  if (code === 403) {
    title = "Akses Ditolak";
    message = "Anda tidak memiliki izin untuk mengakses halaman ini.";
    Icon = ShieldAlert;
  } else if (code === 500) {
    title = "Kesalahan Server";
    message = "Terjadi masalah pada server. Silakan coba beberapa saat lagi.";
    Icon = WifiOff;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      color: 'var(--text-dark)'
    }}>
      <Icon size={80} color={code === 500 ? '#dc3545' : '#ffc107'} style={{ marginBottom: '1.5rem' }} />
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--primary-blue)' }}>
        {code}
      </h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
        {message}
      </p>
      <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
        Kembali ke Beranda
      </Link>
    </div>
  );
}
