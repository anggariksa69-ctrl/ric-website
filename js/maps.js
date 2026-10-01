// Google Places API (New) & Automatic Review Link Converter
let _placeResults = [];

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

    searchPlaceViaAPI(queryStr, (result) => {
      if (result && result.place_id) {
        inputEl.value = 'https://search.google.com/local/writereview?placeid=' + result.place_id;
        if (msg) msg.innerHTML = '<div class="success">✨ Berhasil dikonversi untuk: <b>' + esc(result.name || 'Toko') + '</b></div>';
      } else if (msg) {
        msg.innerHTML = '<div class="error">Gagal mengonversi link. Pastikan toko terdaftar di Google Maps atau gunakan fitur pencarian di atas.</div>';
      }
    });
  }
}

async function searchPlaceViaAPI(query, callback) {
  try {
    // Google Places API (New) - searchText endpoint
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GMAPS_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress'
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 1,
        languageCode: 'id'
      })
    });

    if (!response.ok) {
      console.error('Places API error:', response.status);
      callback(null);
      return;
    }

    const data = await response.json();
    if (data.places && data.places.length > 0) {
      const place = data.places[0];
      callback({
        place_id: place.id,
        name: place.displayName?.text || 'Toko',
        formatted_address: place.formattedAddress || ''
      });
    } else {
      callback(null);
    }
  } catch (error) {
    console.error('Search error:', error);
    callback(null);
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

  searchPlacesListViaAPI(queryToSearch, (results) => {
    if (results && results.length > 0) {
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
    } else {
      r.innerHTML = '<div class="error">Toko tidak ditemukan. Coba ketik nama toko + kota/jalan (misal: "774 HUB Gayam Yogyakarta").</div>';
    }
  });
}

async function searchPlacesListViaAPI(query, callback) {
  try {
    // Google Places API (New) - searchText endpoint
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GMAPS_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress'
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 5,
        languageCode: 'id'
      })
    });

    if (!response.ok) {
      console.error('Places API error:', response.status, response.statusText);
      callback([]);
      return;
    }

    const data = await response.json();
    if (data.places && data.places.length > 0) {
      const results = data.places.map(place => ({
        place_id: place.id,
        name: place.displayName?.text || 'Toko',
        formatted_address: place.formattedAddress || ''
      }));
      callback(results);
    } else {
      callback([]);
    }
  } catch (error) {
    console.error('Search error:', error);
    callback([]);
  }
}

function selectPlace(i, resId, targetId) {
  const p = _placeResults[i];
  if (!p) return;
  const url = 'https://search.google.com/local/writereview?placeid=' + p.place_id;
  document.getElementById(targetId).value = url;
  document.getElementById(resId).innerHTML = '<div class="success">✨ Lokasi dipilih & dikonversi: <b>' + esc(p.name || 'Toko') + '</b></div>';
}
