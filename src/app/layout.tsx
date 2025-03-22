import "./globals.css";

import type { Metadata } from "next";
import { Montserrat, Oxanium } from "next/font/google";

export const metadata: Metadata = {
	title: "Sistema de Inventário",
	description: "Sistema de gerenciamento de inventário",
};

const oxanium = Oxanium({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	variable: "--font-oxanium",
});

const montserrat = Montserrat({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	variable: "--font-montserrat",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${montserrat.variable} ${oxanium.variable}`}>
			<body>
				<header>
					<link rel="prefetch" href="/dashboard" as="document" />
				</header>
				{children}
			</body>
		</html>
	);
}
