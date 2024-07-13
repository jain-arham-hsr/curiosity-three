import firebase_admin
from firebase_admin import db, storage, credentials
import os

SERVICE_ACC_CERT = {
    "type": "service_account",
    "project_id": "curiositythree-47a83",
    "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.environ.get("FIREBASE_PRIVATE_KEY").replace(r'\n', '\n'),
    "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.environ.get("FIREBASE_CLIENT_ID"),
    "auth_uri": r"https://accounts.google.com/o/oauth2/auth",
    "token_uri": r"https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": r"https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.environ.get("FIREBASE_CLIENT_X509_CERT_URL"),
    "universe_domain": r"googleapis.com"
}

DATABASE_URL = r"https://curiositythree-47a83-default-rtdb.asia-southeast1.firebasedatabase.app/"
STORAGE_BUCKET = r"curiositythree-47a83.appspot.com"


class FirebaseClient:
    def __init__(self):
        cred = credentials.Certificate(SERVICE_ACC_CERT)
        firebase_admin.initialize_app(cred, {
            'databaseURL': DATABASE_URL,
            'storageBucket': STORAGE_BUCKET
        })
        self.db_ref = db.reference()
        self.storage_bucket = storage.bucket()

    def db_write(self, path, data):
        self.db_ref.child(path).set(data)

    def db_read(self, path):
        data = self.db_ref.child(path).get()
        return data if data is not None else {}

    def db_delete(self, path):
        self.db_ref.child(path).delete()
    
    def upload_file(self, binary_str, filename, content_type):
        blob = self.storage_bucket.blob(filename)
        blob.upload_from_string(binary_str, content_type=content_type)
        blob.make_public()
        return blob.public_url