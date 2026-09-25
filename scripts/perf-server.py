#!/usr/bin/env python3
"""성능 측정용 로컬 서버 — GitHub Pages 와 비슷하게 gzip + keep-alive 로 낸다 (dev-server.py 는 압축이 없어 CSS·JS 비용을 5배 과장한다). 사용: python3 scripts/perf-server.py 8082 . 그다음 npx -y lighthouse@12 http://localhost:8082/ --only-categories=performance --form-factor=mobile --screenEmulation.mobile --throttling-method=devtools --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh.json (3회 중앙값으로 비교)"""
import sys, gzip, http.server, socketserver, os, mimetypes
PORT, ROOT = int(sys.argv[1]), sys.argv[2]
TEXT = ('text/', 'application/javascript', 'application/json', 'image/svg+xml', 'application/xml')
class H(http.server.SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(self, *a): pass
    def do_GET(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path): path = os.path.join(path, 'index.html')
        if not os.path.isfile(path): self.send_error(404); return
        ctype = mimetypes.guess_type(path)[0] or 'application/octet-stream'
        if path.endswith('.css'): ctype = 'text/css'
        if path.endswith('.js'): ctype = 'application/javascript'
        data = open(path, 'rb').read()
        gz = ctype.startswith(TEXT) and 'gzip' in self.headers.get('Accept-Encoding', '')
        if gz: data = gzip.compress(data, 6)
        self.send_response(200)
        self.send_header('Content-Type', ctype + ('; charset=utf-8' if ctype.startswith('text/') or 'javascript' in ctype or 'json' in ctype else ''))
        if gz: self.send_header('Content-Encoding', 'gzip')
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers(); self.wfile.write(data)
class S(socketserver.ThreadingTCPServer): allow_reuse_address = True
with S(('', PORT), H) as httpd: httpd.serve_forever()
