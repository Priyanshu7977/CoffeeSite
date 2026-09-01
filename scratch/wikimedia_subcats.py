import urllib.request
import json

cats = [
    'Category:Coffee_preparation',
    'Category:Espresso',
    'Category:Roasted_coffee_beans',
    'Category:Coffee_beans',
    'Category:Pour-over_coffee',
    'Category:Coffee_roasting',
    'Category:Latte_art',
    'Category:Coffee_brewing',
    'Category:Coffee_machines',
    'Category:Baristas'
]

video_files = []

for cat in cats:
    api_url = f'https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle={cat}&gcmlimit=500&gcmtype=file&prop=imageinfo&iiprop=url|mime&format=json'
    req = urllib.request.Request(api_url, headers={'User-Agent': 'CoffeeResearchBot/1.0 (contact: dev@noirroast.com)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, page in pages.items():
                title = page.get('title', '')
                info = page.get('imageinfo', [{}])[0]
                mime = info.get('mime', '')
                url = info.get('url', '')
                if 'video' in mime or url.endswith('.webm') or url.endswith('.mp4') or url.endswith('.ogv'):
                    video_files.append((cat, title, url))
    except Exception as e:
        print(f"Error {cat}: {e}")

print(f"Found {len(video_files)} video files:")
for v in video_files:
    print("  ", v)
