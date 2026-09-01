import urllib.request
import json
import re

url = 'https://mixkit.co/free-stock-video/coffee/'
req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
})

with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')
    match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
    if match:
        data = json.loads(match.group(1))
        
        found_videos = []
        def search_dict(d):
            if isinstance(d, dict):
                if 'title' in d and ('video' in d.get('type', '') or 'thumbnail' in d or 'videos' in str(d)):
                    title = d.get('title')
                    id_val = d.get('id')
                    video_url = d.get('video_url') or d.get('preview_url') or d.get('download_url') or d.get('video_preview_url')
                    found_videos.append((id_val, title, video_url))
                for v in d.values():
                    search_dict(v)
            elif isinstance(d, list):
                for item in d:
                    search_dict(item)

        search_dict(data)
        print(f"Found {len(found_videos)} video entries:")
        for v in found_videos[:25]:
            print("  ", v)
    else:
        print("No NEXT_DATA script found.")
