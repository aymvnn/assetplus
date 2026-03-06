import urllib.request
import urllib.error
import json
import os
import ssl

# Ignore SSL errors
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

out_dir = r"c:\Users\AYM\OneDrive - GHAYM Group\[GHAYM] GHAYMGROUP\[GHAYM] Interfleet\Website Interfleet\burgersgroup_images\videos"
os.makedirs(out_dir, exist_ok=True)

VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/mpeg']
VIDEO_EXTENSIONS = ('.mp4', '.webm', '.ogg', '.mov', '.avi', '.mpeg', '.mpg')

all_video_urls = set()

# Step 1: Query the WordPress REST API — ONLY video mime types, no general media query
for mime in VIDEO_MIME_TYPES:
    page = 1
    while True:
        api_url = f"https://burgersgroup.com/wp-json/wp/v2/media?mime_type={mime}&per_page=100&page={page}"
        print(f"Querying: {api_url}")
        try:
            req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
            resp = urllib.request.urlopen(req, context=ctx, timeout=15)
            data = json.loads(resp.read().decode('utf-8'))
            if not data:
                print(f"  No results for {mime} on page {page}")
                break
            for item in data:
                src = item.get('source_url', '')
                if src:
                    all_video_urls.add(src)
                    print(f"  Found: {src}")
                # Also check for Jetpack VideoPress hosted videos in the rendered description
                desc = item.get('description', {}).get('rendered', '')
                import re
                extra = re.findall(r'https://videos\.files\.wordpress\.com/[^\s"<]+\.mp4', desc)
                for e in extra:
                    all_video_urls.add(e)
                    print(f"  Found (Jetpack): {e}")
            page += 1
        except urllib.error.HTTPError as e:
            if e.code == 400:
                print(f"  No more pages for {mime}")
            else:
                print(f"  HTTP {e.code} for {mime} p{page}")
            break
        except Exception as e:
            print(f"  Error: {e}")
            break

print(f"\nTotal unique video URLs: {len(all_video_urls)}")
for v in sorted(all_video_urls):
    print(f"  {v}")

# Step 2: Download ONLY the videos
print("\n=== Downloading videos ===")
downloaded = 0
skipped = 0
for video_url in sorted(all_video_urls):
    filename = os.path.basename(video_url.split('?')[0])
    if not filename.lower().endswith(VIDEO_EXTENSIONS):
        print(f"  Skipping (not a video extension): {filename}")
        continue
    out_path = os.path.join(out_dir, filename)
    if os.path.exists(out_path):
        print(f"  Already exists, skipping: {filename}")
        skipped += 1
        continue
    print(f"Downloading: {filename} ...")
    try:
        req = urllib.request.Request(video_url, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, context=ctx, timeout=120).read()
        with open(out_path, 'wb') as f:
            f.write(data)
        size_mb = len(data) / 1024 / 1024
        print(f"  Saved: {filename} ({size_mb:.1f} MB)")
        downloaded += 1
    except Exception as e:
        print(f"  Failed: {e}")

print(f"\nDone! Downloaded {downloaded} video(s), skipped {skipped} (already existed).")
