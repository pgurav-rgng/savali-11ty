## Migration to SSG/eleventy ##


Commands to run the project:
rm -rf node_modules && rm package-lock.json && npm install

npm run dev -in one bash
netlify dev -in 2nd bash

now build process:
npx tailwindcss -i public/input.css -o public/output.css --watch

1. npx eleventy
2. npx eleventy --serve
3. netlify dev

http://localhost:8888/.netlify/functions/chat

"start": "npm run build:css && concurrently \"npm run watch:css\" \"npm run serve:eleventy\"",

npx tailwindcss -i public/input.css -o public/output.css --minify
netlify build
git add . && git commit -m "Fix missing dependencies" && git push origin main
