# 🌍 Reader (React)

Automated build and deployment via GitHub Actions.

## 🛠 Fix for White Screen
If you see a white screen on GitHub Pages:
1. Go to **Settings > Pages**.
2. Under **Build and deployment**, ensure **Source** is set to **GitHub Actions**.
3. Ensure your repository name matches the `base` property in `vite.config.ts` (currently `/reader/`).

## 🚀 How it works
1. You push to `main`.
2. GitHub Actions runs `npm run build`.
3. Vite bundles the `index.tsx` and React components into the `dist` folder.
4. The `upload-pages-artifact` step sends that `dist` folder to the live site.