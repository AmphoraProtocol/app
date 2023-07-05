# Amphora Protocol App

Official app for Amphora Protocol.

## Development

To setup the development environment first clone the repo:

```bash
git clone [this repo link] && cd amphora-ui
```

### Local env

Install dependencies:

```bash
yarn
```

Configure the `.env` variables:

```bash
cp .env.example .env
```

Start the app:

```bash
yarn dev
```

The app should be live at [http://localhost:5173/](http://localhost:5173/)

---

## Production

```
yarn build
yarn preview
```

The app should be live at [http://localhost:4173/](http://localhost:4173/)
