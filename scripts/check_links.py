import re
import requests
import os

def extract_links_from_file(filepath):
    """Extracts all links from a given file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
        # Regex to find all occurrences of 'link: "..."'
        links = re.findall(r'link:\s*"([^"]+)"', content)
        return links
    except FileNotFoundError:
        print(f"Error: The file {filepath} was not found.")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

def check_link_status(links):
    """Checks the status of each link and returns a dictionary with the results."""
    link_statuses = {}
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    for link in links:
        try:
            # Using HEAD request to be faster and consume less bandwidth
            response = requests.head(link, headers=headers, allow_redirects=True, timeout=10)
            link_statuses[link] = response.status_code
        except requests.RequestException as e:
            link_statuses[link] = str(e)
    return link_statuses

def save_statuses_to_file(statuses, output_filepath):
    """Saves the link statuses to a file."""
    with open(output_filepath, 'w', encoding='utf-8') as file:
        for link, status in statuses.items():
            file.write(f"{link}: {status}\n")

if __name__ == "__main__":
    js_filepath = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'dataSources.js')
    output_filepath = 'link_statuses.txt'

    print(f"Extracting links from {js_filepath}...")
    links = extract_links_from_file(js_filepath)

    if links:
        print(f"Found {len(links)} links. Checking their status...")
        statuses = check_link_status(links)
        print(f"Saving status results to {output_filepath}...")
        save_statuses_to_file(statuses, output_filepath)
        print("Done.")

        print("\nBroken links:")
        for link, status in statuses.items():
            if status != 200:
                print(f"{link}: {status}")
    else:
        print("No links found or an error occurred during extraction.")
