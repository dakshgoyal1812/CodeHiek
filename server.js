const express = require('express');
const fetch = require('node-fetch');

const app = express();
const GITHUB_API = 'https://api.github.com';

// Build GitHub request headers, adding auth if a token is present.
function ghHeaders() {
  const h = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'CodeView' };
  if (process.env.GITHUB_TOKEN) h['Authorization'] = 'Bearer ' + process.env.GITHUB_TOKEN;
  return h;
}

// Parse any GitHub URL form (https, www, .git suffix, ssh) into { owner, repo }.
function parseRepoUrl(url) {
  if (!url) return null;
  let clean = String(url).trim().replace(/\.git$/, '');
  const ssh = clean.match(/^git@github\.com:([^/]+)\/(.+)$/);
  if (ssh) return { owner: ssh[1], repo: ssh[2] };
  clean = clean.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/^github\.com\//, '');
  const parts = clean.split('/').filter(Boolean);
  if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
  return null;
}

// Convert GitHub's flat recursive tree into a nested folders-first structure.
function buildNested(items) {
  const root = [];
  const map = {};
  items.forEach(it => {
    const parts = it.path.split('/');
    let curr = root, acc = '';
    parts.forEach((part, i) => {
      acc = acc ? acc + '/' + part : part;
      let node = map[acc];
      if (!node) {
        const isLeaf = i === parts.length - 1;
        node = { name: part, path: acc, type: isLeaf && it.type === 'blob' ? 'file' : 'dir', size: it.size || 0, children: [] };
        map[acc] = node;
        curr.push(node);
      }
      curr = node.children;
    });
  });
  const sort = nodes => {
    nodes.sort((a, b) => a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1);
    nodes.forEach(n => n.children && n.children.length && sort(n.children));
  };
  sort(root);
  return root;
}

app.get('/api/repo', async (req, res) => {
  const parsed = parseRepoUrl(req.query.url);
  if (!parsed) return res.status(400).json({ error: 'Invalid GitHub URL' });
  const { owner, repo } = parsed;
  try {
    const metaRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers: ghHeaders() });
    if (metaRes.status === 404) return res.status(404).json({ error: 'Repo not found' });
    if (metaRes.status === 403) return res.status(403).json({ error: 'Rate limited' });
    const meta = await metaRes.json();
    const branch = meta.default_branch || 'HEAD';
    const treeRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, { headers: ghHeaders() });
    if (treeRes.status === 404) return res.status(404).json({ error: 'Repo not found' });
    if (treeRes.status === 403) return res.status(403).json({ error: 'Rate limited' });
    const treeData = await treeRes.json();
    const tree = buildNested((treeData.tree || []).filter(t => t.path));
    res.json({
      repo: {
        owner, name: repo, full_name: meta.full_name, description: meta.description,
        stars: meta.stargazers_count, forks: meta.forks_count, language: meta.language,
        default_branch: branch, avatar: meta.owner && meta.owner.avatar_url, html_url: meta.html_url
      },
      tree
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/file', async (req, res) => {
  const { owner, repo, branch, path } = req.query;
  if (!owner || !repo || !branch || !path) return res.status(400).json({ error: 'Missing params' });
  if (String(path).includes('..')) return res.status(400).json({ error: 'Invalid path' });
  try {
    const r = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`, { headers: ghHeaders() });
    if (!r.ok) return res.status(r.status).json({ error: 'File not found' });
    res.type('text/plain').send(await r.text());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/readme', async (req, res) => {
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
});

app.use(express.static('public'));
app.listen(3000, () => console.log('CodeView running on http://localhost:3000'));