import urllib.request
import json
import os

# Wikimedia API to get all files in Category:Coffee
api_url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:Coffee&gcmlimit=500&gcmtype=file&prop=imageinfo&iiprop=url|mime|mediatype&format=json'
req = urllib.request.Request(api_url, headers={'User-Agent': 'CoffeeResearchBot/1.0 (contact: dev@noirroast.com)'})

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        print(f"Total files in Category:Coffee: {len(pages)}")
        video_files = []
        for pid, page in pages.items():
            title = page.get('title', '')
            info = page.get('imageinfo', [{}])[0]
            mime = info.get('mime', '')
            url = info.get('url', '')
            if 'video' in mime or url.endswith('.webm') or url.endswith('.mp4') or url.endswith('.ogv'):
                video_files.append((title, url))
        print(f"Found {len(video_files)} video files:")
        for v in video_files:
            print("  ", v)
except Exception as e:
    print("Error:", e)
