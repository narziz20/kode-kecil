"""Rebuild the standalone page and offline ZIP from the dist sources."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
dist = root / 'dist'
html = (dist / 'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + (dist / 'style.css').read_text() + '</style>')
for name in ('engine.js', 'lessons.js', 'journey.js', 'interactions.js', 'playful.js', 'voice.js', 'world-themes.js', 'motion.js', 'app.js'):
    html = html.replace(f'<script src="{name}"></script>', '<script>' + (dist / name).read_text().replace('</script', '<\\/script') + '</script>')
(dist / 'kode-kecil-1000.html').write_text(html)
with ZipFile(root / 'kode-kecil-offline.zip', 'w', ZIP_DEFLATED) as bundle:
    for path in sorted(dist.rglob('*')):
        if path.is_file():
            bundle.write(path, path.relative_to(dist))
print('Built standalone HTML and offline ZIP.')
