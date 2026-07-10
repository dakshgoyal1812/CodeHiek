const fetch = require('node-fetch');

const GITHUB_API = 'https://api.github.com';

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

  const { owner, repo } = req.query;
  if (!owner || !repo) return res.status(400).json({ error: 'Missing params' });
  try {
    const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`, { headers: ghHeaders() });
    if (!r.ok) return res.status(r.status).json({ error: 'README not found' });
    const data = await r.json();
    const markedContent = Buffer.from(data.content || '', 'base64').toString('utf-8');
    res.json({ html: markedContent });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
