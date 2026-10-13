// ============================================================
// VERSI DATA – naikkan angka ini jika struktur data berubah
// ============================================================
const DATA_VERSION = 4;

// ============================================================
// DATA DEFAULT – digunakan jika belum ada data di localStorage
// ============================================================

const DEFAULT_DATA = {
    members: {
        survei: [
            { id: 1, name: 'Linda Nurmaldita', role: 'Tenaga Teknis Survei Pemetaan', photo: 'anggota1.jpg', absen: 0, berkas: [] },
            { id: 2, name: 'Dimas Yudhistira Ananda', role: 'Tenaga Teknis Survei Pemetaan', photo: 'anggota2.jpg', absen: 0, berkas: ['SU_421_2013','SU_423_2013','SU_433_2008','SU_498_2008','194_2001','SU_004_1999','498_2014','SU_185_2001'] },
            { id: 3, name: 'Sahidun Anwar', role: 'Tenaga Teknis Survei Pemetaan', photo: 'anggota3.jpg', absen: 0, berkas: [] },
            { id: 4, name: 'Woelandari', role: 'Tenaga Teknis Survei Pemetaan', photo: 'anggota4.jpg', absen: 0, berkas: [] },
            { id: 5, name: 'Sri Mulyati', role: 'Tenaga Teknis Survei Pemetaan', photo: 'anggota5.jpg', absen: 0, berkas: [] },
        ],
        administrasi: [
            { id: 6, name: 'Novia Eliza', role: 'Tenaga Administrasi & Yuridis', photo: 'admin1.jpg', absen: 0, berkas: [] },
            { id: 7, name: 'Rayhan Arasy', role: 'Tenaga Administrasi & Yuridis', photo: 'admin2.jpg', absen: 0, berkas: [] },
            { id: 8, name: 'Amir Aditia', role: 'Tenaga Administrasi & Yuridis', photo: 'admin3.jpg', absen: 0, berkas: [] },
            { id: 9, name: 'Dian Diana', role: 'Tenaga Administrasi & Yuridis', photo: 'admin4.jpg', absen: 0, berkas: [] },
        ]
    },
    activities: [
        { id: 1, week: 'Minggu Pertama', date: '2026-09-22', title: 'Pengenalan Lingkungan ATR/BPN', desc: 'Kegiatan pengarahan dan pengenalan lingkungan kerja di kantor ATR/BPN Banjar bersama seluruh rekan magang dan pembimbing.', photo: 'aktivitas1.jpg' },
        { id: 2, week: 'Minggu Pertama', date: '2026-09-23', title: 'Kegiatan Day 2', desc: 'Aktivitas di hari kedua magang, berkumpul dan berdiskusi bersama teman-teman divisi Tenaga Teknis Survei Pemetaan.', photo: 'aktivitas2.jpg' },
        { id: 3, week: 'Minggu Pertama', date: '2026-09-24', title: 'Latihan Upacara ATR/BPN', desc: 'Persiapan dan latihan upacara di lapangan kantor ATR/BPN.', photo: 'aktivitas3.jpg' },
        { id: 4, week: 'Minggu Pertama', date: '2026-09-25', title: 'Ulang Tahun Kantor ATR/BPN', desc: 'Perayaan ulang tahun kantor ATR/BPN Kota Banjar bersama Walikota Ciamis dan FORKOMPIMDA.', photo: 'aktivitas4.jpg' },
        { id: 5, week: 'Minggu Pertama', date: '2026-09-26', title: 'Kegiatan Day 5', desc: 'Aktivitas di hari kelima magang. Semangat kebersamaan dan kekompakan tim.', photo: 'aktivitas5.jpg' },
        { id: 6, week: 'Minggu Kedua', date: '2026-09-28', title: 'Digitalisasi Wilayah Purwaharja', desc: 'Kegiatan digitalisasi bidang tanah di wilayah Purwaharja.', photo: 'minggu2_1.jpg' },
        { id: 7, week: 'Minggu Kedua', date: '2026-09-29', title: 'Apel Pagi ATR/BPN', desc: 'Pelaksanaan apel pagi rutin bersama seluruh pegawai kantor ATR/BPN Kota Banjar.', photo: 'minggu2_2.jpg' },
        { id: 8, week: 'Minggu Kedua', date: '2026-09-30', title: 'Upacara 66 Tahun UUPA', desc: 'Upacara peringatan 66 Tahun Undang-Undang Pokok Agraria.', photo: 'minggu2_3.jpg' },
        { id: 9, week: 'Minggu Kedua', date: '2026-10-01', title: 'Apel Bersama Pegawai', desc: 'Apel bersama seluruh pegawai dan peserta magang.', photo: 'minggu2_4.jpg' },
        { id: 10, week: 'Minggu Kedua', date: '2026-10-02', title: 'Apel dengan Pakaian Batik', desc: 'Apel harian dengan mengenakan pakaian batik.', photo: 'minggu2_5.jpg' },
        { id: 11, week: 'Minggu Ketiga', date: '2026-10-05', title: 'Survei & Verifikasi Batas Tanah', desc: 'Tim ATR/BPN turun langsung ke lapangan bersama warga untuk memverifikasi batas bidang tanah.', photo: 'minggu3_1.jpg' },
        { id: 12, week: 'Minggu Ketiga', date: '2026-10-06', title: 'Apel Pagi & Pengolahan Data', desc: 'Apel pagi dilanjutkan pengolahan data hasil survei lapangan.', photo: 'minggu2_2.jpg' },
        { id: 13, week: 'Minggu Ketiga', date: '2026-10-07', title: 'Apel & Digitasi Peta', desc: 'Apel pagi dilanjutkan digitasi dan plotting peta bidang tanah menggunakan AutoCAD.', photo: 'minggu2_5.jpg' },
        { id: 14, week: 'Minggu Ketiga', date: '2026-10-08', title: 'Inspeksi Lapangan – Jalan AMD', desc: 'Inspeksi dan verifikasi bidang tanah di Jalan AMD bersama pejabat ATR/BPN.', photo: 'minggu3_4.jpg' },
        { id: 15, week: 'Minggu Ketiga', date: '2026-10-09', title: 'Apel & Evaluasi Mingguan', desc: 'Apel akhir pekan dilanjutkan evaluasi progress kegiatan minggu ketiga.', photo: 'minggu2_4.jpg' },
    ],
    tentang: {
        umum: 'Kami adalah peserta magang di Hub ATR/BPN Banjar yang berdedikasi tinggi untuk mempelajari dan mengaplikasikan teori akademik ke dalam praktik nyata di lapangan.',
        survei: 'Mempelajari penggunaan alat-alat survei terkini, analisis data spasial, hingga pembuatan peta digital yang akurat untuk mendukung pemetaan dan perencanaan wilayah.',
        admin: 'Berfokus pada pengelolaan dokumen pertanahan, verifikasi data yuridis, dan pelayanan administrasi pertanahan untuk memastikan tertib hukum dan kepastian hak atas tanah.',
    },
    admin: {
        password: 'atr bpn2026'
    }
};

// ============================================================
// FUNGSI HELPER DATA
// ============================================================

function getData() {
    const raw = localStorage.getItem('ipmil_data');
    const ver = parseInt(localStorage.getItem('ipmil_data_version') || '0');

    // Jika belum ada data ATAU versi lama → reset ke default
    if (!raw || ver < DATA_VERSION) {
        const fresh = JSON.parse(JSON.stringify(DEFAULT_DATA)); // deep copy
        localStorage.setItem('ipmil_data', JSON.stringify(fresh));
        localStorage.setItem('ipmil_data_version', String(DATA_VERSION));
        return fresh;
    }
    return JSON.parse(raw);
}

function saveData(data) {
    localStorage.setItem('ipmil_data', JSON.stringify(data));
}

function resetData() {
    localStorage.setItem('ipmil_data', JSON.stringify(DEFAULT_DATA));
}
