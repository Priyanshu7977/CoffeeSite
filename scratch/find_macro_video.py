import urllib.request
import urllib.parse
import json
import re
import os

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
}

# Let's search Pexels videos for macro coffee pour over
keywords = ['coffee bloom macro', 'pour over coffee grounds', 'espresso macro close up', 'coffee beans macro']

found_video_pages = []

for kw in keywords:
    url = f"https://www.pexels.com/search/videos/{urllib.parse.quote(kw)}/"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8')
            # Extract video page links
            video_links = re.findall(r'href="(/video/[^"/]+-[0-9]+/)"', html)
            for vl in video_links:
                full_url = f"https://www.pexels.com{vl}"
                if full_url not in found_video_pages:
                    found_video_pages.append(full_url)
    except Exception as e:
        print(f"Error {kw}: {e}")

print(f"Found {len(found_video_pages)} video pages:")
for vp in found_video_pages[:15]:
    print(" ", vp)
