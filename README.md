# Bazaar

An original, responsive community marketplace built with React, Vite, Tailwind CSS, Express, and MongoDB. People can browse listings, filter by category or city, save favourites for the current session, create an account, and post a listing with an optional photo.

## Get started

Requirements: Node.js 20.19+ (or 22.12+) and MongoDB 6.0+.

1. Install packages with `npm install`.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` and a private, randomly generated `JWT_SECRET` of at least 32 characters.
3. Start MongoDB locally or set `MONGODB_URI` to your MongoDB Atlas connection string.
4. In one terminal, run `npm run api`.
5. In a second terminal, run `npm run dev` and open the Vite URL.

The browser uses `http://localhost:5000` for the API by default. Set `VITE_API_URL` in a local `.env` file to use a different API host; add that front-end origin to `CLIENT_ORIGIN` on the API. Multiple allowed origins can be comma-separated.

## API

- `GET /api/health` — API and database status.
- `GET /api/listings` — newest 60 listings.
- `POST /api/auth/register` — create an account and return a bearer token.
- `POST /api/auth/login` — sign in and return a bearer token.
- `POST /api/listings` — create a listing (bearer token required); submit form data with an optional JPEG, PNG, or WebP `photo` (up to 5 MB).

Uploaded images are stored in `server/uploads` for local development. For a deployed service, use persistent storage or an object-storage provider, configure HTTPS and production origins, and protect secrets through the hosting provider's environment settings. The sample listing photos are decorative remote images; sample listings are replaced by MongoDB listings when the API is connected.

## Checks

- `npm run lint`
- `npm run build`
