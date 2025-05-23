#!/usr/bin/env python3
"""
simple script to start the django backend
supports both development and production modes
"""
import os
import sys
import subprocess
import platform

def start_development_server():
    """starts the django app using the built-in development server"""
    # change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    # django development server command
    cmd = [
        "python",
        "manage.py",
        "runserver",
        "127.0.0.1:8000"
    ]
    
    print(f"starting django development server with command: {' '.join(cmd)}")
    print("server will be available at http://127.0.0.1:8000")
    print("press ctrl+c to stop the server")
    
    try:
        subprocess.run(cmd, check=True)
    except KeyboardInterrupt:
        print("\nserver stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"error starting server: {e}")
        sys.exit(1)

def start_gunicorn():
    """starts the django app using gunicorn (linux/mac only)"""
    if platform.system() == "Windows":
        print("warning: gunicorn is not supported on windows")
        print("using django development server instead...")
        start_development_server()
        return
    
    # change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    # check if in a virtual environment
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("warning: virtual environment not detected")
        print("make sure to activate your virtual environment first")
    
    # gunicorn command with configuration
    cmd = [
        "gunicorn",
        "--config", "gunicorn.conf.py",
        "backend.wsgi:application"
    ]
    
    print(f"starting gunicorn with command: {' '.join(cmd)}")
    print("server will be available at http://127.0.0.1:8000")
    print("press ctrl+c to stop the server")
    
    try:
        subprocess.run(cmd, check=True)
    except KeyboardInterrupt:
        print("\nserver stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"error starting gunicorn: {e}")
        sys.exit(1)

def main():
    """main function to choose server type"""
    if len(sys.argv) > 1 and sys.argv[1] == "--production":
        start_gunicorn()
    else:
        start_development_server()

if __name__ == "__main__":
    main() 