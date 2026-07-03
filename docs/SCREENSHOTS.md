# 📸 Cara Mengambil Screenshot untuk README

## Prerequisites
1. Jalankan aplikasi: `npm run dev`
2. Buka di browser: `http://localhost:3000`
3. Login dengan: `admin@tidar2.local` / `admin12345`

## Desktop Screenshots (1366x768 atau 1920x1080)

### 1. Dashboard
- Buka `/dashboard`
- Ambil screenshot full page
- Simpan sebagai: `docs/screenshots/dashboard.png`

### 2. Jadwal
- Buka `/schedules`
- Ambil screenshot full page
- Simpan sebagai: `docs/screenshots/schedules.png`

### 3. Editor Buletin
- Buka `/bulletins/[id]/edit`
- Ambil screenshot full page
- Simpan sebagai: `docs/screenshots/editor.png`

### 4. Preview Buletin
- Buka `/bulletins/[id]/preview`
- Ambil screenshot full page
- Simpan sebagai: `docs/screenshots/buletin-preview.png`

## Mobile Screenshots (390x844 atau 375x667)

### 1. Login Mobile
- Buka `/login` di mobile view
- Ambil screenshot
- Simpan sebagai: `docs/screenshots/login-mobile.png`

### 2. Dashboard Mobile
- Buka `/dashboard` di mobile view
- Ambil screenshot
- Simpan sebagai: `docs/screenshots/dashboard-mobile.png`

### 3. Bottom Navigation
- Buka halaman apapun di mobile view
- Ambil screenshot bagian bawah
- Simpan sebagai: `docs/screenshots/nav-mobile.png`

## Cara Ambil Screenshot

### Chrome DevTools
1. Buka DevTools (F12)
2. Klik icon mobile (toggle device toolbar)
3. Set ukuran: 390x844 (iPhone) atau 1366x768 (desktop)
4. Ambil screenshot: Ctrl+Shift+P → "Capture screenshot"

### Windows
- Full screen: `Win + Print Screen`
- Active window: `Alt + Print Screen`
- Snipping tool: `Win + Shift + S`

### macOS
- Full screen: `Cmd + Shift + 3`
- Selection: `Cmd + Shift + 4`
- Window: `Cmd + Shift + 4 + Space`

## Push ke GitHub

```bash
# Add screenshots
git add docs/screenshots/

# Commit
git commit -m "docs: add application screenshots"

# Push
git push origin master
```

## Tips

1. **Bersihkan browser** - Hapus bookmark bar, extension icons
2. **Zoom 100%** - Pastikan zoom level 100%
3. **Full page** - Ambil full page, bukan hanya viewport
4. **Consistent** - Gunakan ukuran yang sama untuk semua screenshot
5. **Clean data** - Pastikan data sample terlihat bagus
