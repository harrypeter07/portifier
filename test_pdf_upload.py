#!/usr/bin/env python3
"""
Test script for PDF upload functionality
"""
import requests
import os

def test_pdf_upload():
    """Test PDF upload to backend"""
    backend_url = "http://localhost:5000"
    
    # Test health check
    print("Testing backend health...")
    try:
        response = requests.get(f"{backend_url}/api/health")
        print(f"Health check: {response.status_code}")
        if response.status_code == 200:
            print("Backend is running!")
        else:
            print("Backend health check failed")
            return
    except Exception as e:
        print(f"Backend not accessible: {e}")
        return
    
    # Test PDF upload (you'll need to provide a PDF file)
    pdf_file_path = input("Enter path to a PDF file to test upload: ").strip()
    
    if not os.path.exists(pdf_file_path):
        print("File not found!")
        return
    
    print(f"Uploading {pdf_file_path}...")
    
    try:
        with open(pdf_file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(f"{backend_url}/api/pdf/upload", files=files)
        
        print(f"Upload response: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("Upload successful!")
            print(f"Response: {data}")
            
            # Test PDF info
            print("\nTesting PDF info...")
            info_response = requests.get(f"{backend_url}/api/pdf/info")
            print(f"Info response: {info_response.status_code}")
            if info_response.status_code == 200:
                info_data = info_response.json()
                print(f"PDF Info: {info_data}")
                
                # Test page loading
                print("\nTesting page loading...")
                page_response = requests.get(f"{backend_url}/api/pdf/page/0")
                print(f"Page response: {page_response.status_code}")
                if page_response.status_code == 200:
                    page_data = page_response.json()
                    print(f"Page data keys: {list(page_data.keys())}")
                    if 'page_image' in page_data:
                        print("Page image received successfully!")
                    else:
                        print("No page image in response")
                else:
                    print(f"Page loading failed: {page_response.text}")
            else:
                print(f"PDF info failed: {info_response.text}")
        else:
            print(f"Upload failed: {response.text}")
            
    except Exception as e:
        print(f"Error during upload: {e}")

if __name__ == "__main__":
    test_pdf_upload()
