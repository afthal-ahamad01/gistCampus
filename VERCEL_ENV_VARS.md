# Environment Variables for Vercel

Copy these values and paste them into Vercel's Environment Variables section.

## How to Add in Vercel:
1. Go to your project in Vercel
2. Click **Settings** → **Environment Variables**
3. Add each variable below (one at a time)
4. Click **Save** after each one

---

## Variables to Add:

```
VITE_FIREBASE_API_KEY=AIzaSyDMurNlDUZIE_Q2oa5qHFBSZ1jTUsKO67g
```

```
VITE_FIREBASE_AUTH_DOMAIN=gistcampus-69883.firebaseapp.com
```

```
VITE_FIREBASE_PROJECT_ID=gistcampus-69883
```

```
VITE_FIREBASE_STORAGE_BUCKET=gistcampus-69883.firebasestorage.app
```

```
VITE_FIREBASE_MESSAGING_SENDER_ID=100464245270
```

```
VITE_FIREBASE_APP_ID=1:100464245270:web:5beb9a139bcca44d995337
```

```
VITE_FIREBASE_MEASUREMENT_ID=G-PQLBCY0T5J
```

---

## After Adding All Variables:

1. Click **Redeploy** in Vercel
2. Your app should now build successfully!

> **Note**: The fallback values in `firebase.js` ensure the app still works locally without a `.env` file.
