# InternLink – Front End (React + Tailwind CSS)

## How to run
1. Start the backend first (port 5000) – `cd backend && npm install && npm start`
2. In this folder:
   ```
   npm install
   npm run dev
   ```
3. Open http://localhost:5173

`vite.config.js` proxies every `/api` call to `http://localhost:5000`, so no CORS setup is needed while developing.

## Build for production
`npm run build` creates a `dist` folder. Your backend `index.js` already serves `frontend/dist`,
so keep this folder named `frontend` next to the `backend` folder.

## Hero image
Put your illustration in `public/hero.png` to show it on the home page.

## Things to know (because of how the backend is written)
- Almost all routes need login, so `/jobs` is protected.
- Signup needs a profile photo, profile update needs a resume file, and company update needs a logo
  (the backend always uploads a file to cloudinary and crashes without one).
- Job has no category field in the DB, so category filter works by keywords in title/description.
- Notifications are not built because there is no backend for them.
