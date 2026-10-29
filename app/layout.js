export const metadata = {
  title: 'TAKTIK NEWS',
  manifest: '/manifest.json'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{margin:0, background:'#000'}}>{children}</body>
    </html>
  );
}
