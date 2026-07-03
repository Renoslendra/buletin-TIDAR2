import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import { buildBulletinData } from "../src/lib/mapping/bulletin-mapper";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL belum dikonfigurasi.");
}
const adapter = new PrismaLibSql({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminName = process.env.ADMIN_NAME ?? "Admin Tidar 2";
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@tidar2.local").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin12345";
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && (!process.env.ADMIN_PASSWORD || adminPassword.length < 12)) {
    throw new Error("ADMIN_PASSWORD production wajib diisi dan minimal 12 karakter.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const shouldUpdateAdminPassword = Boolean(process.env.ADMIN_PASSWORD);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: shouldUpdateAdminPassword
      ? {
          name: adminName,
          passwordHash,
          role: "admin",
        }
      : {},
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "admin",
    },
  });

  const settings =
    (await prisma.appSettings.findFirst()) ??
    (await prisma.appSettings.create({
      data: {
        churchName: "GMAHK Tidar 2 Surabaya",
        sabbathSchoolTime: "09.00 - 10.15 WIB",
        sermonServiceTime: "10.20 - 12.00 WIB",
        footerTagline: "Ibadah - Bertumbuh - Bersaksi",
        activeTemplate: "classic",
        defaultSongs: {
          lagu_pengantar: "LSEL No. 205",
          lagu_pembukaan_ss: "LSEL No. 12",
          lagu_penutup_ss: "LSEL No. 214",
          jemaat_menyanyi: "LSEL No. 341",
        },
        defaultBulletinItems: {
          penerima_tamu: "[perlu diisi]",
          pianis: "[perlu diisi]",
          pemimpin_lagu: "[perlu diisi]",
          diskusi_ss: "Diskusi Sekolah Sabat",
          penyambutan_tamu: "Penyambutan Tamu",
        },
      },
    }));

  const uploadCount = await prisma.scheduleUpload.count();
  if (uploadCount > 0) {
    return;
  }

  const shouldSeedSampleData =
    process.env.SEED_SAMPLE_DATA === "true" || process.env.NODE_ENV !== "production";

  if (!shouldSeedSampleData) {
    return;
  }

  const schoolUpload = await prisma.scheduleUpload.create({
    data: {
      type: "sekolah_sabat",
      title: "Jadwal Sekolah Sabat",
      period: "Triwulan 3 - 2026",
      originalFileUrl: "/sample-sekolah-sabat.png",
      extractionStatus: "reviewed",
      createdBy: admin.id,
      extractionRawJson: {},
    },
  });

  const sermonUpload = await prisma.scheduleUpload.create({
    data: {
      type: "khotbah",
      title: "Jadwal Khotbah",
      period: "Triwulan 3 - 2026",
      originalFileUrl: "/sample-khotbah.png",
      extractionStatus: "reviewed",
      createdBy: admin.id,
      extractionRawJson: {},
    },
  });

  const schoolRow = await prisma.scheduleRowSekolahSabat.create({
    data: {
      scheduleUploadId: schoolUpload.id,
      date: new Date("2026-07-04T00:00:00.000Z"),
      dateText: "04 Juli 2026",
      pemimpinDoaTutup: "Bpk. Agung Wijaya",
      doaBukaAyatInti: "Ibu Maria Lestari",
      mision: "Bpk. Joko Sutanto",
      promosiPpRumahTangga: "Bpk. Daniel Purba",
      pembawaPersembahan: "Ibu Martha Sihombing",
      confidence: "0.92",
      notes: "Seed data.",
    },
  });

  const sermonRow = await prisma.scheduleRowKhotbah.create({
    data: {
      scheduleUploadId: sermonUpload.id,
      date: new Date("2026-07-04T00:00:00.000Z"),
      dateText: "04 Juli 2026",
      doaInvokasi: "Bpk. Samuel Sinaga",
      ayatBersahutan: "Mazmur 100:1-5",
      laguBuka: "LSEL No. 205",
      doaSyafaat: "Ibu Lidya Tambunan",
      persembahanSyukur: "Diaken Bertugas",
      jemaatMemuji: "LSEL No. 18",
      doaPersembahan: "Bpk. Markus Hutabarat",
      jemaatMenyambut: "LSEL No. 341",
      laguPujian1: "Vocal Group Pemuda",
      khotbahAnak: "Ibu Ruth Siregar",
      jemaatMenyanyi: "Paduan Suara Jemaat",
      scoreboardVisiMisi: "Tim Multimedia",
      ayatInti: "Yohanes 15:5",
      laguTema: "LSEL No. 322",
      khotbah: "Pdt. Daniel Hutapea",
      temaKhotbah: "Tinggal Di Dalam Kristus",
      laguTutup: "LSEL No. 214",
      doaTutup: "Pdt. Daniel Hutapea",
      komunikasiJemaat: "Sekretariat Jemaat",
      confidence: "0.9",
      notes: "Seed data.",
    },
  });

  const bulletinData = buildBulletinData({
    date: "2026-07-04",
    sekolahSabat: schoolRow,
    khotbah: sermonRow,
    settings: {
      churchName: settings.churchName,
      sabbathSchoolTime: settings.sabbathSchoolTime,
      sermonServiceTime: settings.sermonServiceTime,
      footerTagline: settings.footerTagline,
      activeTemplate: settings.activeTemplate,
      defaultSongs: settings.defaultSongs as Record<string, string>,
      defaultBulletinItems: settings.defaultBulletinItems as Record<string, string>,
    },
  });

  await prisma.bulletin.create({
    data: {
      date: new Date("2026-07-04T00:00:00.000Z"),
      title: "Ibadah Sabat - 04 Juli 2026",
      churchName: settings.churchName,
      schoolSabbathRowId: schoolRow.id,
      sermonRowId: sermonRow.id,
      bulletinData,
      status: "draft",
      createdBy: admin.id,
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
