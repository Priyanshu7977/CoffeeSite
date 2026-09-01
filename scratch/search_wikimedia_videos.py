import urllib.request
import json
import os

search_queries = [
    'pour over coffee',
    'coffee bloom',
    'filter coffee',
    'coffee grounds',
    'roasted coffee beans',
    'coffee extraction'
]

results = []
for q in search_queries:
    url = f'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}%20filetype:video&gsrlimit=50&prop=imageinfo&iiprop=url|mime&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'CoffeeResearchBot/1.0 (contact: dev@noirroast.com)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, page in pages.items():
                title = page.get('title', '')
                info = page.get('imageinfo', [{}])[0]
                video_url = info.get('url', '')
                results.append((q, title, video_url))
    except Exception as e:
        print(f"Error searching {q}: {e}")

print(f"Found {len(results)} search results:")
for r in results:
    print("  ", r)
