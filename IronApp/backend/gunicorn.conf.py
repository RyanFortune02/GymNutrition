# gunicorn configuration file for django backend optimized for heroku
import multiprocessing

# basic configuration - optimized for heroku basic dyno (512mb ram)
bind = "0.0.0.0:8000"
workers = 2  # reduced from cpu_count formula to save memory
worker_class = "sync"
worker_connections = 100  # reduced from 1000
max_requests = 500  # reduced from 1000
max_requests_jitter = 25  # reduced from 50
timeout = 120  # increased timeout for heroku
keepalive = 2

# memory optimization
preload_app = True  # preload app to save memory
max_worker_memory_usage = 200000  # restart workers if they use more than 200mb

# logging configuration
accesslog = "-"
errorlog = "-"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# process naming
proc_name = "gym_nutrition_backend"

# security
forwarded_allow_ips = "*"
secure_scheme_headers = {
    'X-FORWARDED-PROTOCOL': 'ssl',
    'X-FORWARDED-PROTO': 'https',
    'X-FORWARDED-SSL': 'on'
} 