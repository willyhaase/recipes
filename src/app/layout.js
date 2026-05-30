export const metadata = {
  title: 'GourmetWelt — Rezepte auf Deutsch & Français',
  description: 'Kulinarischer Rezeptkatalog mit automatischer Veröffentlichung / Catalogue de recettes avec publication automatique',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
