"""Dependency-free local preview with automatic reload."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import json, os
ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)
class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/__version':
            value = str(max((f.stat().st_mtime_ns for f in ROOT.rglob('*') if f.is_file() and '.git' not in f.parts), default=0))
            self.send_response(200); self.send_header('Content-Type','application/json'); self.send_header('Cache-Control','no-store'); self.end_headers(); self.wfile.write(json.dumps(value).encode())
        elif self.path.split('?')[0].endswith('.mp4'):
            from urllib.parse import unquote
            file = Path(self.translate_path(unquote(self.path.split('?')[0])))
            if not file.is_file():
                self.send_error(404); return
            size = file.stat().st_size
            start, end = 0, size - 1
            requested = self.headers.get('Range')
            if requested:
                import re
                match = re.fullmatch(r'bytes=(\d*)-(\d*)', requested)
                if not match:
                    self.send_error(416); return
                a, b = match.groups()
                if a: start = int(a); end = min(int(b), end) if b else end
                elif b: start = max(0, size - int(b))
                if start >= size or start > end:
                    self.send_response(416); self.send_header('Content-Range', f'bytes */{size}'); self.end_headers(); return
            self.send_response(206 if requested else 200)
            self.send_header('Content-Type', 'video/mp4')
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Length', str(end-start+1))
            if requested: self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
            self.end_headers()
            try:
                with file.open('rb') as stream:
                    stream.seek(start); remaining = end-start+1
                    while remaining:
                        chunk = stream.read(min(65536, remaining))
                        if not chunk: break
                        self.wfile.write(chunk); remaining -= len(chunk)
            except (BrokenPipeError, ConnectionResetError): pass
        else: super().do_GET()
    def log_message(self, fmt, *args):
        if '/__version' not in str(args): super().log_message(fmt,*args)
port = int(os.environ.get('PORT', '4173'))
print(f'GliDe preview: http://localhost:{port}', flush=True)
ThreadingHTTPServer(('127.0.0.1',port), Handler).serve_forever()
