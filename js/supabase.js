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
    businessName: r.business_name || '',
    ownerName: r.owner_name || '',
    phone: r.phone || '',
    address: r.address || '',
    googleReviewUrl: r.google_review_url || '',
    pin: r.pin || '',
    events: r.events || {}
  };
}

async function getCard(id) {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/cards?card_id=eq.${encodeURIComponent(id)}&select=*`, { headers: sbH() });
    if (!r.ok) return null;
    const d = await r.json();
    return sbRow(d[0] || null);
  } catch (e) {
    console.error('getCard error', e);
    return null;
  }
}

async function patchCard(id, u) {
  try {
    await fetch(`${SB_URL}/rest/v1/cards?card_id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: sbH(),
      body: JSON.stringify(u)
    });
  } catch (e) {
    console.error('patchCard error', e);
  }
}
