document.addEventListener("DOMContentLoaded", function(){

let role = "";

/* LOGIN + PASSWORD OWNER */
window.login = function(pilih){

    if(pilih === "penjual"){
        let pass = prompt("Masukkan sandi Owner:");

        if(pass !== "kantin-neo-04"){
            alert("Sandi salah!");
            return;
        }
    }

    role = pilih;
    document.getElementById("login").style.display = "none";
    document.getElementById(pilih).style.display = "block";
}

/* BACK */
window.kembali = function(){
    document.getElementById("login").style.display = "block";
    document.getElementById("pembeli").style.display = "none";
    document.getElementById("penjual").style.display = "none";

    document.getElementById("qr").innerHTML = "";
    window.scrollTo(0,0);
}

/* MENU */
let menu = [
    {nama:"Es Jeruk",harga:7000},
    {nama:"Air Mineral Vit",harga:3000},
    {nama:"Aqua",harga:5000},
    {nama:"Soto",harga:12000},
    {nama:"Sop Ayam",harga:12000},
    {nama:"Ayam Mentega",harga:12000},
    {nama:"Ayam Madu",harga:12000},
    {nama:"Ayam Kipas",harga:12000},
    {nama:"Ayam Geprek",harga:15000},
    {nama:"Ayam Bumbu Iseng",harga:12000},
    {nama:"Katsu",harga:14000},
    {nama:"Mendoan",harga:1500},
    {nama:"Tahu Tempe Penyet",harga:8000},
    {nama:"Ati Goreng",harga:10000},
    {nama:"Nasi Goreng",harga:12000}
];

let cart = [];
let total = 0;
let laporan = [];
let lastTotal = 0;

function rupiah(x){
    return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR"}).format(x);
}

/* TAMPIL MENU */
const menuDiv = document.getElementById("menu");

menu.forEach(item=>{
    let div = document.createElement("div");
    div.className = "menu-item";

    div.innerHTML = `
        <div>
            <h4>${item.nama}</h4>
            <p>${rupiah(item.harga)}</p>
        </div>
        <div>
            <button onclick='kurang(${JSON.stringify(item)})'>-</button>
            <span id="qty-${item.nama}">0</span>
            <button onclick='tambah(${JSON.stringify(item)})'>+</button>
        </div>
    `;

    menuDiv.appendChild(div);
});

/* TAMBAH */
window.tambah = function(item){
    cart.push(item);
    total += item.harga;

    let qtyEl = document.getElementById("qty-" + item.nama);
    qtyEl.innerText = parseInt(qtyEl.innerText) + 1;

    document.getElementById("total").innerText = rupiah(total);
}

/* KURANG */
window.kurang = function(item){
    let index = cart.findIndex(i => i.nama === item.nama);

    if(index !== -1){
        cart.splice(index, 1);
        total -= item.harga;

        if(total < 0) total = 0;

        let qtyEl = document.getElementById("qty-" + item.nama);
        let current = parseInt(qtyEl.innerText);

        if(current > 0){
            qtyEl.innerText = current - 1;
        }

        document.getElementById("total").innerText = rupiah(total);
    }
}

/* TAMPIL QR + SCANNER */
window.tampilQR = function(total){
    const qrDiv = document.getElementById("qr");

    qrDiv.innerHTML = `
        <h3>Scan QRIS</h3>
        <img src="qris.jpeg" width="250">
        <p>${rupiah(total)}</p>
        <div id="reader" style="width:300px; margin:auto;"></div>
    `;

    startScanner();
}

/* BAYAR */
window.bayar = function(){
    if(total == 0){
        alert("Belum ada pesanan");
        return;
    }

    tampilQR(total);
    lastTotal = total;

    cart = [];
    total = 0;
    document.getElementById("total").innerText = "Rp 0";
}

/* QR SCANNER */
function startScanner(){
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            alert("Pembayaran berhasil (QR ter-scan)");

            laporan.push({
                tanggal:new Date().toLocaleString(),
                total:lastTotal
            });

            html5QrCode.stop();
            document.getElementById("reader").innerHTML = "";
            document.getElementById("qr").innerHTML = "";
        }
    ).catch(err=>{
        console.log(err);
    });
}

/* OWNER */
window.showMenu = function(){
    let html="<h3>Daftar Menu</h3>";
    menu.forEach(m=>{
        html+=`<p>${m.nama} - ${rupiah(m.harga)}</p>`;
    });
    document.getElementById("content").innerHTML=html;
}

window.showLaporan = function(){
    let html="<h3>Laporan</h3>";
    laporan.forEach(l=>{
        html+=`<p>${l.tanggal} - ${rupiah(l.total)}</p>`;
    });
    document.getElementById("content").innerHTML=html;
}

/* EXPORT */
window.downloadExcel = function(){
    let csv="Tanggal,Total\n";
    laporan.forEach(l=>{
        csv+=`${l.tanggal},${l.total}\n`;
    });

    let blob=new Blob([csv],{type:"text/csv"});
    let a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="laporan.csv";
    a.click();
}

});