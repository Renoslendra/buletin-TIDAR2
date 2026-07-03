"use client";

import React, { useState } from "react";
import { ClassicBulletinTemplate } from "@/components/bulletin/ClassicBulletinTemplate";
import type { BulletinData } from "@/types/bulletin";

export const defaultClassicMockData: BulletinData = {
  header: {
    title: "Ibadah Sabat",
    church_name: "GMAHK TIDAR 2 SURABAYA",
    date: "2026-01-24",
    date_text: "24 JANUARI 2026",
  },
  top_info: [
    { label: "Penerima Tamu", value: "Ibu Ira & Ibu Rendrani", is_required: true, source: "default" },
    { label: "Pianis", value: "Sdr Joseph", is_required: true, source: "default" },
    { label: "Pemimpin Lagu", value: "Sdri Ika Stefani", is_required: true, source: "default" },
    { label: "Pembawa Persembahan", value: "Sdr Yonathan & Bpk Sri Mulyono", is_required: true, source: "default" },
  ],
  sekolah_sabat_items: [
    { label: "Lagu Pengantar", value: 'LSEL No. 205 "Apakah Engkau Susah"', is_required: true, source: "sekolah_sabat" },
    { label: "Pemimpin Acara SS", value: "Sdri Yoan Setiyo", is_required: true, source: "sekolah_sabat" },
    { label: "Lagu Pembukaan", value: 'LSEL 240 "Berserah Kepada Yesus"', is_required: true, source: "sekolah_sabat" },
    { label: "Ayat & Doa Pembuka", value: "Sdr Joe Rafly (Filipi 2 : 2)", is_required: true, source: "sekolah_sabat" },
    { label: "Berita Mision", value: "Ibu Diana Veriati", is_required: true, source: "sekolah_sabat" },
    { label: "Diskusi SS", value: "Pemimpin Diskusi UKSS masing-masing", is_required: true, source: "sekolah_sabat" },
    { label: "Pelayanan Perorangan", value: "Bpk Tonny Han", is_required: true, source: "sekolah_sabat" },
    { label: "Lagu Penutup", value: 'LSEL 265 "Kami Datang Pada-Mu"', is_required: true, source: "sekolah_sabat" },
    { label: "Doa Penutup", value: "Sdri Yoan Setiyo", is_required: true, source: "sekolah_sabat" },
    { label: "Penyambutan Tamu", value: "Dept. Sekolah Sabat", is_required: true, source: "sekolah_sabat" },
  ],
  khotbah_items: [
    { label: "LSEL No. 515", value: '"Tuhan ada dalam Bait Allah"', is_required: true, source: "khotbah" },
    { label: "LSEL No. 1", value: '"Di Hadapan Hadirat-Mu" ayat 1', is_required: true, source: "khotbah" },
    { label: "Doa Invokasi", value: "Sdr Stefanus Eka", is_required: true, source: "khotbah" },
    { label: "Ayat Bersahutan", value: "Sdr Reno Syaelendra (1 Raja-raja 18:2-4)", is_required: true, source: "khotbah" },
    { label: "Lagu Buka", value: 'LSEL 311 "Aku Mengasihi Tuhan"', is_required: true, source: "khotbah" },
    { label: "Doa Syafaat", value: 'Bpk Joko Sutanto "Dengar Ya Tuhan"', is_required: true, source: "khotbah" },
    { label: "Persembahan Syukur", value: "Sdr Reno Syaelendra", is_required: true, source: "khotbah" },
    { label: "Jemaat Memuji", value: 'LSEL No. 260 "Bawa Persembahanmu"', is_required: true, source: "khotbah" },
    { label: "Doa Persembahan", value: "Sdr Reno Syaelendra", is_required: true, source: "khotbah" },
    { label: "Jemaat Menyambut", value: 'LSEL No. 21 "Padamu Allah Kupuji"', is_required: true, source: "khotbah" },
    { label: "Khotbah Anak", value: "Sdri Celine", is_required: true, source: "khotbah" },
    { label: "Lagu Pujian", value: "Kel. Andri Gunawan", is_required: true, source: "khotbah" },
    { label: "Scoreboard & Visi Misi", value: "Sdr Reno Syaelendra", is_required: true, source: "khotbah" },
    { label: "Ayat Inti", value: "Bpk Joko Sutanto (Matius 25:21)", is_required: true, source: "khotbah" },
    { label: "Lagu Tema", value: "Misi Kita", is_required: true, source: "khotbah" },
  ],
  sermon: {
    label: "KHOTBAH",
    preacher: "Sdr Stefanus Eka",
    title: "SETIA SAMPAI AKHIR",
    verse: "Matius 25:21",
  },
  closing_items: [
    { label: "Lagu Tutup", value: 'LSEL 218 "Lenyap Nafsu Dunia"', is_required: true, source: "khotbah" },
    { label: "Doa Tutup", value: "Sdr Stefanus Eka", is_required: true, source: "khotbah" },
    { label: "Jemaat Menyanyi", value: 'LSEL No. 56 "Ya Tuhan, Iringlah Kami"', is_required: true, source: "khotbah" },
    { label: "KOMUNIKASI JEMAAT", value: "Bpk Agung Wijaya", is_required: true, source: "khotbah" },
  ],
  footer: {
    tagline: "GMAHK Tidar 2 Surabaya",
    template: "classic",
  },
  validation_notes: [],
  source_trace: {
    selected_date: "2026-01-24",
  },
};

export function ClassicBulletinPreview({
  data = defaultClassicMockData,
  showControls = true,
}: {
  data?: BulletinData;
  showControls?: boolean;
}) {
  const [scale, setScale] = useState(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-neutral-100 py-8 px-4">
      {showControls && (
        <div className="no-print mb-6 flex items-center gap-4 rounded-lg bg-white p-4 shadow-md">
          <span className="text-sm font-semibold text-gray-700">Preview Scale:</span>
          <button
            onClick={() => setScale((s) => Math.max(0.6, s - 0.1))}
            className="rounded bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-300"
          >
            -
          </button>
          <span className="w-12 text-center text-sm font-medium">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.min(1.4, s + 0.1))}
            className="rounded bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-300"
          >
            +
          </button>
          <button
            onClick={() => setScale(1)}
            className="rounded border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handlePrint}
            className="ml-4 rounded bg-black px-5 py-1.5 text-sm font-semibold text-white shadow hover:bg-neutral-800"
          >
            Print / Export PDF
          </button>
        </div>
      )}

      {/* Scaled container for web preview, pure A4 for print */}
      <div
        style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
        className="transition-transform duration-200"
      >
        <ClassicBulletinTemplate data={data} />
      </div>
    </div>
  );
}
