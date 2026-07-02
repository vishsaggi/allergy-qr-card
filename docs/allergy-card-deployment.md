# Allergy Card Deployment

QR codes generated on `localhost` only work on the computer running the dev server.
Deploy the app first, then generate and print QR codes from the live URL.

## Static public launch

This version can be hosted as a static Next.js export with no database.

1. Deploy the app to a public HTTPS host such as Vercel, Netlify, Cloudflare Pages, or GitHub Pages.
2. Set `NEXT_PUBLIC_APP_URL` to the public app URL.
   Example: `https://allergy-card.example.com`
3. Generate QR codes from the deployed site, not from `localhost`.

The QR stores a public `/card#...` link with the allergy details in the URL fragment. Anyone who scans it can view the card if they can reach the public app URL.

## Same QR After Updates

The static version cannot keep the same QR when details change because the details are encoded into the QR link.

To keep one permanent QR per child:

1. Store each child card in a managed database.
2. Print a stable URL such as `/card/abc123`.
3. Let parents sign in and update the record behind that ID.
4. Keep the public scan page read-only.

For low management cost, use managed auth and database hosting rather than running your own server.
