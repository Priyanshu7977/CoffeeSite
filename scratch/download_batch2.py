import urllib.request
import cv2
import os

ids = [235, 237, 239, 396, 397, 398, 399, 400, 1184, 1185, 1186, 1187, 1188]
headers = {'User-Agent': 'Mozilla/5.0'}

for vid in ids:
    url = f"https://assets.mixkit.co/videos/{vid}/{vid}-720.mp4"
    dest = f"scratch/test_{vid}.mp4"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = resp.read()
            with open(dest, 'wb') as f:
                f.write(data)
        
        cap = cv2.VideoCapture(dest)
        total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        cap.set(cv2.CAP_PROP_POS_FRAMES, total // 2)
        ret, frame = cap.read()
        if ret:
            cv2.imwrite(f"scratch/preview_{vid}.jpg", frame)
            print(f"Downloaded and extracted {vid}")
        cap.release()
    except Exception as e:
        print(f"Error {vid}: {e}")
