# Cloudflare DNS Configuration for MOXtudio AI

## Quick Reference: DNS Records for moxtudio.ai

Once you deploy to Vercel and add the custom domain, add these records in Cloudflare:

---

### Record 1: Root Domain
```
Type:          CNAME
Name:          @
Target:        cname.vercel-dns.com
Proxy status:  DNS only (⚪ gray cloud)
TTL:           Auto
```

### Record 2: WWW Subdomain (Optional but Recommended)
```
Type:          CNAME
Name:          www
Target:        cname.vercel-dns.com
Proxy status:  DNS only (⚪ gray cloud)
TTL:           Auto
```

---

## For Redirect Domain (moxtudio.com)

**Option 1: Redirect in Vercel** (Recommended)
1. Add `moxtudio.com` in Vercel → Settings → Domains
2. Set it as "Redirect to moxtudio.ai"
3. Add same CNAME records in Cloudflare for moxtudio.com

**Option 2: Cloudflare Page Rules**
1. Use Cloudflare page rules to redirect
2. Set forwarding URL from `moxtudio.com` → `https://moxtudio.ai`

---

## Important Settings in Cloudflare:

### SSL/TLS Settings:
- **Mode:** Full (strict)
- **Always Use HTTPS:** ON
- **Automatic HTTPS Rewrites:** ON

### Speed Settings:
- **Auto Minify:** ON (JS, CSS, HTML)
- **Brotli:** ON

### After DNS Verification:
Once Vercel confirms the domain is connected, you can:
- ✅ Turn ON orange cloud (🟠) for Cloudflare CDN
- This adds an extra layer of DDoS protection and caching

---

## Verification Steps:

1. **Add DNS records in Cloudflare** (gray cloud initially)
2. **Wait 2-5 minutes**
3. **Check in Vercel** → Should show "Valid Configuration"
4. **Turn on orange cloud** in Cloudflare (optional)
5. **Visit your domain** → Should load MOXtudio AI!

---

## Troubleshooting:

### "Invalid Configuration" in Vercel?
- Wait 10-15 minutes for DNS propagation
- Verify CNAME target is exactly: `cname.vercel-dns.com`
- Make sure Proxy is OFF (gray cloud)

### SSL Certificate Issues?
- Vercel auto-generates SSL (free)
- Can take 5-10 minutes after DNS verification
- Set Cloudflare SSL to "Full" or "Full (strict)"

### Domain not loading?
- Check DNS with: `nslookup moxtudio.ai`
- Should resolve to Vercel IPs
- Clear browser cache or try incognito

---

## Expected Timeline:
- ⚡ DNS records added: **1 minute**
- 🌐 DNS propagation: **5-15 minutes**
- 🔒 SSL certificate: **5-10 minutes** (automatic)
- ✅ Live site: **~15-20 minutes total**

---

## Your Domains Strategy:

| Domain | Purpose | Status |
|--------|---------|--------|
| **moxtudio.ai** | Primary (main site) | 🎯 Main |
| moxtudio.com | Redirect to primary | ↪️ Redirect |

This ensures all traffic goes to your primary domain (moxtudio.ai) with a backup redirect from moxtudio.com.
