# Panduan Deployment (Ubuntu 24.04 LTS)

Dokumen ini berisi langkah-langkah detail untuk men-deploy aplikasi **Sistem Informasi Alur Skripsi SITEI** (Node.js Backend + React Vite Frontend) ke dalam VPS berbasis Ubuntu 24.04.

Arsitektur deployment yang akan kita gunakan:
- **PM2**: Untuk menjalankan backend Node.js di *background* agar tidak mati saat terminal ditutup.
- **Nginx**: Sebagai web server utama. Nginx akan bertugas menyajikan file *build* React (Frontend) dan meneruskan (proxy) permintaan API ke backend.

---

## 1. Persiapan VPS (Install Dependency)

Login ke VPS Anda melalui SSH:
```bash
ssh root@ip_vps_anda
```

Update sistem dan install **Nginx**, **Git**, dan **Curl**:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nginx git curl -y
```

Install **Node.js** (Disarankan menggunakan versi LTS, misalnya 20.x):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Install **PM2** secara global:
```bash
sudo npm install -g pm2
```

---

## 2. Pindahkan Source Code ke VPS

Anda bisa menggunakan `git clone` (jika menggunakan repository seperti GitHub/GitLab) atau memindahkan file secara manual (via SFTP/SCP). 

Misalnya, kita letakkan aplikasi di `/var/www/alur-skripsi`:

```bash
cd /var/www
git clone https://github.com/username/alur-skripsi.git
cd alur-skripsi
```

---

## 3. Setup Backend (Node.js Express)

Masuk ke folder `server`, install dependency, dan jalankan dengan PM2:

```bash
cd /var/www/alur-skripsi/server
npm install

# Jalankan server dengan PM2
pm2 start index.js --name "alur-skripsi-backend"

# Agar PM2 otomatis jalan saat VPS direstart
pm2 startup
pm2 save
```
> **Catatan:** Backend sekarang berjalan di `http://localhost:3001`.

---

## 4. Setup Frontend (React + Vite)

Masuk ke folder `client`, sesuaikan environment, install dependency, lalu jalankan proses `build` untuk menghasilkan file statis (HTML/CSS/JS).

```bash
cd /var/www/alur-skripsi/client

# Buat file .env jika belum ada (ganti password sesuai keinginan)
echo "VITE_ADMIN_PASSCODE=kopi123" > .env

# Install dependency
npm install

# Build aplikasi untuk production
npm run build
```
> File produksi sekarang berada di folder `/var/www/alur-skripsi/client/dist`.

---

## 5. Konfigurasi Nginx

Kita akan mengatur Nginx untuk membaca file `dist` frontend dan me-routing `/api` ke backend.

Buat file konfigurasi Nginx baru:
```bash
sudo nano /etc/nginx/sites-available/alur-skripsi
```

Masukkan konfigurasi berikut (ganti `namadomain.com` dengan IP VPS atau Domain Anda):

```nginx
server {
    listen 80;
    server_name namadomain.com atau_IP_VPS;

    # Root folder menunjuk ke folder build Frontend
    root /var/www/alur-skripsi/client/dist;
    index index.html;

    # Route untuk Frontend React (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Reverse Proxy untuk Backend API
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Simpan file (tekan `Ctrl+X`, lalu `Y`, lalu `Enter`).

Aktifkan konfigurasi Nginx dan restart *service*-nya:

```bash
sudo ln -s /etc/nginx/sites-available/alur-skripsi /etc/nginx/sites-enabled/
sudo nginx -t  # Pastikan tidak ada pesan error syntax
sudo systemctl restart nginx
```

---

## 6. Selesai! 🎉

Sekarang aplikasi sudah berhasil di-deploy. 
- Kunjungi **http://ip_vps_anda** atau domain Anda di browser untuk melihat halaman Beranda.
- Kunjungi **http://ip_vps_anda/admin** untuk mengakses halaman Admin.

### *(Opsional) Konfigurasi Keamanan Tambahan*
Jika Anda ingin menambahkan HTTPS/SSL, Anda bisa menggunakan **Certbot**:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d namadomain.com
```
