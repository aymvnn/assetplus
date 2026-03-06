import urllib.request, json, ssl, re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

found = set()

endpoints = ['pages', 'posts', 'media']
for endpoint in endpoints:
    for page in range(1, 10):
        try:
            url = f'https://burgersgroup.com/wp-json/wp/v2/{endpoint}?per_page=100&page={page}'
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            resp = urllib.request.urlopen(req, context=ctx)
            data = json.loads(resp.read().decode('utf-8'))
            if not data:
                break
            
            for item in data:
                content = item.get('content', {}).get('rendered', '')
                title = item.get('title', {}).get('rendered', '')
                
                # Check rendered content for embeds / videos
                matches = re.findall(r'(https?://[^\s\"\'<>]+(?:\.mp4|\.webm|\.m3u8|vimeo\.com|youtube\.com|videos\.files\.wordpress\.com/)[^\s\"\'<>]*)', content)
                for m in matches:
                    found.add(f"[{endpoint}] {title} -> {m}")
                    
                # Also check ACF (Advanced Custom Fields)
                acf = str(item.get('acf', ''))
                matches_acf = re.findall(r'(https?://[^\s\"\'<>]+(?:\.mp4|\.webm|vimeo\.com|youtube\.com)[^\s\"\'<>]*)', acf)
                for m in matches_acf:
                    found.add(f"[{endpoint} ACF] {title} -> {m}")
        except Exception as e:
            # handle 400 bad request (end of pagination usually)
            pass

for f in sorted(list(found)):
    print(f)
