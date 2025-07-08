# DHS-Documentation

# useful commands

```
npx create-docusaurus@latest website classic
# choose javascript
```

```
npm run docusaurus docs:version 1.0
npm run start

```

<!-- Integrating tailwind -->

```
# npm install prism-react-renderer@1.3.5

# tailwind setup
rm -rf node_modules package-lock.json
npm cache clean --force

npm install -D tailwindcss@3.3.5 postcss autoprefixer
ls ./node_modules/.bin/tailwindcss  # this should list tailwindcss
npx tailwindcss init -p

<!-- tailwind.config.js -->
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // ✅ ONLY apply Tailwind to src/
  theme: {
    extend: {},
  },
  plugins: [],
}

<!-- src/css/custom.css -->

@tailwind base;
@tailwind components;
@tailwind utilities;

```

## verify these details in "docusaurus.config.js" before deploying

```
title: "DHS Documentation Project",
tagline: "Preparing Digital Goods for AI in Healthcare",
favicon: "img/favicon.ico",

url: "https://Prashu7487.github.io",
baseUrl: "/DHS-Documentation/", // must match the repo name

organizationName: "Prashu7487", // GitHub username
projectName: "DHS-Documentation", // GitHub repo name
deploymentBranch: "gh-pages", // this same branch is mandatory

trailingSlash: false,
onBrokenLinks: "warn", (warning of broken links during build)
onBrokenMarkdownLinks: "warn",
```

## Deploy

```
# first check by building
npm run dev

# deploy
GIT_USER=Prashu7487 npm run deploy

# Be ready with the access key for above account (enter when prompted for password)
```

## Important:

To push changed in the github:

- you should be a collabo. in the repo
- modify `docusaurus.config.js` file for your username etc as required
- then execute the command

```bash
# GIT_PASS should be valid auth token to your account
npx cross-env GIT_USER=Prashu7487 GIT_PASS=ghp_abcdefghi docusaurus deploy

# OR

GIT_USER=Prashu7487 GIT_PASS=ghp_abcdefghi npm run deploy
```
