import urllib.request, re, ssl, json
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://burgersgroup.com/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    jsons = re.findall(r'https?://[^\s\"\']+\.json', html)
    print("JSONs in HTML:", set(jsons))
    
    videos = re.findall(r'https?://[^\s\"\']+\.(?:mp4|webm|mov)', html)
    print("Videos in HTML:", set(videos))

    # Also search WordPress REST API specifically for json
    api_url = "https://burgersgroup.com/wp-json/wp/v2/media?per_page=100&media_type=file&mime_type=application/json"
    req_api = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        resp = urllib.request.urlopen(req_api, context=ctx)
        data = json.loads(resp.read().decode('utf-8'))
        for item in data:
            print("Found application/json via API:", item.get("source_url"))
    except Exception as e:
        print("API error:", e)
        
    # And search through inline data attributes
    data_attrs = re.findall(r'data-[a-zA-Z\-]+=["\']([^"\']+\.(?:mp4|webm|json|mov|lottie))["\']', html)
    print("Media in data attributes:", set(data_attrs))
except Exception as e:
    print("Error:", e)
