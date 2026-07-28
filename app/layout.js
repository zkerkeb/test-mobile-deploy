import './globals.css';

export const metadata = {
  title: 'On mange quoi ?',
  description: 'Des idées de repas simples, rapides et partagées par la communauté.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
