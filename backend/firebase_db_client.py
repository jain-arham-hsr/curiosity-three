import firebase_admin
from firebase_admin import db, credentials
import os

CRED = credentials.Certificate({
    "type": "service_account",
    "project_id": "curiositythree-47a83",
    "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.environ.get("FIREBASE_PRIVATE_KEY").replace(r'\n', '\n'),
    "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.environ.get("FIREBASE_CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.environ.get("FIREBASE_CLIENT_X509_CERT_URL"),
    "universe_domain": "googleapis.com"
})
DATABASE_URL = "https://curiositythree-47a83-default-rtdb.asia-southeast1.firebasedatabase.app/"
firebase_admin.initialize_app(CRED, {"databaseURL": DATABASE_URL})



db.reference("/").set({"language": "python"})
ref = db.reference("/")
print(ref.get())