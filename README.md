# GourmetWelt / GourmetMonde 🍽

Zweisprachiger Rezeptkatalog (DE/FR) mit KI-gestützter automatischer Veröffentlichung.  
Catalogue de recettes bilingue (DE/FR) avec publication automatique par IA.

## Vercel-Deployment (5 Minuten)

### 1. GitHub-Repository erstellen

```bash
cd recipe-catalog
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DEIN_LOGIN/recipe-catalog.git
git push -u origin main
```

### 2. In Vercel importieren

1. Gehe zu [vercel.com](https://vercel.com) → **Add New Project**
2. Wähle dein Repository `recipe-catalog`
3. Klicke **Deploy** (Next.js wird automatisch erkannt)

### 3. API-Schlüssel hinzufügen

Nach dem Deployment:
1. Projekt öffnen → **Settings** → **Environment Variables**
2. Variable hinzufügen:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** dein Schlüssel von [console.anthropic.com](https://console.anthropic.com)
3. **Save** → **Deployments** → **Redeploy**

## Lokale Entwicklung

```bash
npm install
echo "ANTHROPIC_API_KEY=dein_schlüssel" > .env.local
npm run dev
```

Öffne http://localhost:3000
