# homepage

# GitHub Gist Setup Instructions

## ✅ You've Already Done:
1. ✅ Created your GitHub Gist
2. ✅ Saved your Personal Access Token
3. ✅ Have your Gist ID ready
4. ✅ Code is updated and ready

---

## 🚀 Final Steps to Enable Sync

### Step 1: Open `script.js`

Find the configuration section at the top (around line 10-20):

```javascript
const GIST_CONFIG = {
    enabled: false, // Set to true to enable Gist sync
    token: '', // Your GitHub Personal Access Token (paste here)
    gistId: '', // Your Gist ID (paste here)
    filename: 'homepage-data.json',
    autoSyncDelay: 2000 // Auto-sync after 2 seconds of inactivity
};
```

### Step 2: Update the Configuration

Replace the empty values with your actual credentials:

```javascript
const GIST_CONFIG = {
    enabled: true, // ← Change to true
    token: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // ← Paste your token here
    gistId: 'abc123def456789', // ← Paste your Gist ID here
    filename: 'homepage-data.json',
    autoSyncDelay: 2000
};
```

**Important:**
- Make sure to keep the quotes around the token and gistId
- Token starts with `ghp_`
- Gist ID is the long string from your Gist URL

### Step 3: Save the File

Press `Ctrl + S` to save `script.js`

---

## 🎉 That's It! Your Homepage is Now Cloud-Synced

### What Happens Now:

**On Page Load:**
- You'll see "Loading from cloud..." in the top-right
- Your data loads from GitHub Gist (2-3 seconds)
- Falls back to localStorage if Gist fails

**When You Make Changes:**
- Changes save instantly to localStorage (no lag)
- After 2 seconds of inactivity, syncs to Gist
- You'll see "Syncing..." then "Synced ✓"

**On Other Devices:**
- Open your homepage anywhere
- It automatically loads your latest data
- All your sites, categories, and preferences sync!

---

## 🔧 How to Use Across Devices

### Method 1: GitHub Pages (Recommended)
1. Push your homepage folder to GitHub
2. Enable GitHub Pages in repo settings
3. Access from `https://yourusername.github.io/homepage/`
4. Works from any device with your credentials

### Method 2: Copy Files
1. Copy `index.html`, `script.js`, `style.css` to USB drive
2. Open on any computer
3. Data loads from Gist automatically
4. No need to transfer data manually!

---

## 🛠️ Troubleshooting

### "Cloud sync failed (using local)"
- Check your token is correct
- Check your Gist ID is correct
- Make sure you have internet connection
- Verify token has `gist` permission

### Sync indicator shows error
- Open browser Console (F12 → Console)
- Look for error messages
- Common issues:
  - Token expired or invalid
  - Gist ID wrong
  - Network/internet issue

### Want to disable sync temporarily?
Change `enabled: false` in the config

### Want to force a fresh sync?
1. Clear localStorage in browser DevTools
2. Refresh page
3. It will load from Gist

---

## 🔒 Security Notes

**Your token is visible in `script.js`:**
- Anyone who views your source code can see it
- Token only has `gist` scope (limited access)
- Your Gist is private (others can't see data)
- You can revoke/regenerate token anytime at: https://github.com/settings/tokens

**To keep token private:**
1. Don't commit `script.js` with token to public repos
2. Use environment variables if hosting on server
3. Or keep the homepage files private

---

## 📝 Data Structure in Gist

Your Gist stores this JSON:

```json
{
  "categories": [...],
  "categoryStates": {...},
  "darkMode": "enabled",
  "websites": [...],
  "lastSync": "2025-12-08T10:30:00.000Z"
}
```

You can view/edit it directly on GitHub Gist if needed!

---

## 🎯 Quick Test

1. Add a new website to your homepage
2. Wait 2-3 seconds
3. Look for "Synced ✓" in top-right
4. Check your Gist on GitHub - data should be updated!

---

## Need Help?

If something doesn't work:
1. Check browser Console for errors (F12 → Console)
2. Verify token and Gist ID are correct
3. Make sure `enabled: true` in config
4. Test internet connection

**All set! Your homepage now syncs across all your devices! 🚀**
