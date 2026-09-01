import urllib.request
import json
import urllib.parse

# Search Archive.org for 'coffee grounds' OR 'coffee bloom' OR 'pour over coffee' with mediatype:movies
query = '(coffee bloom OR "pour over" OR "coffee grounds" OR "coffee beans macro" OR "coffee roasting") AND mediatype:movies'
api_url = f'https://archive.org/advancedsearch.php?q={urllib.parse.quote(query)}&fl[]=identifier,title,description,downloads&sort[]=downloads+desc&rows=30&output=json'

req = urllib.request.Request(api_url, headers={'User-Agent': 'CoffeeResearchBot/1.0'})
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        docs = data.get('response', {}).get('docs', [])
        print(f"Found {len(docs)} items on Archive.org:")
        for d in docs:
            print("  Identifier:", d.get('identifier'), "| Title:", d.get('title'))
except Exception as e:
    print("Error:", e)
