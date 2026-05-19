// script.js

// DATA MENU ASLI LENGKAP (15 Menu)
const daftarMenu = [
    { id: 1, nama: "Es Jeruk", harga: 7000, ikon: "fa-solid fa-glass-water text-orange-400", stok: 40 },
    { id: 2, nama: "Air Mineral Vit", harga: 3000, ikon: "fa-solid fa-bottle-water text-blue-400", stok: 50 },
    { id: 3, nama: "Aqua", harga: 5000, ikon: "fa-solid fa-bottle-water text-blue-500", stok: 30 },
    { id: 4, nama: "Soto", harga: 12000, ikon: "fa-solid fa-bowl-food text-amber-600", stok: 20 },
    { id: 5, nama: "Sop Ayam", harga: 12000, ikon: "fa-solid fa-bowl-soup text-yellow-600", stok: 15 },
    { id: 6, nama: "Ayam Mentega", harga: 12000, ikon: "fa-solid fa-drumstick-bite text-amber-700", stok: 15 },
    { id: 7, nama: "Ayam Madu", harga: 12000, ikon: "fa-solid fa-drumstick-bite text-yellow-500", stok: 12 },
    { id: 8, nama: "Ayam Kipas", harga: 12000, ikon: "fa-solid fa-drumstick-bite text-orange-500", stok: 10 },
    { id: 9, nama: "Ayam Geprek", harga: 15000, ikon: "fa-solid fa-fire text-red-500", stok: 25 },
    { id: 10, nama: "Ayam Bumbu Iseng", harga: 12000, ikon: "fa-solid fa-drumstick-bite text-indigo-500", stok: 8 },
    { id: 11, nama: "Katsu", harga: 14000, ikon: "fa-solid fa-utensils text-slate-500", stok: 15 },
    { id: 12, nama: "Mendoan", harga: 1500, ikon: "fa-solid fa-cheese text-yellow-400", stok: 100 },
    { id: 13, nama: "Tahu Tempe Penyet", harga: 8000, ikon: "fa-solid fa-pepper-hot text-red-600", stok: 20 },
    { id: 14, nama: "Ati Goreng", harga: 10000, ikon: "fa-solid fa-bacon text-red-700", stok: 10 },
    { id: 15, nama: "Nasgor", harga: 12000, ikon: "fa-solid fa-plate-wheat text-amber-500", stok: 30 }
];

// Memanggil langsung file gambar QRIS lokal dari satu folder yang sama
const qrisImageBase64 = "qris.jpeg";

// Array penampung riwayat transaksi ril di sisi Owner/Kasir
let riwayatTransaksi = [
    { tanggal: "19/05/2026 14:12", deskripsi: "1x Ayam Geprek, 1x Es Jeruk", total: 22000 },
    { tanggal: "19/05/2026 15:30", deskripsi: "2x Soto, 2x Aqua", total: 34000 }
];

let keranjang = {};

// NAVIGATION & SECURITY SYSTEM
function login(role) {
    if (role === 'pembeli') {
        document.getElementById('login').classList.add('hidden');
        document.getElementById('pembeli').classList.remove('hidden');
        renderMenuPembeli();
    } else if (role === 'penjual') {
        // FITUR KEAMANAN LOGIN OWNER
        let inputUsername = prompt("Masukkan Username Owner:");
        
        // Jika user menekan tombol batal/cancel pada prompt username
        if (inputUsername === null) return;

        let inputPassword = prompt("Masukkan Sandi Keamanan:");
        
        // Jika user menekan tombol batal/cancel pada prompt password
        if (inputPassword === null) return;

        // Validasi kredensial login
        if (inputUsername === "adminkantin" && inputPassword === "kantin-neo-04") {
            alert("🔓 Akses Diterima. Selamat datang Owner Kantin!");
            document.getElementById('login').classList.add('hidden');
            document.getElementById('penjual').classList.remove('hidden');
            showMenu();
        } else {
            alert("🔒 Akses Ditolak! Username atau Sandi salah.");
        }
    }
}

function kembali() {
    document.getElementById('pembeli').classList.add('hidden');
    document.getElementById('penjual').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
    
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('bottom-bar').classList.remove('hidden');
    
    keranjang = {};
    updateTotalHarga();
    document.getElementById('qr').innerHTML = ""; 
}

function backKeMenuMakanan() {
    document.getElementById('qr').innerHTML = ""; 
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('bottom-bar').classList.remove('hidden');
    document.querySelector('#pembeli h2').innerText = "Daftar Menu Makanan";
}

// PEMBELI CONTROLLER
function renderMenuPembeli() {
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = ""; 

    daftarMenu.forEach(item => {
        const jumlahPorsi = keranjang[item.id] || 0;
        
        const card = document.createElement('div');
        card.className = "menu-card bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center";
        card.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl border border-blue-100">
                    <i class="${item.ikon}"></i>
                </div>
                <div>
                    <h4 class="font-bold text-slate-800 text-sm md:text-base">${item.nama}</h4>
                    <p class="text-xs text-slate-400">Stok: ${item.stok}</p>
                    <p class="text-sm font-semibold text-blue-800 mt-0.5">Rp ${item.harga.toLocaleString('id-ID')}</p>
                </div>
            </div>
            <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
                <button onclick="ubahJumlah(${item.id}, -1)" class="w-7 h-7 bg-white hover:bg-red-50 text-red-500 rounded-lg shadow-sm font-bold flex items-center justify-center text-xs transition">-</button>
                <span id="qty-${item.id}" class="w-6 text-center text-sm font-bold text-slate-700">${jumlahPorsi}</span>
                <button onclick="ubahJumlah(${item.id}, 1)" class="w-7 h-7 bg-white hover:bg-blue-50 text-blue-900 rounded-lg shadow-sm font-bold flex items-center justify-center text-xs transition">+</button>
            </div>
        `;
        menuContainer.appendChild(card);
    });
}

function ubahJumlah(id, perubahan) {
    const item = daftarMenu.find(m => m.id === id);
    if (!item) return;

    if (!keranjang[id]) keranjang[id] = 0;

    if (keranjang[id] + perubahan > item.stok) {
        alert(`Maaf, sisa stok ${item.nama} tidak mencukupi.`);
        return;
    }
    
    keranjang[id] += perubahan;

    if (keranjang[id] <= 0) {
        delete keranjang[id];
        document.getElementById(`qty-${id}`).innerText = 0;
    } else {
        document.getElementById(`qty-${id}`).innerText = keranjang[id];
    }

    updateTotalHarga();
}

function updateTotalHarga() {
    let total = 0;
    for (const id in keranjang) {
        const item = daftarMenu.find(m => m.id == id);
        if (item) {
            total += item.harga * keranjang[id];
        }
    }
    document.getElementById('total').innerText = `Rp ${total.toLocaleString('id-ID')}`;
    return total;
}

function bayar() {
    const total = updateTotalHarga();
    if (total === 0) {
        alert("Pilih makanan atau minuman terlebih dahulu sebelum membayar!");
        return;
    }

    let itemTerbeli = [];
    for (const id in keranjang) {
        const item = daftarMenu.find(m => m.id == id);
        if (item) {
            itemTerbeli.push(`${keranjang[id]}x ${item.nama}`);
            item.stok -= keranjang[id];
        }
    }
    const deskripsiPesanan = itemTerbeli.join(', ');

    const waktuSekarang = new Date();
    const stringWaktu = waktuSekarang.toLocaleDateString('id-ID') + " " + waktuSekarang.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
    
    riwayatTransaksi.unshift({
        tanggal: stringWaktu,
        deskripsi: deskripsiPesanan,
        total: total
    });

    document.getElementById('menu').classList.add('hidden');
    document.getElementById('bottom-bar').classList.add('hidden');
    document.querySelector('#pembeli h2').innerText = "Metode Pembayaran";

    const qrContainer = document.getElementById('qr');
    qrContainer.innerHTML = `
        <div class="bg-white p-5 rounded-3xl shadow-md border border-slate-100 text-center my-2 max-w-sm mx-auto animate-fade-in">
            <div class="overflow-hidden rounded-2xl border-2 border-slate-100 bg-white p-1 mb-4 shadow-sm">
                <img src="${qrisImageBase64}" alt="QRIS KANTIN NEO 04" class="w-full h-auto mx-auto object-contain">
            </div>
            
            <div class="bg-blue-50 py-2.5 px-4 rounded-xl mb-4">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Pembayaran</p>
                <p class="text-xl font-bold text-blue-900">Rp ${total.toLocaleString('id-ID')}</p>
            </div>

            <div class="flex flex-col gap-2">
                <button onclick="backKeMenuMakanan()" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2">
                    <i class="fas fa-arrow-left text-xs"></i> Kembali ke Menu Makanan
                </button>
                <button onclick="alert('Terima kasih! Pesanan diproses.'); kembali();" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-sm">
                    <i class="fas fa-check-circle"></i> Selesai Bayar
                </button>
            </div>
        </div>
    `;
    
    qrContainer.scrollIntoView({ behavior: 'smooth' });
}

// OWNER CONTROLLER
function switchTabEffect(activeId, inactiveId) {
    document.getElementById(activeId).className = "bg-white text-slate-800 font-medium py-2 px-3 rounded-lg text-sm shadow-sm transition flex items-center justify-center gap-2";
    document.getElementById(inactiveId).className = "text-slate-600 hover:text-slate-800 font-medium py-2 px-3 rounded-lg text-sm transition flex items-center justify-center gap-2";
}

function showMenu() {
    switchTabEffect('tab-menu', 'tab-laporan');
    const content = document.getElementById('content');
    
    let tabelHTML = `
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-base text-slate-800">Manajemen Stok Menu</h3>
            <button onclick="alert('Fitur tambah makanan baru')" class="bg-blue-900 text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-blue-950 transition"><i class="fas fa-plus text-yellow-400"></i> Tambah</button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead>
                    <tr class="bg-slate-100 text-slate-600 uppercase border-b border-slate-200">
                        <th class="py-2.5 px-2">Nama Menu</th>
                        <th class="py-2.5 px-2">Harga Jual</th>
                        <th class="py-2.5 px-2 text-center">Stok</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
    `;

    daftarMenu.forEach(item => {
        tabelHTML += `
            <tr class="hover:bg-slate-50 text-slate-700">
                <td class="py-3 px-2 font-medium">${item.nama}</td>
                <td class="py-3 px-2">Rp ${item.harga.toLocaleString('id-ID')}</td>
                <td class="py-3 px-2 text-center font-bold ${item.stok < 10 ? 'text-red-500' : 'text-slate-700'}">${item.stok}</td>
            </tr>
        `;
    });

    tabelHTML += `</tbody></table></div>`;
    content.innerHTML = tabelHTML;
}

function showLaporan() {
    switchTabEffect('tab-laporan', 'tab-menu');
    const content = document.getElementById('content');
    
    let totalPendapatanRil = riwayatTransaksi.reduce((sum, trx) => sum + trx.total, 0);
    let totalTransaksiSukses = riwayatTransaksi.length;

    let logHTML = "";
    riwayatTransaksi.forEach(trx => {
        logHTML += `<li class="flex justify-between border-b border-slate-200 pb-1.5 pt-0.5">
            <div class="pr-2">
                <span class="block font-medium text-slate-700">${trx.deskripsi}</span>
                <span class="text-[9px] text-slate-400">${trx.tanggal}</span>
            </div> 
            <span class="font-semibold text-slate-800 whitespace-nowrap">Rp ${trx.total.toLocaleString('id-ID')}</span>
        </li>`;
    });
    
    content.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-base text-slate-800">Omzet Penjualan Kantin</h3>
            <button onclick="resetLaporan()" class="bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-semibold px-2 py-1 rounded-lg transition">
                <i class="fas fa-trash-alt"></i> Reset Laporan
            </button>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-5">
            <div class="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                <p class="text-[10px] uppercase font-semibold text-emerald-600">Pendapatan Hari Ini</p>
                <p class="text-base font-bold text-emerald-700 mt-0.5">Rp ${totalPendapatanRil.toLocaleString('id-ID')}</p>
            </div>
            <div class="bg-blue-50 border border-blue-100 p-3 rounded-xl">
                <p class="text-[10px] uppercase font-semibold text-blue-900">Total Transaksi</p>
                <p class="text-base font-bold text-blue-950 mt-0.5">${totalTransaksiSukses} Sukses</p>
            </div>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <h4 class="text-xs font-bold text-slate-600 mb-2 uppercase">Aktivitas Pesanan Terakhir</h4>
            <ul class="text-[11px] text-slate-500 space-y-2 max-h-48 overflow-y-auto">
                ${riwayatTransaksi.length === 0 ? '<li class="text-center py-4 text-slate-400">Belum ada transaksi</li>' : logHTML}
            </ul>
        </div>
    `;
}

function resetLaporan() {
    let konfirmasi = confirm("Apakah Anda yakin ingin menghapus/merestart seluruh riwayat laporan transaksi hari ini? Data yang belum diunduh ke Excel akan hilang.");
    if (konfirmasi) {
        riwayatTransaksi = []; 
        showLaporan(); 
        alert("Laporan berhasil di-restart menjadi Rp 0!");
    }
}

function downloadExcel() {
    if (riwayatTransaksi.length === 0) {
        alert("Belum ada data transaksi masuk untuk diunduh!");
        return;
    }

    let excelTemplate = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; }
                table { border-collapse: collapse; width: 100%; }
                th { background-color: #1e3a8a; color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #cbd5e1; }
                td { border: 1px solid #cbd5e1; padding: 6px; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .header-title { font-size: 16px; font-weight: bold; color: #1e3a8a; text-align: center; }
            </style>
        </head>
        <body>
            <table>
                <tr><td colspan="4" class="header-title">LAPORAN TRANSAKSI PENJUALAN REAL-TIME</td></tr>
                <tr><td colspan="4" class="text-center">KANTIN NEO 04 - KAMPUS IT UMP</td></tr>
                <tr><td colspan="4"></td></tr>
                <thead>
                    <tr>
                        <th style="width: 50px;">No</th>
                        <th style="width: 150px;">Waktu Transaksi</th>
                        <th style="width: 300px;">Detail Item Menu Belanja</th>
                        <th style="width: 120px;">Total Tagihan</th>
                    </tr>
                </thead>
                <tbody>
    `;

    let totalOmzetSemua = 0;
    riwayatTransaksi.forEach((trx, index) => {
        totalOmzetSemua += trx.total;
        excelTemplate += `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td class="text-center">${trx.tanggal}</td>
                <td>${trx.deskripsi}</td>
                <td class="text-right">Rp ${trx.total.toLocaleString('id-ID')}</td>
            </tr>
        `;
    });

    excelTemplate += `
                <tr>
                    <td colspan="3" style="text-align: right; font-weight: bold; background-color: #f1f5f9;">TOTAL OMZET PENDAPATAN:</td>
                    <td class="text-right" style="font-weight: bold; background-color: #f1f5f9; color: #16a34a;">Rp ${totalOmzetSemua.toLocaleString('id-ID')}</td>
                </tr>
                </tbody>
            </table>
        </body>
        </html>
    `;

    const dataUri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelTemplate);
    const linkDownload = document.createElement("a");
    linkDownload.href = dataUri;
    linkDownload.download = "Laporan_Transaksi_KantinNeo04_UMP.xls";
    
    document.body.appendChild(linkDownload);
    linkDownload.click();
    document.body.removeChild(linkDownload);
}
