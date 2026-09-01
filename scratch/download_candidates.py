import urllib.request
import os

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

test_ids = [
    236, 41584, 41585, 41586, 41587, 41588, 41590, 41591, 41592, 41593, 41594, 41595,
    42858, 42859, 42860, 42861, 42862, 42863, 42864, 42865
]

for vid in test_ids:
    url = f"https://assets.mixkit.co/videos/{vid}/{vid}-720.mp4"
    out_file = f"scratch/test_{vid}.mp4"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read()
            with open(out_file, 'wb') as f:
                f.write(data)
            print(f"Downloaded {vid}: {len(data)/(1024*1024):.2f} MB")
    except Exception as e:
        # print(f"Not found {vid}: {e}")
        pass
