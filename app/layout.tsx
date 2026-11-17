import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '空城計・西城情報局',
  description: '康軒六年級國語《空城計》閱讀理解軍師挑戰',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
