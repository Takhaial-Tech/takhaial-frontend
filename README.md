# Takhaial Frontend

## TikTok Pixel

Set the TikTok Pixel ID in the frontend deployment environment before building:

```bash
REACT_APP_TIKTOK_PIXEL_ID=your_tiktok_pixel_id
```

On Vercel, add it to the project environment variables for Production and Preview, then redeploy the frontend. Without this value, the TikTok Pixel code stays inactive.

Tracked website events:

- Page views on route changes.
- Quick action contact clicks.
- Service card and service detail views.
- Demo video opens.
- Quote request form submissions.
- First AI chat message per page session.
