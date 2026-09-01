import cv2
import glob
import os

os.makedirs('scratch/inspections', exist_ok=True)

files = sorted(glob.glob('scratch/test_*.mp4'))

for f in files:
    base = os.path.basename(f).replace('.mp4', '')
    cap = cv2.VideoCapture(f)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    duration = total / fps if fps else 0
    
    # Extract 3 frames: 25%, 50%, 75%
    for pct in [25, 50, 75]:
        pos = int(total * (pct / 100.0))
        cap.set(cv2.CAP_PROP_POS_FRAMES, pos)
        ret, frame = cap.read()
        if ret:
            out_name = f"scratch/inspections/{base}_{pct}pct.jpg"
            cv2.imwrite(out_name, frame)
    cap.release()
    print(f"{base}: {total} frames, {duration:.1f}s")
