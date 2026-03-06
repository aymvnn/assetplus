import urllib.request
import urllib.error
import re
import os
import ssl
from urllib.parse import urljoin, urlparse

# Ignore SSL errors
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://burgersgroup.com/'
out_dir = r"c:\Users\AYM\OneDrive - GHAYM Group\[GHAYM] GHAYMGROUP\[GHAYM] Interfleet\Website Interfleet\burgersgroup_images"
os.makedirs(out_dir, exist_ok=True)

try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req, context=ctx)
    html = response.read().decode('utf-8')
except Exception as e:
    print(f"Error fetching {url}: {e}")
    exit(1)

# Find images via regex
img_regex = r'<img[^>]+src=["\'](.*?)["\']'
images = re.findall(img_regex, html, re.IGNORECASE)

srcset_regex = r'<img[^>]+srcset=["\'](.*?)["\']'
srcsets = re.findall(srcset_regex, html, re.IGNORECASE)
for srcset in srcsets:
    parts = srcset.split(',')
    for part in parts:
        src = part.strip().split(' ')[0]
        if src:
            images.append(src)

bg_regex = r'background-image:\s*url\([\'"]?(.*?)[\'"]?\)'
bgs = re.findall(bg_regex, html, re.IGNORECASE)
images.extend(bgs)

vid_regex = r'<video[^>]+src=["\'](.*?)["\']'
vids = re.findall(vid_regex, html, re.IGNORECASE)
images.extend(vids)

source_regex = r'<source[^>]+src=["\'](.*?)["\']'
sources = re.findall(source_regex, html, re.IGNORECASE)
images.extend(sources)

link_regex = r'<a[^>]+href=["\'](.*?)["\']'
links = re.findall(link_regex, html, re.IGNORECASE)
images.extend(links)

# Unique
images = list(set(images))

downloaded = 0
for img_url in images:
    if img_url.startswith('data:'):
        continue
    
    full_url = urljoin(url, img_url)
    parsed = urlparse(full_url)
    if not parsed.netloc:
        continue
        
    filename = os.path.basename(parsed.path)
    if not filename:
        filename = "image_" + str(downloaded) + ".jpg"
        
    # Clean filename
    filename = re.sub(r'[\\/*?:"<>|]', "", filename)
    if not any(filename.lower().endswith(ext) for ext in ['.mp4', '.webm', '.ogg', '.mov']):
        continue
        
    is_video = any(filename.lower().endswith(ext) for ext in ['.mp4', '.webm', '.ogg', '.mov'])
    target_dir = os.path.join(out_dir, 'videos') if is_video else out_dir
    os.makedirs(target_dir, exist_ok=True)
    
    out_path = os.path.join(target_dir, filename)
    
    # Handle duplicates
    base, ext = os.path.splitext(filename)
    counter = 1
    while os.path.exists(out_path):
        out_path = os.path.join(target_dir, f"{base}_{counter}{ext}")
        counter += 1
        
    try:
        req = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
        img_data = urllib.request.urlopen(req, context=ctx).read()
        with open(out_path, 'wb') as f:
            f.write(img_data)
        print(f"Downloaded: {filename}")
        downloaded += 1
    except urllib.error.URLError as e:
        print(f"Failed to download {full_url}: {e}")
    except Exception as e:
        print(f"Error for {full_url}: {e}")

print(f"Total downloaded frontpage images: {downloaded}")

# Try to find other internal links to scrape more images
link_regex = r'<a[^>]+href=["\'](.*?)["\']'
links = re.findall(link_regex, html, re.IGNORECASE)

domain = urlparse(url).netloc
visited = {url}

for link in set(links):
    full_link = urljoin(url, link).split('#')[0]
    parsed_link = urlparse(full_link)
    
    if parsed_link.netloc == domain and full_link not in visited:
        visited.add(full_link)
        if any(full_link.lower().endswith(ext) for ext in ['.pdf', '.zip']):
            continue
            
        print(f"Fetching subpage: {full_link}")
        try:
            req = urllib.request.Request(full_link, headers={'User-Agent': 'Mozilla/5.0'})
            response = urllib.request.urlopen(req, context=ctx, timeout=10)
            if 'text/html' not in response.headers.get('Content-Type', ''):
                continue
            sub_html = response.read().decode('utf-8', errors='ignore')
            
            sub_images = re.findall(img_regex, sub_html, re.IGNORECASE)
            sub_srcsets = re.findall(srcset_regex, sub_html, re.IGNORECASE)
            for srcset in sub_srcsets:
                for part in srcset.split(','):
                    src = part.strip().split(' ')[0]
                    if src: sub_images.append(src)
            sub_bgs = re.findall(bg_regex, sub_html, re.IGNORECASE)
            sub_images.extend(sub_bgs)
            sub_vids = re.findall(vid_regex, sub_html, re.IGNORECASE)
            sub_images.extend(sub_vids)
            sub_sources = re.findall(source_regex, sub_html, re.IGNORECASE)
            sub_images.extend(sub_sources)
            sub_links = re.findall(link_regex, sub_html, re.IGNORECASE)
            sub_images.extend(sub_links)
            
            for img_url in set(sub_images):
                if img_url.startswith('data:'):
                    continue
                full_img_url = urljoin(full_link, img_url)
                if not urlparse(full_img_url).netloc:
                    continue
                
                filename = os.path.basename(urlparse(full_img_url).path)
                filename = re.sub(r'[\\/*?:"<>|]', "", filename)
                if not filename or not any(filename.lower().endswith(ext) for ext in ['.mp4', '.webm', '.ogg', '.mov']):
                    continue
                    
                is_video = any(filename.lower().endswith(ext) for ext in ['.mp4', '.webm', '.ogg', '.mov'])
                target_dir = os.path.join(out_dir, 'videos') if is_video else out_dir
                os.makedirs(target_dir, exist_ok=True)
                
                out_path = os.path.join(target_dir, filename)
                base, ext = os.path.splitext(filename)
                counter = 1
                while os.path.exists(out_path):
                    # basic deduplication logic - simplistic
                    # if the file exists, it might be the same image, but let's just append counter if sizes differ
                    # For simplicity, we just save duplicates with counter for now.
                    out_path = os.path.join(target_dir, f"{base}_{counter}{ext}")
                    counter += 1
                    
                try:
                    req = urllib.request.Request(full_img_url, headers={'User-Agent': 'Mozilla/5.0'})
                    img_data = urllib.request.urlopen(req, context=ctx, timeout=10).read()
                    with open(out_path, 'wb') as f:
                        f.write(img_data)
                    print(f"Downloaded: {filename} from {full_link}")
                    downloaded += 1
                except Exception:
                    pass
        except Exception as e:
            print(f"Error fetching subpage {full_link}: {e}")

print(f"Total downloaded images across site: {downloaded}")
