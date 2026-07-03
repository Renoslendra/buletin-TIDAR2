# Deployment Checklist

Dokumen ini adalah checklist sebelum SabatFlow dipakai di hosting production.

## Rekomendasi Hosting

Pilihan paling aman untuk versi code saat ini adalah hosting Node.js dengan persistent disk, misalnya VPS, Render disk, atau Fly volume.

Alasannya:
- Upload jadwal disimpan ke `STORAGE_ROOT/uploads`.
- Export PDF/PNG disimpan ke `STORAGE_ROOT/exports`.
- Export memakai Playwright Chromium.

Hosting serverless seperti Vercel masih bisa untuk UI/API, tetapi storage lokal tidak persisten dan Playwright perlu setup Chromium khusus. Untuk serverless, pindahkan storage ke S3, Cloudflare R2, atau Vercel Blob terlebih dahulu.

## Environment Variables

Minimal production:

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="isi-random-minimal-32-karakter"
APP_BASE_URL="https://domain-anda.com"
EXPORT_BASE_URL="https://domain-anda.com"
STORAGE_ROOT="/path/persistent/storage"

ADMIN_NAME="Admin Tidar 2"
ADMIN_EMAIL="admin@domain-anda.com"
ADMIN_PASSWORD="password-kuat-minimal-12-karakter"
SEED_SAMPLE_DATA="false"

AI_PROVIDER="mimo"
MIMO_API_KEY="isi-api-key"
MIMO_MODEL="mimo-v2.5"
MIMO_BASE_URL="https://api.xiaomimimo.com/v1"
```

Catatan:
- Jangan pakai `admin12345` di production.
- Rotate API key jika pernah terlihat di chat, terminal, screenshot, atau repo.
- `SESSION_SECRET` wajib minimal 32 karakter saat `NODE_ENV=production`.

## Setup Database

Untuk deployment pertama:

```bash
npm ci
npm run prisma:generate
npm run db:push
npm run db:seed
```

Seed production hanya membuat admin dan settings. Sample jadwal/buletin tidak dibuat kecuali `SEED_SAMPLE_DATA="true"`.

## Build dan Start

```bash
npm run deploy:check
npm run start
```

Kalau hosting menjalankan command terpisah:

```bash
npm run build
npm run start
```

## Playwright

Export PDF/PNG butuh Chromium:

```bash
npx playwright install chromium
```

Di Linux server, jika browser gagal start, jalankan juga dependency install sesuai OS:

```bash
npx playwright install-deps chromium
```

## Post Deploy Smoke Test

1. Buka `/api/health`, pastikan response `ok: true`.
2. Login dengan admin production.
3. Upload gambar jadwal PNG/JPG/WebP.
4. Pastikan ekstraksi AI selesai.
5. Review data dan klik `Tandai Reviewed`.
6. Buka `Buletin Baru`, generate draft.
7. Simpan draft.
8. Export PNG dan PDF.
9. Logout, lalu pastikan `/dashboard` redirect ke `/login`.
10. Pastikan `/bulletins/[id]/preview?print=1` tidak bisa dibuka tanpa login.

## Known Limits

- Ekstraksi otomatis hanya mendukung gambar PNG/JPG/JPEG/WebP. PDF belum dikonversi ke gambar.
- SQLite file production hanya aman jika disk hosting persisten.
- Untuk multi-admin dan audit log, perlu fitur tambahan.
