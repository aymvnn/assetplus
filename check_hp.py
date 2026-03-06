import urllib.request, re
try:
    html = urllib.request.urlopen("https://burgersgroup.com/").read().decode("utf-8")
    media = re.findall(r"(https?://[^\s\"\'<>]+(?:\.mp4|\.webm|\.json|\.lottie|\.mov)[^\s\"\'<>]*)", html)
    for m in set(media):
        print(m)
except Exception as e:
    print(e)
