# Buletin GMAHK Tidar 2

Generator buletin Ibadah Sabat GMAHK Jemaat Tidar 2 Surabaya.

## Alur Kerja

```text
Upload Gambar Jadwal → AI (MiMo) → Review Admin → Edit Buletin → Export PDF/PNG
```

## Fitur

- **Upload Jadwal**: Upload gambar jadwal Sekolah Sabat dan Khotbah
- **Ekstraksi AI**: Otomatis ekstrak data dari gambar menggunakan MiMo AI
- **Review & Edit**: Koreksi hasil ekstraksi di halaman review
- **Generate Buletin**: Buat buletin dari jadwal yang sudah diekstrak
- **Editor Buletin**: Edit buletin dengan drag-and-drop items
- **Export**: Export buletin ke PDF dan PNG
- **Mobile-First**: Responsive design dengan bottom navigation

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Prisma 7 + SQLite
- **AI**: MiMo API (Xiaomi)
- **Auth**: Cookie JWT
- **Export**: Playwright (PDF/PNG)
- **Testing**: Vitest

## Setup

1. Install dependency:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env.local
```

3. Configure `.env.local`:

```env
# Database
DATABASE_URL="file:./dev.db"

# Session
SESSION_SECRET="your-secret-key"

# AI Provider (MiMo)
AI_PROVIDER=mimo
MIMO_API_KEY=your-mimo-api-key
MIMO_MODEL=mimo-v2.5
MIMO_BASE_URL=https://api.xiaomimimo.com/v1

# App
APP_BASE_URL=http://localhost:3000
```

4. Setup database:

```bash
npx prisma db push
npx prisma generate
npm run db:seed
```

5. Install Playwright (untuk export PDF/PNG):

```bash
npx playwright install chromium
```

6. Jalankan aplikasi:

```bash
npm run dev
```

## Login

```text
Email: admin@tidar2.local
Password: admin12345
```

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production
npm run test         # Run tests
npm run typecheck    # Type checking
npm run lint         # Linting
npm run db:seed      # Seed database
```

## Struktur Project

```
src/
├── app/                    # Pages & API routes
│   ├── api/               # API endpoints
│   ├── dashboard/         # Dashboard page
│   ├── schedules/         # Jadwal pages
│   ├── bulletins/         # Buletin pages
│   ├── history/           # Riwayat page
│   └── login/             # Login page
├── components/            # React components
│   ├── auth/              # Login form
│   ├── bulletin/          # Buletin template & preview
│   ├── editor/            # Buletin editor
│   ├── layout/            # Shell, sidebar, topbar, mobile nav
│   ├── schedules/         # Upload & review
│   └── ui/                # Button, card, input, table, etc
├── lib/                   # Utilities
│   ├── ai/                # AI providers (MiMo, Gemini, Mock)
│   ├── auth/              # JWT authentication
│   ├── date/              # Date utilities
│   ├── db/                # Prisma client
│   ├── mapping/           # Buletin data mapping
│   ├── storage/           # File storage
│   ├── text/              # Text utilities
│   └── validation/        # Zod schemas
├── styles/                # CSS files
└── types/                 # TypeScript types
prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Seed data
public/
├── logos/                 # Church logos
└── bulletin-reference/    # Reference images
```

## Design System

Lihat `DESIGN.md` untuk panduan design system lengkap.

## API Keys

### MiMo AI (Recommended)

1. Daftar di https://platform.xiaomimimo.com
2. Buat API Key
3. Masukkan ke `.env.local`

### Gemini AI (Alternative)

1. Dapatkan key di https://aistudio.google.com/apikey
2. Set `AI_PROVIDER=gemini` di `.env.local`
3. Set `GEMINI_API_KEY=your-key`

## Deployment

```bash
npm run build
npm run start
```

Pastikan environment variables sudah diset di production.

## License

Private - GMAHK Jemaat Tidar 2 Surabaya
