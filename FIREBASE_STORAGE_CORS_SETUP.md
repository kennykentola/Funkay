# How to Enable CORS on Firebase Cloud Storage Bucket

The browser error:
`Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/v0/b/funkay-rental-services.firebasestorage.app/...' from origin 'https://funkay.vercel.app' has been blocked by CORS policy`

occurs because Google Cloud Storage buckets require an explicit CORS rule to accept web uploads from your frontend domain (`https://funkay.vercel.app`).

---

## Option 1: Using Google Cloud Shell (Recommended & Easiest - 2 Minutes)

1. Open [Google Cloud Console](https://console.cloud.google.com/) or [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **funkay-rental-services**.
3. Click the **Cloud Shell** icon (`>_`) in the top-right header bar to open terminal.
4. Copy and paste the following commands into Cloud Shell:

```bash
cat << 'EOF' > cors.json
[
  {
    "origin": ["*"],
    "method": ["GET", "PUT", "POST", "DELETE", "HEAD", "OPTIONS"],
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
EOF

gcloud storage buckets update gs://funkay-rental-services.firebasestorage.app --cors-file=cors.json
```

*(If `gcloud storage` is unavailable in older environments, use `gsutil cors set cors.json gs://funkay-rental-services.firebasestorage.app` instead).*

---

## Option 2: Using Local `gcloud` CLI

If you have `gcloud` installed locally on your machine:

1. Authenticate with Google Cloud:
   ```bash
   gcloud auth login
   ```
2. Set active project:
   ```bash
   gcloud config set project funkay-rental-services
   ```
3. Run:
   ```bash
   gcloud storage buckets update gs://funkay-rental-services.firebasestorage.app --cors-file=cors.json
   ```

---

## Instant Base64 Fallback (Built-in)
While CORS is being configured on the bucket, the Funkay Admin Portal automatically converts uploaded images to Base64 data URLs when a Cloud Storage CORS failure occurs, ensuring image uploads and updates never block admin inventory management.
