// ============================================================
// DASHBOARD ADMIN – Logic
// ============================================================

// Auth guard
if (localStorage.getItem('admin_logged_in') !== 'true') {
    window.location.href = 'login.html';
}

document.getElementById('admin-name').textContent =
    localStorage.getItem('admin_user') || 'Admin';

// ---- TAB NAVIGATION ----
function showTab(name) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

    document.getElementById('tab-' + name).classList.add('active');

    const titles = {
        dashboard: ['Dashboard', 'Selamat datang di panel administrasi'],
        anggota: ['Kelola Anggota', 'Tambah, edit, atau hapus data peserta magang'],
        aktivitas: ['Kelola Aktivitas', 'Tambah, edit, atau hapus dokumentasi kegiatan'],
        tentang: ['Tentang & Program', 'Edit konten halaman Tentang Kami dan Program Kerja'],
        pengaturan: ['Pengaturan', 'Konfigurasi akun dan keamanan'],
    };
    document.getElementById('page-title').textContent = titles[name][0];
    document.getElementById('page-subtitle').textContent = titles[name][1];

    // Mark active sidebar
    const links = document.querySelectorAll('.sidebar-link');
    links.forEach(l => {
        if (l.getAttribute('onclick') && l.getAttribute('onclick').includes(`'${name}'`)) {
            l.classList.add('active');
        }
    });

    if (name === 'anggota') renderMembers();
    if (name === 'aktivitas') renderActivities();
    if (name === 'tentang') loadTentang();
}

function showMemberSection(section) {
    document.getElementById('section-survei').classList.toggle('hidden', section !== 'survei');
    document.getElementById('section-admin-div').classList.toggle('hidden', section !== 'admin-div');
    document.getElementById('btn-survei').className = section === 'survei'
        ? 'px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold'
        : 'px-5 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50';
    document.getElementById('btn-admin-div').className = section === 'admin-div'
        ? 'px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold'
        : 'px-5 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50';
}

// ---- RENDER MEMBERS ----
function renderMembers() {
    const data = getData();
    ['survei', 'administrasi'].forEach(div => {
        const list = document.getElementById(div === 'survei' ? 'survei-list' : 'admin-list');
        list.innerHTML = '';
        (data.members[div] || []).forEach(m => {
            list.innerHTML += `
            <div class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                <img src="../images/${m.photo}" alt="${m.name}"
                    class="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                    onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=1e40af&color=fff'">
                <div class="flex-1">
                    <p class="font-semibold text-gray-800">${m.name}</p>
                    <p class="text-sm text-gray-500">${m.role}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="editMember(${m.id}, '${div}')"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="deleteMember(${m.id}, '${div}')"
                        class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Hapus">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>`;
        });
    });
    updateStats();
}

// ---- RENDER ACTIVITIES ----
function renderActivities() {
    const data = getData();
    const list = document.getElementById('activity-list');
    list.innerHTML = '';

    // Group by week
    const weeks = {};
    data.activities.forEach(a => {
        if (!weeks[a.week]) weeks[a.week] = [];
        weeks[a.week].push(a);
    });

    Object.keys(weeks).forEach(week => {
        list.innerHTML += `<h4 class="font-bold text-gray-600 text-sm mt-4 mb-2 uppercase tracking-wide">${week}</h4>`;
        weeks[week].forEach(a => {
            const dateStr = a.date ? new Date(a.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-';
            list.innerHTML += `
            <div class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                <img src="../images/${a.photo}" alt="${a.title}"
                    class="w-16 h-12 rounded-lg object-cover border border-gray-200"
                    onerror="this.style.display='none'">
                <div class="flex-1">
                    <p class="font-semibold text-gray-800 text-sm">${a.title}</p>
                    <p class="text-xs text-primary mb-1"><i class="fa-regular fa-calendar mr-1"></i>${dateStr}</p>
                    <p class="text-xs text-gray-500 line-clamp-1">${a.desc}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="editActivity(${a.id})"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="deleteActivity(${a.id})"
                        class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Hapus">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>`;
        });
    });
    updateStats();
}

// ---- STATS ----
function updateStats() {
    const data = getData();
    const totalMembers = (data.members.survei || []).length + (data.members.administrasi || []).length;
    document.getElementById('stat-anggota').textContent = totalMembers;
    document.getElementById('stat-aktivitas').textContent = (data.activities || []).length;
    const weeks = new Set((data.activities || []).map(a => a.week));
    document.getElementById('stat-minggu').textContent = weeks.size;
}

// ---- MEMBER MODAL ----
let editingMemberId = null;
let editingMemberDiv = null;

function openMemberModal(division) {
    editingMemberId = null;
    editingMemberDiv = division;
    document.getElementById('modal-member-title').textContent = 'Tambah Anggota Baru';
    document.getElementById('member-form').reset();
    document.getElementById('member-division').value = division;
    document.getElementById('member-modal').classList.remove('hidden');
}

function editMember(id, division) {
    const data = getData();
    const member = data.members[division].find(m => m.id === id);
    if (!member) return;
    editingMemberId = id;
    editingMemberDiv = division;
    document.getElementById('modal-member-title').textContent = 'Edit Anggota';
    document.getElementById('member-id').value = id;
    document.getElementById('member-division').value = division;
    document.getElementById('member-name').value = member.name;
    document.getElementById('member-role').value = member.role;
    document.getElementById('member-photo').value = member.photo;
    document.getElementById('member-modal').classList.remove('hidden');
}

function closeMemberModal() {
    document.getElementById('member-modal').classList.add('hidden');
}

document.getElementById('member-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const division = document.getElementById('member-division').value;
    const name = document.getElementById('member-name').value;
    const role = document.getElementById('member-role').value;
    const photo = document.getElementById('member-photo').value || 'anggota1.jpg';

    if (editingMemberId) {
        const idx = data.members[division].findIndex(m => m.id === editingMemberId);
        if (idx !== -1) data.members[division][idx] = { id: editingMemberId, name, role, photo };
    } else {
        const newId = Date.now();
        data.members[division].push({ id: newId, name, role, photo });
    }
    saveData(data);
    closeMemberModal();
    renderMembers();
    showToast('Anggota berhasil disimpan!');
});

function deleteMember(id, division) {
    if (!confirm('Yakin ingin menghapus anggota ini?')) return;
    const data = getData();
    data.members[division] = data.members[division].filter(m => m.id !== id);
    saveData(data);
    renderMembers();
    showToast('Anggota berhasil dihapus!');
}

// ---- ACTIVITY MODAL ----
let editingActivityId = null;

function openActivityModal() {
    editingActivityId = null;
    document.getElementById('modal-activity-title').textContent = 'Tambah Aktivitas Baru';
    document.getElementById('activity-form').reset();
    document.getElementById('activity-modal').classList.remove('hidden');
}

function editActivity(id) {
    const data = getData();
    const act = data.activities.find(a => a.id === id);
    if (!act) return;
    editingActivityId = id;
    document.getElementById('modal-activity-title').textContent = 'Edit Aktivitas';
    document.getElementById('activity-id').value = id;
    document.getElementById('activity-week').value = act.week;
    document.getElementById('activity-date').value = act.date;
    document.getElementById('activity-title').value = act.title;
    document.getElementById('activity-desc').value = act.desc;
    document.getElementById('activity-photo').value = act.photo;
    document.getElementById('activity-modal').classList.remove('hidden');
}

function closeActivityModal() {
    document.getElementById('activity-modal').classList.add('hidden');
}

document.getElementById('activity-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const entry = {
        week: document.getElementById('activity-week').value,
        date: document.getElementById('activity-date').value,
        title: document.getElementById('activity-title').value,
        desc: document.getElementById('activity-desc').value,
        photo: document.getElementById('activity-photo').value || 'aktivitas1.jpg',
    };
    if (editingActivityId) {
        const idx = data.activities.findIndex(a => a.id === editingActivityId);
        if (idx !== -1) data.activities[idx] = { id: editingActivityId, ...entry };
    } else {
        data.activities.push({ id: Date.now(), ...entry });
    }
    saveData(data);
    closeActivityModal();
    renderActivities();
    showToast('Aktivitas berhasil disimpan!');
});

function deleteActivity(id) {
    if (!confirm('Yakin ingin menghapus aktivitas ini?')) return;
    const data = getData();
    data.activities = data.activities.filter(a => a.id !== id);
    saveData(data);
    renderActivities();
    showToast('Aktivitas berhasil dihapus!');
}

// ---- TENTANG ----
function loadTentang() {
    const data = getData();
    document.getElementById('desc-umum').value = data.tentang.umum;
    document.getElementById('desc-survei').value = data.tentang.survei;
    document.getElementById('desc-admin').value = data.tentang.admin;
}

function saveTentang() {
    const data = getData();
    data.tentang.umum = document.getElementById('desc-umum').value;
    data.tentang.survei = document.getElementById('desc-survei').value;
    data.tentang.admin = document.getElementById('desc-admin').value;
    saveData(data);
    showToast('Konten berhasil disimpan!');
}

// ---- PASSWORD ----
function changePassword() {
    const oldPass = document.getElementById('old-pass').value;
    const newPass = document.getElementById('new-pass').value;
    const confirmPass = document.getElementById('confirm-pass').value;
    const msg = document.getElementById('pass-msg');
    const data = getData();

    if (oldPass !== data.admin.password) {
        msg.className = 'text-red-600 text-sm';
        msg.textContent = 'Password lama tidak sesuai.';
        msg.classList.remove('hidden');
        return;
    }
    if (newPass.length < 6) {
        msg.className = 'text-red-600 text-sm';
        msg.textContent = 'Password baru minimal 6 karakter.';
        msg.classList.remove('hidden');
        return;
    }
    if (newPass !== confirmPass) {
        msg.className = 'text-red-600 text-sm';
        msg.textContent = 'Konfirmasi password tidak cocok.';
        msg.classList.remove('hidden');
        return;
    }
    data.admin.password = newPass;
    saveData(data);
    msg.className = 'text-green-600 text-sm';
    msg.textContent = 'Password berhasil diubah!';
    msg.classList.remove('hidden');
    document.getElementById('old-pass').value = '';
    document.getElementById('new-pass').value = '';
    document.getElementById('confirm-pass').value = '';
}

// ---- LOGOUT ----
function logout() {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_user');
    window.location.href = 'login.html';
}

// ---- TOAST ----
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ---- INIT ----
updateStats();
