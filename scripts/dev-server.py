#!/usr/bin/env python3
"""로컬 확인용 서버 — 캐시를 완전히 끈다. 실행: python3 scripts/dev-server.py [포트]"""
import sys, http.server, socketserver
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    def log_message(self, *a): pass

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('', PORT), NoCache) as httpd:
    print(f'http://localhost:{PORT}  (캐시 없음)')
    httpd.serve_forever()
