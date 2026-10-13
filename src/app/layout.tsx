import './globals.css'

export const metadata = {
  title: 'Keramik Dinoyo',
  description:
    'Admin Dashboard Keramik Dinoyo Malang',
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}