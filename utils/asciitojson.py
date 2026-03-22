import json
import sys
import os

def convert_ascii_to_json_string(input_file):
    if not os.path.exists(input_file):
        print(f"Error: File '{input_file}' not found.")
        return

    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            # Read lines and preserve trailing spaces which are vital for ASCII art
            lines = f.read().splitlines()
        
        # Join lines with the \n character
        ascii_raw = "\n".join(lines)
        
        # We use json.dumps to handle the heavy lifting of escaping 
        # quotes and backslashes automatically.
        json_ready_string = json.dumps(ascii_raw)
        
        print(json_ready_string)
        print("Copy the text inside the quotes above and paste it into the 'text' field of your terminal.json.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ascii_to_json.py your_art.txt")
    else:
        convert_ascii_to_json_string(sys.argv[1])