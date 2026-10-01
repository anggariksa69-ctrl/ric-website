// RIC Main Application Views & Routing Logic

function setApp(h) {
  document.getElementById('app').innerHTML = h;
}

function showLoading() {
  setApp(layout('<main class="page"><div class="container" style="min-height:55vh;display:grid;place-items:center;text-align:center"><p style="color:var(--muted);font-size:18px">⏳ Memuat halaman...</p></div></main>'));
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[m]));
}

function layout(content) {
  return `<header><div class="container nav">
  <a class="brand" href="/"><span class="logo">RIC</span> RIC</a>
  <nav class="navlinks"><a href="/">Beranda</a><a href="/kelola-kartu">Kelola Kartu</a><a href="/bantuan">Bantuan</a></nav>
  <div class="nav-actions"><a class="btn btn-secondary" href="/kelola-kartu">Kelola Kartu</a><a class="btn btn-primary" href="https://wa.me/6283834299229?text=Halo%2C%20saya%20ingin%20pesan%20kartu%20RIC%20Google%20Review">Pesan Kartu</a></div>
  <button class="hamburger" aria-label="Buka menu" onclick="toggleMenu()"><span></span><span></span><span></span></button>
  </div></header>
  <div class="mobile-menu" id="mobileMenu" onclick="if(event.target===this)toggleMenu()"><div class="mobile-panel"><button class="mobile-close" onclick="toggleMenu()">✕</button><a href="/">Beranda</a><a href="/kelola-kartu">Kelola Kartu</a><a href="/bantuan">Bantuan</a><a class="btn btn-primary" href="https://wa.me/6283834299229?text=Halo%2C%20saya%20ingin%20pesan%20kartu%20RIC%20Google%20Review">Pesan Kartu</a></div></div>
  ${content}`;
}

function home() {
  return layout(`
  <main>
  <section class="hero"><div class="container hero-grid">
  <div><span class="eyebrow">● NFC Google Review</span><h1>Review bisnis Anda, sekarang semudah <span style="color:#1558d6">tap.</span></h1><p>RIC membantu bisnis mendapatkan Google Review dengan kartu NFC yang praktis. Cukup dekatkan smartphone ke kartu, pelanggan langsung diarahkan ke halaman review bisnis Anda.</p><div class="actions"><a class="btn btn-primary" href="/kelola-kartu">Kelola kartu</a></div><div class="trust"><span>✔️ NFC</span><span>✔️ Google Review</span></div></div>
  <div class="product-wrap"><div class="product-card"><img src="/assets/ric-card-reference.png" alt="Kartu RIC NFC Google Review"></div><div class="float-badge">📱 Tap → Review Google</div></div>
  </div></section>
  <section id="produk"><div class="container"><div class="section-head"><h2>Dibuat untuk bisnis lokal.</h2><p>Letakkan kartu di titik yang paling sering dilewati pelanggan.</p></div><div class="features"><div class="feature"><span class="feature-icon">📍</span><div><h3>Mudah ditempatkan</h3><p>Di counter, meja, resepsionis, atau kasir.</p></div></div><div class="feature"><span class="feature-icon">⚡</span><div><h3>Instan aktivasi</h3><p>Langsung gunakan kartu tanpa setup rumit.</p></div></div><div class="feature"><span class="feature-icon">🔄</span><div><h3>Update kapan saja</h3><p>Ubah link Google Review tanpa ganti kartu.</p></div></div></div></div></section>
  <section><div class="container"><div class="section-head"><h2>Cocok untuk berbagai bisnis</h2><p>Satu konsep yang mudah ditempatkan di counter, meja, resepsionis, atau kasir.</p></div><div class="business-types"><span class="business-badge">☕ Kopi</span><span class="business-badge">🍔 Makanan</span><span class="business-badge">🏥 Layanan</span><span class="business-badge">🏪 Toko</span><span class="business-badge">✂️ Salon</span><span class="business-badge">🏨 Akomodasi</span></div></div></section>
  <section><div class="container"><div class="cta"><div><h2>Mulai kelola kartu RIC.</h2><p>Aktifkan kartu, atur link Google Review, dan kelola konfigurasi bisnis Anda.</p></div><a class="btn" style="align-self:flex-start" href="/kelola-kartu">Kelola Kartu Saya</a></div></div></section>
  </main>`);
}

function manage() {
  return layout(`<main class="page"><div class="container"><div class="center"><h1 class="page-title">Kelola Kartu RIC</h1><p class="page-sub">Masukkan Card ID dari kartu Anda untuk mengakses aktivasi atau dashboard.</p><div class="panel"><div class="field"><label>Card ID</label><input id="cardInput" placeholder="Contoh: RIC-000001" maxlength="20"></div><button class="btn btn-primary" style="width:100%" onclick="openCard()">Buka Kartu</button><div id="manageMsg"></div></div></div></div></main>`);
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
  setApp(layout(`<main class="page"><div class="container center"><h1 class="page-title">Aktivasi Kartu</h1><p class="page-sub">Aktifkan <b>${esc(id)}</b> dan hubungkan dengan Google Review bisnis Anda.</p><div class="panel"><div class="field"><label>🔍 Cari Toko atau Tempel Link Google Maps <span style="font-weight:400;color:var(--muted)">(Ketik nama toko ATAU paste link maps.app.goo.gl / Google Maps)</span></label><div class="search-row"><input id="placeSearch" placeholder="Contoh: Jagongan Bandung ATAU https://maps.app.goo.gl/..."><button class="btn btn-secondary" onclick="searchPlace('placeSearch','placeResults','review')">Cari / Konversi</button></div><div id="placeResults" class="place-results"></div></div><div class="field"><label>URL Google Review</label><input id="review" placeholder="Akan terisi otomatis atau paste link Google Maps di sini" oninput="handleReviewPaste(this, 'actMsg')"></div><div class="field"><label>Nomor WhatsApp</label><input id="phone" type="tel" placeholder="+62..." inputmode="tel"></div><div class="field"><label>PIN (minimal 4 digit)</label><input id="pin" type="password" inputmode="numeric" maxlength="12"></div><div class="field"><label>Konfirmasi PIN</label><input id="pin2" type="password" inputmode="numeric" maxlength="12"></div><button class="btn btn-primary" style="width:100%" onclick="doActivate('${esc(id)}')">Aktifkan Kartu</button><div id="actMsg"></div></div></div></main>`));
}

async function doActivate(id) {
  const review = document.getElementById("review").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const pin = document.getElementById("pin").value;
  const pin2 = document.getElementById("pin2").value;
  const msg = document.getElementById("actMsg");

  // Validasi input
  if (!review || pin.length < 4 || pin !== pin2) {
    msg.innerHTML = '<div class="error">Pastikan URL review terisi, PIN minimal 4 digit dan konfirmasi cocok.</div>';
    return;
  }

  // Validasi URL
  try {
    new URL(review);
  } catch (e) {
    msg.innerHTML = '<div class="error">Google Review URL tidak valid.</div>';
    return;
  }

  // Tampilkan pesan loading
  msg.innerHTML = '<p class="muted" style="padding:10px 0;font-size:13px">⏳ Menyimpan data dan mengaktifkan kartu...</p>';

  try {
    // Simpan semua data ke Supabase
    await patchCard(id, {
      status: "active",
      google_review_url: review,
      phone: phone || null,
      pin: pin,
      activated_at: new Date().toISOString(),
      events: {}
    });

    // Verifikasi data tersimpan
    const savedCard = await getCard(id);
    if (!savedCard || savedCard.status !== "active") {
      msg.innerHTML = '<div class="error">Gagal menyimpan data. Silakan coba lagi.</div>';
      return;
    }

    // Tampilkan pesan sukses
    msg.innerHTML = '<div class="success">✓ Kartu berhasil diaktifkan dan data tersimpan. Mengarahkan ke dashboard...</div>';

    // Set session authentication
    sessionStorage.setItem("ric_auth_" + id, "1");

    // Redirect ke dashboard setelah 1.5 detik
    setTimeout(() => {
      history.pushState(null, '', '/dashboard/' + encodeURIComponent(id));
      route();
    }, 1500);

  } catch (error) {
    console.error('Activation error:', error);
    msg.innerHTML = '<div class="error">Error: Gagal menyimpan data. Pastikan koneksi internet stabil dan coba lagi.</div>';
  }
}

async function dashboard(id) {
  showLoading(); const card = await getCard(id);
  if (!card) { setApp(layout(`<main class="page"><div class="container center"><div class="error">Kartu tidak ditemukan.</div></div></main>`)); return; }
  if (sessionStorage.getItem("ric_auth_" + id) !== "1") { setApp(layout(`<main class="page"><div class="container center"><div class="panel"><h2>Akses dilindungi PIN</h2><p class="muted">Masukkan PIN untuk mengakses dashboard.</p><input id="dashPin" type="password" inputmode="numeric" placeholder="PIN"><button class="btn btn-primary" style="width:100%" onclick="unlockDashboard('${esc(id)}')">Buka</button><div id="dashMsg"></div></div></div></main>`)); return; }
  const url = location.origin + "/c/" + encodeURIComponent(id);
  setApp(layout(`<main class="page"><div class="container"><div><h1 class="page-title">Dashboard Kartu ${esc(id)}</h1><div class="panel"><h3>Informasi Kartu</h3><div class="info-grid"><div><label>Card ID</label><p>${esc(id)}</p></div><div><label>Status</label><p><span class="badge ${card.status === 'active' ? 'badge-success' : 'badge-warning'}">${card.status === 'active' ? '✓ Aktif' : '⚠ Tidak Aktif'}</span></p></div><div><label>URL Akses Kartu</label><p><input type="text" value="${esc(url)}" readonly style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;font-size:12px"></p><small style="color:var(--muted)">Bagikan URL ini atau scan NFC kartu untuk direct ke Google Review</small></div></div></div><div class="panel"><h3>Google Review & Kontak</h3><div class="field"><label>🔍 Cari Toko atau Tempel Link Google Maps <span style="font-weight:400;color:var(--muted)">(Untuk mengubah link review)</span></label><div class="search-row"><input id="dPlaceSearch" placeholder="Contoh: Jagongan Bandung ATAU https://maps.app.goo.gl/..."><button class="btn btn-secondary" onclick="searchPlace('dPlaceSearch','dPlaceResults','dReview')">Cari / Konversi</button></div><div id="dPlaceResults" class="place-results"></div></div><div class="field"><label>URL Google Review</label><input id="dReview" value="${esc(card.googleReviewUrl || '')}" placeholder="https://..." oninput="handleReviewPaste(this, 'businessMsg')"></div><div class="field"><label>Nomor WhatsApp</label><input id="dPhone" type="tel" value="${esc(card.phone || '')}" placeholder="+62..."></div><button class="btn btn-secondary" onclick="saveBusiness('${esc(id)}')">Simpan</button><div id="businessMsg"></div></div><div class="panel"><h3>Keamanan</h3><div class="field"><label>PIN Lama</label><input id="oldPin" type="password" inputmode="numeric" placeholder="Masukkan PIN sekarang"></div><div class="field"><label>PIN Baru</label><input id="newPin" type="password" inputmode="numeric" placeholder="PIN minimal 4 digit"></div><div class="field"><label>Konfirmasi PIN Baru</label><input id="newPin2" type="password" inputmode="numeric" placeholder="Ulangi PIN baru"></div><button class="btn btn-secondary" onclick="changePin('${esc(id)}')">Ubah PIN</button><div id="secMsg"></div></div><div class="panel danger"><h3 style="color:var(--danger)">Reset Kartu</h3><p style="font-size:13px;margin-bottom:12px">Ini akan mengembalikan kartu ke status tidak aktif. Gunakan jika Anda ingin mengaktifkan ulang dengan konfigurasi berbeda.</p><button class="btn btn-outline" style="border-color:var(--danger);color:var(--danger)" onclick="resetCard('${esc(id)}')">Reset Kartu</button></div></div></div></main>`));
}

async function saveBusiness(id) {
  const review = document.getElementById("dReview").value.trim();
  const phone = document.getElementById("dPhone").value.trim();
  const msg = document.getElementById("businessMsg");

  if (!review) {
    msg.innerHTML = '<div class="error">URL Google Review tidak boleh kosong.</div>';
    return;
  }

  try {
    new URL(review);
  } catch (e) {
    msg.innerHTML = '<div class="error">URL Google Review tidak valid.</div>';
    return;
  }

  msg.innerHTML = '<p class="muted" style="padding:10px 0;font-size:13px">⏳ Menyimpan data...</p>';

  try {
    await patchCard(id, {
      google_review_url: review,
      phone: phone || null
    });

    // Verifikasi data tersimpan
    const updatedCard = await getCard(id);
    if (!updatedCard || updatedCard.googleReviewUrl !== review) {
      msg.innerHTML = '<div class="error">Gagal menyimpan data. Silakan coba lagi.</div>';
      return;
    }

    msg.innerHTML = '<div class="success">✓ Informasi berhasil tersimpan.</div>';
  } catch (error) {
    console.error('Save error:', error);
    msg.innerHTML = '<div class="error">Error: Gagal menyimpan data. Coba lagi.</div>';
  }
}

async function changePin(id) {
  const old = document.getElementById("oldPin").value;
  const n = document.getElementById("newPin").value;
  const n2 = document.getElementById("newPin2").value;
  const m = document.getElementById("secMsg");

  const card = await getCard(id);
  if (!card || old !== card.pin || n.length < 4 || n !== n2) {
    m.innerHTML = '<div class="error">PIN lama salah atau PIN baru tidak valid (min. 4 digit & konfirmasi cocok).</div>';
    return;
  }

  m.innerHTML = '<p class="muted" style="padding:10px 0;font-size:13px">⏳ Mengubah PIN...</p>';

  try {
    await patchCard(id, { pin: n });
    m.innerHTML = '<div class="success">✓ PIN berhasil diubah.</div>';
    document.getElementById("oldPin").value = '';
    document.getElementById("newPin").value = '';
    document.getElementById("newPin2").value = '';
  } catch (error) {
    console.error('PIN change error:', error);
    m.innerHTML = '<div class="error">Error: Gagal mengubah PIN. Coba lagi.</div>';
  }
}

async function resetCard(id) {
  if (!confirm("Yakin ingin mereset kartu ini? Data akan dihapus dan kartu kembali ke status tidak aktif.")) return;

  try {
    await patchCard(id, {
      status: "inactive",
      google_review_url: "",
      phone: null,
      pin: ""
    });

    sessionStorage.removeItem("ric_auth_" + id);
    history.pushState(null, '', '/kelola-kartu');
    route();
  } catch (error) {
    console.error('Reset error:', error);
    alert('Gagal mereset kartu. Silakan coba lagi.');
  }
}

async function cardPage(id) {
  showLoading(); const card = await getCard(id);
  if (!card) { setApp(layout(`<main class="page"><div class="container review-box"><h1>Kartu tidak ditemukan</h1><p class="muted">Periksa kembali NFC kartu RIC Anda.</p><a class="btn btn-primary" href="/kelola-kartu">Kelola Kartu</a></div></main>`)); return; }
  if (card.status === "inactive") { await activate(id); return; }
  await patchCard(id, { events: { ...(card.events || {}), review_redirect: (card.events?.review_redirect || 0) + 1 } });
  if (card.googleReviewUrl) setTimeout(() => { location.href = card.googleReviewUrl }, 250);
  setApp(layout(`<main class="page"><div class="container review-box"><div class="stars">★★★★★</div><h1>Menghubungkan Anda ke Google Review...</h1><p class="muted">Mohon tunggu sebentar, kami sedang membuka halaman review untuk Anda.</p></div></main>`));
}

function help() {
  return layout(`<main class="page"><div class="container"><div class="section-head"><h1 class="page-title">Bantuan RIC</h1><p>Jawaban singkat untuk pertanyaan yang paling umum.</p></div><div class="faqs"><div class="faq"><h3>Apa itu RIC?</h3><p>RIC adalah kartu NFC (Near Field Communication) yang memudahkan pelanggan untuk memberikan Google Review ke bisnis Anda. Cukup dekatkan smartphone ke kartu, dan pelanggan akan langsung diarahkan ke halaman review Google bisnis Anda.</p></div><div class="faq"><h3>Bagaimana cara mengaktifkan kartu RIC?</h3><p>1. Klik "Kelola Kartu" dan masukkan Card ID Anda. 2. Jika kartu belum aktif, ikuti proses aktivasi. 3. Input URL Google Review bisnis Anda. 4. Atur PIN untuk keamanan. 5. Kartu siap digunakan.</p></div><div class="faq"><h3>Bagaimana jika saya lupa PIN?</h3><p>Hubungi customer service kami di WhatsApp untuk bantuan reset PIN. Kami akan memverifikasi identitas Anda sebelum reset.</p></div><div class="faq"><h3>Bisakah saya mengubah URL Google Review?</h3><p>Ya, sangat mudah. Masuk ke dashboard kartu Anda dan update URL Google Review kapan saja tanpa perlu mengganti kartu.</p></div><div class="faq"><h3>Berapa lama kartu RIC bertahan?</h3><p>Kartu RIC dirancang untuk bertahan lama. Chip NFC tertanam dalam kartu berkualitas tinggi dan tahan air.</p></div><div class="faq"><h3>Dukungan pelanggan?</h3><p>Hubungi kami via WhatsApp di <a href="https://wa.me/6283834299229">+62 838 3429 9229</a> atau email ke anggariksa69@gmail.com</p></div></div></div></main>`);
}

function unlockDashboard(id) {
  const pin = document.getElementById('dashPin').value;
  getCard(id).then(c => {
    if (pin === c.pin) {
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
