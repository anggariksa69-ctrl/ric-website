// Google Maps & Places API Helper & Automatic Review Link Converter
let _placeResults = [];
let _gmapsReady = false;

function loadGmaps(cb) {
  if (window.google && google.maps && google.maps.places) {
    _gmapsReady = true;
    cb();
    return;
  }
  if (window._ricGmpInit) {
    window._ricGmpInit = () => {
      _gmapsReady = true;
      if (cb) cb();
    };
    return;
  }
  window._gmapsCbQ = window._gmapsCbQ || [];
  window._gmapsCbQ.push(cb);
  window._ricGmpInit = () => {
    _gmapsReady = true;
    const queue = window._gmapsCbQ || [];
    window._gmapsCbQ = [];
    queue.forEach(fn => fn && fn());
  };
  if (!document.querySelector('script[data-ric-gmaps="true"]')) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&libraries=places&callback=_ricGmpInit`;
    script.async = true;
    script.defer = true;
    script.dataset.ricGmaps = 'true';
    document.head.appendChild(script);
  }
}

function handleReviewPaste(inputEl, msgId) {
  const val = (inputEl.value || '').trim();
  if (!val) return;

  if (val.includes('search.google.com/local/writereview')) return;

  const chijMatch = val.match(/(ChIJ[a-zA-Z0-9_-]{23})/i);
  if (chijMatch) {
    inputEl.value = 'https://search.google.com/local/writereview?placeid=' + chijMatch[1];
    const msg = document.getElementById(msgId);
    if (msg) msg.innerHTML = '<div class="success">✨ Link otomatis dikonversi ke Google Review!</div>';
    return;
  }

  if (val.includes('http://') || val.includes('https://') || val.includes('maps') || val.includes('goo.gl')) {
    const msg = document.getElementById(msgId);
    if (msg) msg.innerHTML = '<p class="muted" style="font-size:12px;padding:6px 0">⏳ Mengonversi link Google Maps...</p>';

    let queryStr = val;
    if (val.includes('/maps/place/')) {
      try {
        const parts = val.split('/maps/place/');
        if (parts[1]) queryStr = decodeURIComponent(parts[1].split('/')[0].replace(/\+/g, ' '));
      } catch (e) {}
    }

    loadGmaps(() => {
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      service.findPlaceFromQuery({ query: queryStr, fields: ['place_id', 'name'] }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
          inputEl.value = 'https://search.google.com/local/writereview?placeid=' + results[0].place_id;
          if (msg) msg.innerHTML = '<div class="success">✨ Berhasil dikonversi untuk: <b>' + esc(results[0].name) + '</b></div>';
        } else {
          service.textSearch({ query: queryStr, fields: ['place_id', 'name'] }, (results2, status2) => {
            if (status2 === google.maps.places.PlacesServiceStatus.OK && results2 && results2[0]) {
              inputEl.value = 'https://search.google.com/local/writereview?placeid=' + results2[0].place_id;
              if (msg) msg.innerHTML = '<div class="success">✨ Berhasil dikonversi untuk: <b>' + esc(results2[0].name) + '</b></div>';
            } else if (msg) {
              msg.innerHTML = '<div class="error">Gagal mengonversi link. Pastikan toko terdaftar di Google Maps atau gunakan fitur pencarian di atas.</div>';
            }
          });
        }
      });
    });
  }
}

function searchPlace(inId, resId, targetId) {
  const q = document.getElementById(inId).value.trim();
  const r = document.getElementById(resId);
  if (!q) {
    r.innerHTML = '<div class="error">Masukkan nama toko atau tempel link Google Maps (misal: https://maps.app.goo.gl/...).</div>';
    return;
  }

  const chijMatch = q.match(/(ChIJ[a-zA-Z0-9_-]{23})/i);
  if (chijMatch) {
    const placeId = chijMatch[1];
    const writeUrl = 'https://search.google.com/local/writereview?placeid=' + placeId;
    document.getElementById(targetId).value = writeUrl;
    r.innerHTML = '<div class="success">✨ Link berhasil dikonversi dari Place ID: <b>' + esc(placeId) + '</b></div>';
    return;
  }

  r.innerHTML = '<p class="muted" style="padding:10px 0;font-size:13px">⏳ Mencari toko & mengonversi link...</p>';

  let queryToSearch = q;
  if (q.includes('/maps/place/')) {
    try {
      const parts = q.split('/maps/place/');
      if (parts[1]) queryToSearch = decodeURIComponent(parts[1].split('/')[0].replace(/\+/g, ' '));
    } catch (e) {}
  }

  loadGmaps(() => {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    const reqObj = { query: queryToSearch, fields: ['place_id', 'name', 'formatted_address'] };

    service.findPlaceFromQuery(reqObj, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length) {
        _placeResults = results.slice(0, 5);
        selectPlace(0, resId, targetId);
        if (results.length > 1) {
          r.innerHTML += _placeResults.map((p, i) => `
            <div class="place-item" onclick="selectPlace(${i}, '${resId}', '${targetId}')">
              <b>${esc(p.name || 'Nama toko')}</b>
              <small>${esc(p.formatted_address || 'Alamat tidak tersedia')}</small>
            </div>
          `).join('');
        }
        return;
      }

      service.textSearch(reqObj, (results2, status2) => {
        if (status2 === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
          r.innerHTML = '<div class="error">Google Places API tidak bisa dipanggil. Pastikan API key aktif, Maps JavaScript API + Places API sudah di-enable di Google Cloud Console.</div>';
          return;
        }
        if (status2 !== google.maps.places.PlacesServiceStatus.OK || !results2 || !results2.length) {
          r.innerHTML = '<div class="error">Toko tidak ditemukan. Coba ketik nama toko + kota/jalan (misal: "774 HUB Gayam Yogyakarta").</div>';
          return;
        }
        _placeResults = results2.slice(0, 5);
        selectPlace(0, resId, targetId);
        if (_placeResults.length > 1) {
          r.innerHTML += _placeResults.map((p, i) => `
            <div class="place-item" onclick="selectPlace(${i}, '${resId}', '${targetId}')">
              <b>${esc(p.name || 'Nama toko')}</b>
              <small>${esc(p.formatted_address || 'Alamat tidak tersedia')}</small>
            </div>
          `).join('');
        }
      });
    });
  });
}

function selectPlace(i, resId, targetId) {
  const p = _placeResults[i];
  if (!p) return;
  const url = 'https://search.google.com/local/writereview?placeid=' + p.place_id;
  document.getElementById(targetId).value = url;
  document.getElementById(resId).innerHTML = '<div class="success">✨ Lokasi dipilih & dikonversi: <b>' + esc(p.name || 'Toko') + '</b></div>';
}
