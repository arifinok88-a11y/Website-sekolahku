import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.json({ limit: '10mb' }));

const isVercel = Boolean(process.env.VERCEL);
const dataFilePath = isVercel
  ? path.join('/tmp', 'school-data.json')
  : path.join(process.cwd(), 'school-data.json');

interface Teacher {
  id: number;
  name: string;
  role: string;
  subject: string;
  nip: string;
  photo_url: string;
}

interface NewsItem {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
  published_date: string;
}

interface SchoolProfile {
  id: number;
  name: string;
  tagline: string;
  about: string;
  vision: string;
  mission: string;
  address: string;
  phone: string;
  email: string;
  students_count: number;
  teachers_count: number;
  achievements_count: number;
  admin_password: string;
}

interface SchoolDB {
  profile: SchoolProfile;
  teachers: Teacher[];
  news: NewsItem[];
}

const defaultData: SchoolDB = {
  profile: {
    id: 1,
    name: 'SMA Negeri 1 Nanga Pinoh',
    tagline: 'Membangun Karakter Unggul, Kreatif, dan Berwawasan Global',
    about: 'SMA Negeri 1 Nanga Pinoh adalah lembaga pendidikan menengah atas terakreditasi A yang berkomitmen menghadirkan pembelajaran aktif, ramah anak, dan berbasis teknologi serta nilai-nilai budi pekerti luhur.',
    vision: 'Menjadi sekolah dasar unggulan yang melahirkan generasi berakhlak mulia, cerdas, kreatif, mandiri, dan peduli lingkungan.',
    mission: '1. Menyelenggarakan pembelajaran aktif, inovatif, dan menyenangkan.\n2. Menanamkan nilai karakter Pancasila dan budi pekerti dalam keseharian.\n3. Mengembangkan literasi digital, sains, seni, dan olahraga sesuai bakat siswa.\n4. Membangun sinergi harmonis antara sekolah, orang tua, dan masyarakat.',
    address: 'Jl. Kota Baru km. 1 Nanga Pinoh,Kab.Melawi, Pos:79672',
    phone: '(0568) 2020195',
    email: 'smansa.borneo1982@yahoo.co.id',
    students_count: 800,
    teachers_count: 52,
    achievements_count: 78,
    admin_password: process.env.ADMIN_PASSWORD || 'admin',
  },
  teachers: [
    {
      id: 1,
      name: 'Antonius Tukimin, S.Pd',
      role: 'Kepala Sekolah',
      subject: 'Manajemen Pendidikan',
      nip: '19801011 200502 1 003',
      photo_url: 'https://drive.google.com/file/d/1-gyC7kc-Q6_pFCfZ1jFvXh1hfoNg9vgo/view?usp=sharing',
    },
    {
      id: 2,
      name: 'Anang Purwanto, S.Pd.',
      role: 'Waka Kurikulum',
      subject: 'Sejarah',
      nip: 'xxxx',
      photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 3,
      name: '........., S.Pd.',
      role: 'Wali Kelas X',
      subject: 'Bahasa Indonesia & Seni',
      nip: '199103222015042003',
      photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 4,
      name: '........, SE.',
      role: 'Guru Bidang Studi',
      subject: 'Informatika & Robotika',
      nip: '199311052019031008',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  ],
  news: [
    {
      id: 1,
      title: 'Juara 1 Olimpiade Sains Nasional (OSN) Tingkat Kota',
      category: 'Prestasi',
      excerpt: 'Siswa kelas 5 SD Harapan Bangsa berhasil meraih medali emas pada ajang OSN bidang Matematika dan IPA.',
      content: 'Selamat kepada Ananda Rafi Pratama dan Nayla Putri yang telah mengharumkan nama SD Harapan Bangsa dengan meraih Juara 1 Olimpiade Sains Nasional (OSN) Tingkat Kota. Keberhasilan ini merupakan hasil bimbingan intensif para guru dan dukungan penuh orang tua siswa.',
      image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      published_date: '2026-10-15',
    },
    {
      id: 2,
      title: 'Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027',
      category: 'Pengumuman',
      excerpt: 'Pendaftaran gelombang pertama untuk calon siswa baru kelas 1 telah resmi dibuka secara daring maupun luring.',
      content: 'SMA Negeri 1 Nanga Pinoh membuka pendaftaran peserta didik baru tahun ajaran 2026/2027. Orang tua dapat melakukan pendaftaran melalui sekretariat sekolah setiap hari kerja pukul 08.00 - 14.00 WIB dengan membawa fotokopi akta kelahiran dan kartu keluarga.',
      image_url: 'https://drive.google.com/file/d/1bia17fRtIjHrHNqDnoueOFArInyQQ26C/view?usp=sharing',
      published_date: '2026-11-02',
    },
    {
      id: 3,
      title: 'Pekan Literasi & Pameran Karya Proyek Penguatan Profil Pelajar Pancasila',
      category: 'Kegiatan',
      excerpt: 'Siswa menampilkan beragam karya daur ulang kreatif, buku cerita mini, dan pertunjukan seni daerah.',
      content: 'Dalam rangka memperingati Bulan Bahasa dan Pekan Literasi, seluruh siswa dari kelas 1 hingga kelas 6 berpartisipasi aktif dalam Pameran Karya P5. Kegiatan ini melatih kepercayaan diri, gotong royong, dan kepedulian siswa terhadap kelestarian lingkungan.',
      image_url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
      published_date: '2026-11-12',
    },
  ],
};

let memoryDB: SchoolDB | null = null;

function readDB(): SchoolDB {
  if (memoryDB) return memoryDB;
  try {
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, 'utf-8');
      memoryDB = JSON.parse(raw) as SchoolDB;
      return memoryDB;
    }
  } catch {
    // fallback to defaultData
  }
  memoryDB = structuredClone(defaultData);
  writeDB(memoryDB);
  return memoryDB;
}

function writeDB(data: SchoolDB): void {
  memoryDB = data;
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Pada environment read-only tetap aman berjalan di memori
  }
}

// Gunakan memoryStorage multer agar 100% kompatibel dengan Vercel Serverless (mengembalikan Data URL Base64)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
});

// Login Admin
app.post('/api/login', (req, res) => {
  const db = readDB();
  const inputPass = String(req.body?.password || '').trim();
  const validPass = String(db.profile.admin_password || process.env.ADMIN_PASSWORD || 'admin').trim();
  const envPass = String(process.env.ADMIN_PASSWORD || '').trim();

  if (inputPass && (inputPass === validPass || (envPass && inputPass === envPass))) {
    res.json({ success: true, token: 'sdhb-admin-session-token' });
  } else {
    res.status(401).json({ success: false, message: 'Kata sandi admin salah!' });
  }
});

// Ganti Password Admin
app.post('/api/change-password', (req, res) => {
  const db = readDB();
  const currentPassword = String(req.body?.currentPassword || '').trim();
  const newPassword = String(req.body?.newPassword || '').trim();

  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ success: false, message: 'Kata sandi baru minimal 4 karakter.' });
  }

  const validPass = String(db.profile.admin_password || process.env.ADMIN_PASSWORD || 'admin').trim();
  const envPass = String(process.env.ADMIN_PASSWORD || '').trim();
  if (currentPassword !== validPass && currentPassword !== envPass) {
    return res.status(401).json({ success: false, message: 'Kata sandi saat ini tidak sesuai.' });
  }

  db.profile.admin_password = newPassword;
  writeDB(db);
  res.json({ success: true, message: 'Kata sandi administrator berhasil diperbarui!' });
});

// Upload gambar (kompatibel lokal & Vercel Serverless tanpa error read-only filesystem)
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Tidak ada file yang diunggah' });
  }
  const base64 = req.file.buffer.toString('base64');
  const dataUrl = `data:${req.file.mimetype};base64,${base64}`;
  res.json({ url: dataUrl });
});

// School Profile API
app.get('/api/profile', (_req, res) => {
  const db = readDB();
  const { admin_password: _hidden, ...publicProfile } = db.profile;
  res.json(publicProfile);
});

app.put('/api/profile', (req, res) => {
  const db = readDB();
  const { name, tagline, about, vision, mission, address, phone, email, students_count, teachers_count, achievements_count } = req.body;
  db.profile = {
    ...db.profile,
    name: name ?? db.profile.name,
    tagline: tagline ?? db.profile.tagline,
    about: about ?? db.profile.about,
    vision: vision ?? db.profile.vision,
    mission: mission ?? db.profile.mission,
    address: address ?? db.profile.address,
    phone: phone ?? db.profile.phone,
    email: email ?? db.profile.email,
    students_count: Number(students_count) || 0,
    teachers_count: Number(teachers_count) || 0,
    achievements_count: Number(achievements_count) || 0,
  };
  writeDB(db);
  const { admin_password: _hidden, ...publicProfile } = db.profile;
  res.json(publicProfile);
});

// Teachers API
app.get('/api/teachers', (_req, res) => {
  const db = readDB();
  res.json(db.teachers);
});

app.post('/api/teachers', (req, res) => {
  const db = readDB();
  const { name, role, subject, nip, photo_url } = req.body;
  if (!name || !role || !subject) {
    return res.status(400).json({ error: 'Nama, jabatan, dan mata pelajaran wajib diisi.' });
  }
  const nextId = db.teachers.length > 0 ? Math.max(...db.teachers.map((t) => t.id)) + 1 : 1;
  const created: Teacher = {
    id: nextId,
    name,
    role,
    subject,
    nip: nip || '-',
    photo_url: photo_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
  };
  db.teachers.push(created);
  writeDB(db);
  res.status(201).json(created);
});

app.put('/api/teachers/:id', (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const idx = db.teachers.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Guru tidak ditemukan' });

  const { name, role, subject, nip, photo_url } = req.body;
  db.teachers[idx] = {
    ...db.teachers[idx],
    name,
    role,
    subject,
    nip: nip || '-',
    photo_url,
  };
  writeDB(db);
  res.json(db.teachers[idx]);
});

app.delete('/api/teachers/:id', (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  db.teachers = db.teachers.filter((t) => t.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// News API
app.get('/api/news', (_req, res) => {
  const db = readDB();
  const sorted = [...db.news].sort((a, b) => b.published_date.localeCompare(a.published_date) || b.id - a.id);
  res.json(sorted);
});

app.post('/api/news', (req, res) => {
  const db = readDB();
  const { title, category, excerpt, content, image_url, published_date } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Judul dan isi berita wajib diisi.' });
  }
  const nextId = db.news.length > 0 ? Math.max(...db.news.map((n) => n.id)) + 1 : 1;
  const created: NewsItem = {
    id: nextId,
    title,
    category: category || 'Kegiatan',
    excerpt: excerpt || content.slice(0, 140) + '...',
    content,
    image_url: image_url || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    published_date: published_date || new Date().toISOString().split('T')[0],
  };
  db.news.unshift(created);
  writeDB(db);
  res.status(201).json(created);
});

app.put('/api/news/:id', (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const idx = db.news.findIndex((n) => n.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Berita tidak ditemukan' });

  const { title, category, excerpt, content, image_url, published_date } = req.body;
  db.news[idx] = {
    ...db.news[idx],
    title,
    category,
    excerpt,
    content,
    image_url,
    published_date,
  };
  writeDB(db);
  res.json(db.news[idx]);
});

app.delete('/api/news/:id', (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  db.news = db.news.filter((n) => n.id !== id);
  writeDB(db);
  res.json({ success: true });
});

export default app;
