import re, json, html

import urllib.request, ssl

def main():
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        url = "https://burgersgroup.com/"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        content = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')

        settings_matches = re.findall(r'data-settings="([^"]+)"', content)
        for m in settings_matches:
            try:
                decoded = html.unescape(m)
                j = json.loads(decoded)
                
                # Elementor Background Video
                if 'background_video_link' in j:
                    print('Found Elementor Video Link:', j['background_video_link'])
                
                # Elementor Lottie Animation
                if 'source_json' in j:
                    print('Found Elementor Lottie JSON:', j['source_json']['url'])
                
            except Exception as j_err:
                pass
    except Exception as e:
        print('Error:', e)

if __name__ == '__main__':
    main()
