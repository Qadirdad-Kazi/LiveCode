export async function createGist(payload) {
  const res = await fetch('http://localhost:4000/gists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create gist');
  }

  return res.json();
}

export async function fetchGist(gistId) {
  const res = await fetch(`http://localhost:4000/gists/${gistId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch gist');
  }
  return res.json();
}
