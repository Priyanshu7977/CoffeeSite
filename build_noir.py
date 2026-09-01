# -*- coding: utf-8 -*-
import os

def write_file(filepath, content):
    d = os.path.dirname(filepath)
    if d and not os.path.exists(d):
        os.makedirs(d, exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    print(f'Wrote: {filepath}')

print('Script generator ready.')
