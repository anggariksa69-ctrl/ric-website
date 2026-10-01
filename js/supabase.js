// Supabase API Operations for RIC Cards
const sbH = () => ({
  'apikey': SB_KEY,
  'Authorization': 'Bearer ' + SB_KEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
});

function sbRow(r) {
  if (!r) return null;
  return {
    cardId: r.card_id,
    status: r.status,
    phone: r.phone || '',
    googleReviewUrl: r.google_review_url || '',
    pin: r.pin || '',
    events: r.events || {},
    activated_at: r.activated_at || ''
  };
}

async function getCard(id) {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/cards?card_id=eq.${encodeURIComponent(id)}&select=*`, { 
      headers: sbH() 
    });
    
    if (!r.ok) {
      console.error('getCard - API error:', r.status, r.statusText);
      return null;
    }
    
    const d = await r.json();
    return sbRow(d[0] || null);
  } catch (e) {
    console.error('getCard error:', e);
    return null;
  }
}

async function patchCard(id, u) {
  try {
    // Konversi snake_case untuk Supabase
    const payload = {};
    for (const key in u) {
      if (key === 'googleReviewUrl') payload['google_review_url'] = u[key];
      else if (key === 'cardId') payload['card_id'] = u[key];
      else payload[key] = u[key];
    }

    const response = await fetch(`${SB_URL}/rest/v1/cards?card_id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: sbH(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('patchCard - HTTP error:', response.status, response.statusText);
      console.error('Error details:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json().catch(() => null);
    console.log('patchCard - Success:', result);
    return result;
  } catch (e) {
    console.error('patchCard error:', e.message);
    throw e;
  }
}

// Helper: Simpan ke localStorage sebagai backup
function saveCardToLocalStorage(id, cardData) {
  try {
    localStorage.setItem('ric_card_' + id, JSON.stringify(cardData));
  } catch (e) {
    console.warn('localStorage save warning:', e);
  }
}

// Helper: Ambil dari localStorage
function getCardFromLocalStorage(id) {
  try {
    const data = localStorage.getItem('ric_card_' + id);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('localStorage read warning:', e);
    return null;
  }
}
