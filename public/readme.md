npx @11ty/eleventy --serve
rm -rf dist && npx @11ty/eleventy --serve

Bash1:  npm run dev
Bash2:  netlify dev

build process:
npx tailwindcss -i public/input.css -o public/output.css --watch
1.  npx eleventy
2.  npx eleventy --serve
3.  netlify dev

Clean build:
rm -rf node_modules && rm package-lock.json && npm install

project local copy:
robocopy savali-11ty savali-11ty-bkup /mir /xd node_modules

curl -X POST http://localhost:8888/.netlify/functions/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'

