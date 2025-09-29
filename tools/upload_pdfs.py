#!/usr/bin/env python3
"""
Bulk uploader for PDFs in public/uploads.

Usage:
  python tools/upload_pdfs.py [--host http://localhost:5000]

Finds all .pdf files under public/uploads and POSTs them to /api/pdf/upload.
Prints concise results and first 200 chars of response.
"""
import argparse
import glob
import os
import sys
import requests

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', default='http://localhost:5000', help='Backend base URL')
    parser.add_argument('--dir', default='public/uploads', help='Directory to scan for PDFs')
    args = parser.parse_args()

    upload_dir = args.dir
    if not os.path.isdir(upload_dir):
        print(f"Directory not found: {upload_dir}")
        sys.exit(1)

    pdfs = sorted(glob.glob(os.path.join(upload_dir, '**', '*.pdf'), recursive=True))
    if not pdfs:
        print('No PDF files found.')
        sys.exit(0)

    print(f"Found {len(pdfs)} PDF(s) in {upload_dir}\n")
    for path in pdfs:
        try:
            with open(path, 'rb') as f:
                files = {'file': (os.path.basename(path), f, 'application/pdf')}
                r = requests.post(f"{args.host}/api/pdf/upload", files=files, timeout=60)
            snippet = r.text[:200].replace('\n', ' ')
            print(f"UPLOAD {os.path.basename(path)} -> {r.status_code}: {snippet}")
        except Exception as e:
            print(f"ERROR {os.path.basename(path)} -> {e}")

if __name__ == '__main__':
    main()


