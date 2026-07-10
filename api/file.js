const fetch = require('node-fetch');

// Build GitHub request headers, adding auth if a token is present.
function ghHeaders() {
  const h = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'CodeView' };
  if (process.env.GITHUB_TOKEN) h['Authorization'] = 'Bearer ' + process.env.GITHUB_TOKEN;
  return h;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { owner, repo, branch, path } = req.query;
  if (!owner || !repo || !branch || !path) return res.status(400).json({ error: 'Missing params' });
  if (String(path).includes('..')) return res.status(400).json({ error: 'Invalid path' });
  try {
    const r = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`, { headers: ghHeaders() });
    if (!r.ok) return res.status(r.status).json({ error: 'File not found' });
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(await r.text());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
