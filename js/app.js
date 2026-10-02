// RIC Main Application Views & Routing Logic

function setApp(h) {
  document.getElementById('app').innerHTML = h;
}

function showLoading() {
  setApp(layout('<main class="page"><div class="container" style="min-height:55vh;display:grid;place-items:center;text-align:center"><p style="color:var(--muted);font-size:18px">⏳ Memuat halaman...</p></div></main>'));
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m]));
}

function layout(content) {
  return `<header><div class="container nav">
  <a class="brand" href="/"><span class="logo">RIC</span> RIC</a>
  <nav class="navlinks"><a href="/">Beranda</a><a href="/kelola-kartu">Kelola Kartu</a><a href="/bantuan">Bantuan</a></nav>
  <div class="nav-actions"><a class="btn btn-secondary" href="/kelola-kartu">Kelola Kartu</a><a class="btn btn-primary" href="https://wa.me/6283834299229?text=Halo%2C%20saya%20ingin%20pesan%20kartu%20RIC" target="_blank" rel="noreferrer">Pesan sekarang</a></div>
  <button class="hamburger" aria-label="Buka menu" onclick="toggleMenu()"><span></span><span></span><span></span></button>
  </div></header>
  <div class="mobile-menu" id="mobileMenu" onclick="if(event.target===this)toggleMenu()"><div class="mobile-panel"><button class="mobile-close" onclick="toggleMenu()">✕</button><a href="/">Beranda</a><a href="/kelola-kartu">Kelola Kartu</a><a href="/bantuan">Bantuan</a><div class="mobile-wa"><a class="btn btn-primary" href="https://wa.me/6283834299229?text=Halo%2C%20saya%20ingin%20pesan%20kartu%20RIC" target="_blank" rel="noreferrer" style="width:100%">Pesan sekarang</a></div></div></div>
  ${content}`;
}

function home() {
  return layout(`
  <main>
  <section class="hero"><div class="container hero-grid">
  <div><span class="eyebrow">● NFC + QR Google Review</span><h1>Review bisnis Anda, sekarang semudah <span style="color:#1558d6">tap.</span></h1><p>RIC membantu bisnis mendapatkan Google Review dengan kartu NFC dan QR Code yang praktis. Cukup dekatkan smartphone ke kartu atau scan QR, pelanggan langsung diarahkan ke halaman review bisnis Anda.</p><div class="actions"><a class="btn btn-primary" href="/kelola-kartu">Kelola kartu</a></div><div class="trust"><span>✔️ NFC</span><span>✔️ QR</span><span>✔️ Google Review</span></div></div>
  <div class="product-wrap"><div class="product-card"><img src="/assets/ric-card-reference.png" alt="Kartu RIC NFC dan QR Google Review"></div><div class="float-badge">📱 Tap → Review Google</div></div>
  </div></section>
  <section id="produk"><div class="container"><div class="section-head"><h2>Dibuat untuk bisnis lokal.</h2><p>Letakkan kartu di titik yang paling sering dilewati pelanggan.</p></div><div class="features"><div class="feature"><div class="icon">⚡</div><h3>Lebih cepat</h3><p>NFC membuat pelanggan tidak perlu membuka kamera untuk memulai.</p></div><div class="feature"><div class="icon">🔗</div><h3>Link fleksibel</h3><p>Google Review URL tersimpan di sistem, bukan di kartu fisik.</p></div><div class="feature"><div class="icon">📊</div><h3>Siap dianalisis</h3><p>Struktur RIC dapat mencatat interaksi NFC, QR, dan redirect.</p></div></div></div></section>
  <section><div class="container"><div class="section-head"><h2>Cocok untuk berbagai bisnis</h2><p>Satu konsep yang mudah ditempatkan di counter, meja, resepsionis, atau kasir.</p></div><div class="businesses"><div class="business">☕ Kafe</div><div class="business">🧴 Toko</div><div class="business">🧾 Klinik</div><div class="business">🏨 Hotel</div><div class="business">🍜 Restoran</div></div></div></section>
  <section><div class="container"><div class="cta"><div><h2>Mulai kelola kartu RIC.</h2><p>Aktifkan kartu, atur link Google Review, dan kelola konfigurasi bisnis Anda.</p></div><a class="btn" style="background:#fff;color:var(--blue);font-weight:900" href="/kelola-kartu">Kelola sekarang</a></div></div></section>
  </main>`);
}

function manage() {
  return layout(`<main class="page"><div class="container"><div class="center"><h1 class="page-title">Kelola Kartu RIC</h1><p class="page-sub">Masukkan Card ID dari kartu Anda untuk mengakses aktivasi dan dashboard.</p><div class="field"><label>Card ID</label><input id="cardInput" placeholder="Contoh: RIC-00001" autocomplete="off"></div><button class="btn btn-primary" style="width:100%" onclick="openCard()">Lanjutkan</button><div class="note">Tip: Anda juga dapat membuka URL kartu langsung setelah QR/NFC dibaca, misalnya <b>/c/RIC-00001</b>.</div><div id="manageMsg"></div></div></div></main>`);
}

async function openCard() {
  const id = document.getElementById("cardInput").value.trim().toUpperCase(), msg = document.getElementById("manageMsg");
  if (!id) { msg.innerHTML = '<div class="error">Masukkan Card ID terlebih dahulu.</div>'; return; }
  msg.innerHTML = '<p class="muted" style="padding:10px 0;font-size:13px">⏳ Memeriksa kartu...</p>';
  const card = await getCard(id);
  if (!card) { msg.innerHTML = '<div class="error">Card ID tidak ditemukan.</div>'; return; }
  if (card.status === "inactive") { location.href = "/aktivasi/" + encodeURIComponent(id); return; }
  const pin = prompt("Masukkan PIN kartu RIC:");
  if (pin === null) return;
  if (pin === card.pin) { sessionStorage.setItem("ric_auth_" + id, "1"); location.href = "/dashboard/" + encodeURIComponent(id); }
  else msg.innerHTML = '<div class="error">PIN salah.</div>';
}

async function activate(id) {
  showLoading(); const card = await getCard(id);
  if (!card) { setApp(layout(`<main class="page"><div class="container center"><div class="error">Kartu tidak ditemukan.</div></div></main>`)); return; }
  setApp(layout(`<main class="page"><div class="container center"><h1 class="page-title">Aktivasi Kartu</h1><p class="page-sub">Aktifkan <b>${esc(id)}</b> dan hubungkan dengan Google Review bisnis Anda.</p><div class="panel"><div class="field"><label>Nomor WhatsApp</label><input id="phone" placeholder="+62..."></div><div class="field"><label>🔍 Cari Toko atau Tempel Link Google Maps <span style="font-weight:400;color:var(--muted)"></span></label><div class="search-row"><input id="placeSearch" placeholder="Contoh: Jagongan Bandung ATAU https://maps.app.goo.gl/..."><button class="btn btn-secondary" onclick="searchPlace('placeSearch','placeResults','review')">Cari / Konversi</button></div><div id="placeResults" class="place-results"></div><div class="field" style="margin-top:12px"><label>URL Google Review</label><input id="review" placeholder="Akan terisi otomatis atau paste link Google Maps di sini" oninput="handleReviewPaste(this, 'actMsg')"></div></div><div class="field"><label>PIN (minimal 4 digit)</label><input id="pin" type="password" inputmode="numeric" maxlength="12"></div><div class="field"><label>Konfirmasi PIN</label><input id="pin2" type="password" inputmode="numeric" maxlength="12"></div><button class="btn btn-primary" style="width:100%" onclick="doActivate('${esc(id)}')">Aktifkan Kartu</button><div id="actMsg"></div></div></div></div></main>`));
}

async function doActivate(id) {
  const phone = document.getElementById("phone").value.trim(), review = document.getElementById("review").value.trim(), pin = document.getElementById("pin").value, pin2 = document.getElementById("pin2").value, msg = document.getElementById("actMsg");
  if (!review || pin.length < 4 || pin !== pin2) { msg.innerHTML = '<div class="error">Pastikan URL review terisi, PIN minimal 4 digit dan konfirmasi cocok.</div>'; return; }
  try { new URL(review) } catch (e) { msg.innerHTML = '<div class="error">Google Review URL tidak valid.</div>'; return; }
  msg.innerHTML = '<p class="muted" style="padding:10px 0;font-size:13px">⏳ Mengaktifkan kartu...</p>';
  await patchCard(id, {
    status: "active",
    phone: phone,
    google_review_url: review,
    pin: pin,
    activated_at: new Date().toISOString()
  });
  msg.innerHTML = '<div class="success">Kartu berhasil diaktifkan! Mengarahkan ke halaman Google Review...</div>';
  sessionStorage.setItem("ric_auth_" + id, "1");
  setTimeout(() => {
    window.location.href = review;
  }, 1000);
}

async function dashboard(id) {
  showLoading(); const card = await getCard(id);
  if (!card) { setApp(layout(`<main class="page"><div class="container center"><div class="error">Kartu tidak ditemukan.</div></div></main>`)); return; }
  if (sessionStorage.getItem("ric_auth_" + id) !== "1") { setApp(layout(`<main class="page"><div class="container center"><div class="panel"><h2>Akses dilindungi PIN</h2><p class="muted">Masukkan PIN untuk mengakses dashboard.</p><div class="field"><label>PIN</label><input id="dashPin" type="password"></div><button class="btn btn-primary" style="width:100%" onclick="unlockDashboard('${esc(id)}')">Masuk</button><div id="dashMsg"></div></div></div></main>`)); return; }
  const url = location.origin + "/c/" + encodeURIComponent(id);
  const qr = "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" + encodeURIComponent(url);
  setApp(layout(`<main class="page"><div class="container"><div style="display:flex;justify-content:space-between;gap:20px;align-items:flex-start;flex-wrap:wrap"><div><h1 class="page-title">Dashboard Kartu</h1><p class="page-sub">Kartu <b>${esc(id)}</b> aktif dan siap dipakai.</p></div><button class="btn btn-secondary" onclick="resetCard('${esc(id)}')">Reset Kartu</button></div><div class="dashboard-grid"><div class="stat">Total Interaksi<b>${(card.events?.nfc_visit || 0) + (card.events?.qr_visit || 0)}</b><span class="muted">NFC + QR</span></div><div class="stat">NFC Tap<b>${card.events?.nfc_visit || 0}</b><span class="muted">Tiap kunjungan</span></div><div class="stat">QR Scan<b>${card.events?.qr_visit || 0}</b><span class="muted">Tiap kunjungan</span></div></div><div class="manage-grid"><div class="panel"><h3>Informasi Kontak</h3><div class="field"><label>WhatsApp</label><input id="dPhone" value="${esc(card.phone)}"></div><button class="btn btn-primary" onclick="saveBusiness('${esc(id)}')">Simpan</button><div id="saveMsg"></div></div><div class="panel"><h3>Google Review</h3><div class="field"><label>🔍 Cari Toko atau Tempel Link Google Maps</label><div class="search-row"><input id="dPlaceSearch" placeholder="Nama toko ATAU https://maps.app.goo.gl/..."><button class="btn btn-secondary" onclick="searchPlace('dPlaceSearch','dPlaceResults','dReview')">Cari / Konversi</button></div><div id="dPlaceResults" class="place-results"></div><div class="field" style="margin-top:12px"><label>URL Review</label><input id="dReview" value="${esc(card.googleReviewUrl)}" oninput="handleReviewPaste(this, 'reviewMsg')"></div><button class="btn btn-primary" onclick="saveReview('${esc(id)}')">Simpan URL</button><div id="reviewMsg"></div></div></div><div class="panel"><h3>Keamanan</h3><div class="field"><label>PIN Lama</label><input id="oldPin" type="password"></div><div class="field"><label>PIN Baru</label><input id="newPin" type="password"></div><div class="field"><label>Konfirmasi PIN Baru</label><input id="newPin2" type="password"></div><button class="btn btn-primary" onclick="changePin('${esc(id)}')">Ubah PIN</button><div id="secMsg"></div></div><div class="panel"><h3>QR Code</h3><div class="qr"><img src="${qr}" alt="QR Code Kartu RIC"></div><p class="muted" style="text-align:center">URL kartu: <b>${esc(url)}</b></p></div></div></div></main>`));
}

async function saveBusiness(id) {
  const phone = document.getElementById("dPhone").value.trim(), msg = document.getElementById("saveMsg");
  await patchCard(id, { phone: phone });
  msg.innerHTML = '<div class="success">Informasi tersimpan.</div>';
}

async function saveReview(id) {
  const url = document.getElementById("dReview").value.trim(), m = document.getElementById("reviewMsg");
  try { new URL(url) } catch (e) { m.innerHTML = '<div class="error">URL tidak valid.</div>'; return }
  await patchCard(id, { google_review_url: url });
  m.innerHTML = '<div class="success">Google Review URL diperbarui.</div>';
}

async function changePin(id) {
  const old = document.getElementById("oldPin").value, n = document.getElementById("newPin").value, n2 = document.getElementById("newPin2").value, m = document.getElementById("secMsg");
  const card = await getCard(id);
  if (!card || old !== card.pin || n.length < 4 || n !== n2) {
    m.innerHTML = '<div class="error">PIN lama salah atau PIN baru tidak valid (min. 4 digit & konfirmasi cocok).</div>';
    return;
  }
  await patchCard(id, { pin: n });
  m.innerHTML = '<div class="success">PIN berhasil diubah.</div>';
}

async function resetCard(id) {
  if (!confirm("Yakin ingin mereset kartu ini?")) return;
  await patchCard(id, {
    status: "inactive",
    phone: "",
    address: "",
    google_review_url: "",
    pin: ""
  });
  sessionStorage.removeItem("ric_auth_" + id);
  history.pushState(null, '', '/kelola-kartu');
  route();
}

async function cardPage(id) {
  showLoading(); const card = await getCard(id);
  if (!card) { setApp(layout(`<main class="page"><div class="container review-box"><h1>Kartu tidak ditemukan</h1><p class="muted">Periksa kembali QR Code atau NFC kartu RIC Anda.</p><a class="btn btn-primary" href="/kelola-kartu">Kelola kartu</a></div></main>`)); return; }
  if (card.status === "inactive") { await activate(id); return; }
  await patchCard(id, { events: { ...(card.events || {}), review_redirect: (card.events?.review_redirect || 0) + 1 } });

  window._currentCard = card;

  setApp(layout(`
    <main class="page">
      <div class="container review-box">
        <h1 style="font-size:32px;margin-bottom:8px">Bagaimana Pengalaman Anda?</h1>
        <p class="muted">Berikan penilaian bintang untuk membantu kami meningkatkan kualitas layanan.</p>
        
        <div class="star-rating" id="starContainer">
          <span onclick="selectStar(1)" onmouseover="hoverStar(1)" onmouseout="resetStarHover()">★</span>
          <span onclick="selectStar(2)" onmouseover="hoverStar(2)" onmouseout="resetStarHover()">★</span>
          <span onclick="selectStar(3)" onmouseover="hoverStar(3)" onmouseout="resetStarHover()">★</span>
          <span onclick="selectStar(4)" onmouseover="hoverStar(4)" onmouseout="resetStarHover()">★</span>
          <span onclick="selectStar(5)" onmouseover="hoverStar(5)" onmouseout="resetStarHover()">★</span>
        </div>

        <div id="feedbackForm" style="display:none;margin-top:20px">
          <div id="lowRatingBox" style="display:none">
            <p style="color:var(--muted);font-size:15px;margin-bottom:12px">Mohon maaf atas ketidaknyamanannya. Tuliskan masukan Anda agar dapat kami tindaklanjuti langsung via WhatsApp:</p>
            <div class="field"><textarea id="feedbackText" rows="3" placeholder="Tuliskan keluhan atau saran Anda di sini..."></textarea></div>
            <button class="btn btn-primary" style="width:100%" onclick="submitRatingFeedback('${esc(id)}')">Kirim Ulasan ke Manager / Pemilik</button>
          </div>
          <div id="highRatingBox" style="display:none">
            <p style="color:#087a3e;font-weight:700;font-size:16px;margin-bottom:16px">Terima kasih banyak atas apresiasi Anda! ⭐</p>
            <a id="btnGoogleReview" class="btn btn-primary" style="width:100%" href="${card.googleReviewUrl || '#'}" target="_blank" rel="noreferrer">Lanjutkan Tulis Review di Google</a>
          </div>
        </div>
      </div>
    </main>
  `));
}

let _selectedRating = 0;

function hoverStar(n) {
  const stars = document.querySelectorAll('#starContainer span');
  stars.forEach((s, i) => {
    s.style.color = i < n ? '#f5b800' : '#cbd5e1';
  });
}

function resetStarHover() {
  const stars = document.querySelectorAll('#starContainer span');
  stars.forEach((s, i) => {
    s.style.color = i < _selectedRating ? '#f5b800' : '#cbd5e1';
  });
}

function selectStar(n) {
  _selectedRating = n;
  resetStarHover();
  const form = document.getElementById('feedbackForm');
  const lowBox = document.getElementById('lowRatingBox');
  const highBox = document.getElementById('highRatingBox');
  if (!form || !lowBox || !highBox) return;

  form.style.display = 'block';

  if (n >= 4) {
    lowBox.style.display = 'none';
    highBox.style.display = 'block';
    if (window._currentCard && window._currentCard.googleReviewUrl) {
      setTimeout(() => {
        window.location.href = window._currentCard.googleReviewUrl;
      }, 100);
    }
  } else {
    highBox.style.display = 'none';
    lowBox.style.display = 'block';
  }
}

function submitRatingFeedback(id) {
  const text = (document.getElementById('feedbackText').value || '').trim();
  const card = window._currentCard;
  const phone = card?.phone ? card.phone.replace(/[^0-9]/g, '') : '';
  const defaultPhone = phone || '6283834299229';
  const targetPhone = defaultPhone.startsWith('0') ? '62' + defaultPhone.slice(1) : defaultPhone;

  const msg = encodeURIComponent(`Halo, saya ingin menyampaikan masukan/keluhan terkait layanan (Kartu: ${id}, Rating: ${_selectedRating} bintang):\n\n"${text || 'Tidak ada catatan tambahan'}"`);
  const waUrl = `https://wa.me/${targetPhone}?text=${msg}`;

  window.location.href = waUrl;
}

function help() {
  return layout(`<main class="page"><div class="container"><div class="section-head"><h1 class="page-title">Bantuan RIC</h1><p>Jawaban singkat untuk pertanyaan yang paling umum.</p></div><div class="faq"><details open><summary>Apa itu kartu RIC?</summary><p>RIC adalah kartu fisik dengan NFC dan QR Code yang mengarahkan pelanggan ke halaman yang dikonfigurasi untuk bisnis Anda.</p></details><details><summary>Bagaimana cara menggunakan NFC?</summary><p>Aktifkan NFC jika diperlukan, lalu dekatkan smartphone ke kartu RIC. Browser akan membuka URL kartu.</p></details><details><summary>Bagaimana jika NFC tidak bekerja?</summary><p>Gunakan QR Code sebagai alternatif. Keduanya dapat menggunakan URL Card ID yang sama.</p></details><details><summary>Bagaimana cara mengganti link Google Review?</summary><p>Masuk ke Kelola Kartu, autentikasi dengan PIN, lalu ubah Google Review URL pada dashboard.</p></details><details><summary>Bagaimana jika kartu hilang?</summary><p>Hubungi Customer Service untuk bantuan pengelolaan atau penonaktifan kartu.</p></details></div><div class="panel" style="max-width:800px;margin:30px auto 0;text-align:center"><h3>Customer Service</h3><a href="mailto:anggariksa69@gmail.com" style="color:#1558d6;font-weight:800">anggariksa69@gmail.com</a></div></div></main>`);
}

function unlockDashboard(id) {
  const pin = document.getElementById('dashPin').value;
  getCard(id).then(c => {
    if (c && pin === c.pin) {
      sessionStorage.setItem('ric_auth_' + id, '1');
      location.reload();
      return;
    }
    document.getElementById('dashMsg').innerHTML = '<div class="error">PIN salah.</div>';
  });
}

function toggleMenu() {
  const m = document.getElementById('mobileMenu');
  if (!m) return;
  m.classList.toggle('open');
  document.body.style.overflow = m.classList.contains('open') ? 'hidden' : '';
}

async function route() {
  let p = location.pathname.replace(/\/+$/, '') || "/";
  if (p === "/") setApp(home());
  else if (p === "/kelola-kartu") setApp(manage());
  else if (p === "/bantuan") setApp(help());
  else if (p.startsWith("/aktivasi/")) await activate(decodeURIComponent(p.split("/")[2] || ""));
  else if (p.startsWith("/dashboard/")) await dashboard(decodeURIComponent(p.split("/")[2] || ""));
  else if (p.startsWith("/c/")) await cardPage(decodeURIComponent(p.split("/")[2] || ""));
  else setApp(home());
}

window.addEventListener('popstate', route);

document.addEventListener('click', e => {
  const a = e.target.closest('a');
  if (a && a.getAttribute('href') && a.getAttribute('href').startsWith('/') && !a.getAttribute('target')) {
    e.preventDefault();
    history.pushState(null, '', a.getAttribute('href'));
    route();
  }
});

// Initialize Routing
route();
