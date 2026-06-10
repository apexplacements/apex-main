const express = require('express');
const router = express.Router();
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Run the frontend static checker script and return output
router.get('/components-check', async (req, res) => {
  try {
    const script = path.join(__dirname, '..', '..', 'frontend', 'apex-app', 'scripts', 'checkDashboardConsistency.cjs');
    // Use Node executable
    const node = process.execPath;
    execFile(node, [script], { cwd: path.join(__dirname, '..', '..') , timeout: 30000 }, (error, stdout, stderr) => {
      const out = String(stdout || '');
      const err = String(stderr || '');
      const success = !error || (error && error.code === 0);
      res.json({ success: success, exitCode: error ? error.code : 0, stdout: out, stderr: err });
    });
  } catch (e) {
    console.error('components-check error', e && e.stack || e);
    res.status(500).json({ success: false, message: 'Failed to run components check', error: String(e) });
  }
});

module.exports = router;

// Helper: walk directory recursively
async function walk(dir, results = []) {
  const list = await readdir(dir);
  for (const file of list) {
    const filepath = path.join(dir, file);
    const s = await stat(filepath);
    if (s && s.isDirectory()) {
      results.push({ type: 'dir', path: filepath });
      await walk(filepath, results);
    } else {
      results.push({ type: 'file', path: filepath, size: s.size });
    }
  }
  return results;
}

// List top-level frontend folders under frontend/apex-app/src
router.get('/list-folders', async (req, res) => {
  try {
    const srcDir = path.join(__dirname, '..', '..', 'frontend', 'apex-app', 'src');
    const entries = await readdir(srcDir, { withFileTypes: true });
    const folders = entries
      .filter((e) => e.isDirectory())
      .map((d) => ({ name: d.name, path: path.join(srcDir, d.name) }));
    res.json({ success: true, data: folders });
  } catch (e) {
    console.error('list-folders error', e && e.stack || e);
    res.status(500).json({ success: false, message: 'Failed to list folders', error: String(e) });
  }
});

// List component files under frontend/apex-app/src (JSX/JS)
router.get('/list-components', async (req, res) => {
  try {
    const srcDir = path.join(__dirname, '..', '..', 'frontend', 'apex-app', 'src');
    const all = await walk(srcDir, []);
    const comps = all
      .filter((e) => e.type === 'file' && /\.(jsx?|tsx?)$/.test(e.path))
      .map((f) => ({ path: path.relative(path.join(__dirname, '..', '..', 'frontend', 'apex-app'), f.path), size: f.size }));
    res.json({ success: true, data: comps });
  } catch (e) {
    console.error('list-components error', e && e.stack || e);
    res.status(500).json({ success: false, message: 'Failed to list components', error: String(e) });
  }
});

// Return the content of a component file given a repo-relative path (safe)
router.get('/component-content', async (req, res) => {
  try {
    const rel = req.query.path;
    if (!rel) return res.status(400).json({ success: false, message: 'path query param required' });
    const base = path.join(__dirname, '..', '..', 'frontend', 'apex-app');
    const target = path.normalize(path.join(base, rel));
    if (!target.startsWith(base)) return res.status(400).json({ success: false, message: 'invalid path' });
    const content = await fs.promises.readFile(target, 'utf8');
    res.json({ success: true, data: { path: rel, content } });
  } catch (e) {
    console.error('component-content error', e && e.stack || e);
    res.status(500).json({ success: false, message: 'Failed to read file', error: String(e) });
  }
});
