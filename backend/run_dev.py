import os
import subprocess
import sys

from dotenv import load_dotenv

load_dotenv()

def run_main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    main_script = os.path.join(current_dir, 'main.py')

    try:
        subprocess.run([sys.executable, main_script] + sys.argv[1:], check=True)
    except subprocess.CalledProcessError as e:
        print(f"An error occurred while running the main script: {e}")
        sys.exit(1)

if __name__ == '__main__':
    run_main()
