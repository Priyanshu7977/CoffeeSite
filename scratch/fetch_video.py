import urllib.request
import re
import os

os.makedirs('public/assets/videos', exist_ok=True)
dest = 'public/assets/videos/coffee-hero.mp4'

# Pexels video page or direct open-source macro coffee video
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# Let's check direct open video CDN URLs
video_urls = [
    # Free Stock Video CDNs (Pexels, Mixkit, Coverr, Pixabay open CDN)
    'https://cdn.coverr.co/videos/coverr-making-pour-over-coffee-5464/1080p.mp4',
    'https://cdn.coverr.co/videos/coverr-brewing-coffee-with-chemex-5463/1080p.mp4',
    'https://cdn.coverr.co/videos/coverr-dripping-fresh-coffee-5465/1080p.mp4',
    'https://cdn.coverr.co/videos/coverr-coffee-beans-in-a-roasting-machine-5459/1080p.mp4',
    'https://cdn.coverr.co/videos/coverr-pouring-hot-water-into-a-french-press-5467/1080p.mp4',
    'https://assets.mixkit.co/videos/41589/41589-720.mp4',
    'https://assets.mixkit.co/videos/41588/41588-720.mp4',
    'https://assets.mixkit.co/videos/41584/41584-720.mp4'
]

success = False
for url in video_urls:
    try:
        print(f"Trying {url}...")
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            content = resp.read()
            if len(content) > 100000:
                with open(dest, 'wb') as f:
                    f.write(content)
                print(f"SUCCESS! Downloaded {len(content)} bytes ({len(content)/(1024*1024):.2f} MB) to {dest}")
                success = True
                break
    except Exception as e:
        print(f"Error {url}: {e}")

if not success:
    print("Trying alternative video source...")
