import os
import tempfile

# Set up a temporary API keys database for all tests.
# This must happen before any test module imports api_keys (via main).
_tmp_db = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
os.environ["API_KEYS_DB"] = _tmp_db.name
_tmp_db.close()
