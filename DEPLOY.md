# MOXtudio AI - Vercel Deployment Guide

## Quick Deploy (2 Minutes)

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Name: `moxstudio-ai`
3. Make it **Private** (recommended)
4. Click "Create repository"
5. **Don't** initialize with README (we already have code)

### Step 2: Push Code to GitHub
Run these commands in your terminal:

```bash
git remote add origin https://github.com/YOUR-USERNAME/moxstudio-ai.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your `moxstudio-ai` repository
4. Vercel will auto-detect it's a Vite project
5. Click "Deploy" (no configuration needed!)
6. Wait 30-60 seconds
7. **Copy your live URL** (will be something like: `moxstudio-ai.vercel.app`)

---

## Connect Your Custom Domain (Cloudflare DNS)

Once deployed, you'll have a Vercel URL. Here's how to connect your custom domains:

### Your Domains (Already Owned on Cloudflare):
- ✅ **moxtudio.ai** (primary)
- ✅ moxtudio.com (redirect to primary)

### In Vercel (Add Custom Domain):
1. Go to your project in Vercel
2. Click "Settings" → "Domains"
3. Add domain: `moxtudio.ai`
4. Vercel will show you DNS records to add

### In Cloudflare DNS (for moxtudio.ai):

Add these records:

#### **CNAME Record:**
```
Type: CNAME
Name: @ (or "moxtudio.ai")
Target: cname.vercel-dns.com
Proxy status: DNS only (gray cloud)
TTL: Auto
```

#### **For www subdomain (optional):**
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy status: DNS only (gray cloud)
TTL: Auto
```

### Important Cloudflare Settings:
- **Turn OFF** the orange cloud (proxy) initially
- Once verified, you can turn it ON for CDN benefits
- SSL/TLS mode: **Full** or **Full (strict)**

---

## Expected Timeline:
- Deploy to Vercel: **1 minute**
- DNS propagation: **5-60 minutes** (usually ~10 min)
- SSL certificate: **Automatic** (Vercel handles this)

---

## After Deployment:

### Set Redirect Rules (in Vercel):
Once `moxtudio.ai` is your primary domain, redirect your backup domain:

1. In Vercel → Settings → Domains
2. Add `moxtudio.com`
3. Click it → Set as redirect to `moxtudio.ai`

This way:
- `moxtudio.com` → redirects to `moxtudio.ai`
- `www.moxtudio.com` → redirects to `moxtudio.ai`

---

## Your Brand Identity:
**Primary:** MOXtudio AI
**Domain:** moxtudio.ai
**Tagline:** "The Innovation Engine Hospitality Didn't Know It Needed"

---

## Need Help?
- Vercel Docs: https://vercel.com/docs
- Cloudflare DNS: https://developers.cloudflare.com/dns/

---

## Current Status:
✅ Code is ready
✅ Build tested and working
✅ Git repository initialized
✅ Domains owned on Cloudflare (moxtudio.ai, moxtudio.com)
⏳ Awaiting GitHub push
⏳ Awaiting Vercel deployment
⏳ Awaiting DNS configuration
