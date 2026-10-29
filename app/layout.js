export const metadata={
  title: 'TAKTIK NEWS',
  manifest: '/manifest.json',
  themeColor: '#000000'
};

export default function RootLayout({children}){
  return <html lang="es"><body style={{margin:0}}>{children}</body></html>
}
