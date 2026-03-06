import urllib.request, re, ssl, os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://burgersgroup.com/', headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    jsons = re.findall(r'https?://[^\s\"\']+\.json', html)
    out_dir = r'c:\Users\AYM\OneDrive - GHAYM Group\[GHAYM] GHAYMGROUP\[GHAYM] Interfleet\Website Interfleet\burgersgroup_images\videos'
    for j in set(jsons):
        print('Found JSON URL:', j)
        fname = os.path.basename(j.split('?')[0])
        try:
            j_req = urllib.request.Request(j, headers={'User-Agent': 'Mozilla/5.0'})
            data = urllib.request.urlopen(j_req, context=ctx).read()
            out_path = os.path.join(out_dir, fname)
            with open(out_path, 'wb') as f:
                f.write(data)
            print('Downloaded:', fname)
        except Exception as e:
            print('Failed to download:', j, e)
            
except Exception as e:
    print('Error:', e)
