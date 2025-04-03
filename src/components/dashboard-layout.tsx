"use client";

import {
	Building2,
	GitBranch,
	LayoutDashboard,
	LogOut,
	Menu,
	Network,
	Package,
	Settings,
	Users,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Importe usePathname
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";

interface DashboardLayoutProps {
	children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const router = useRouter();
	const pathname = usePathname(); // Use o hook usePathname para obter o caminho atual
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Logout user
	const handleLogout = () => {
		localStorage.removeItem("isAuthenticated");
		router.replace("/");
	};

	const routes = useMemo(
		() => [
			{
				path: "/dashboard",
				label: "Dashboard",
				icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
			},
			{
				path: "/dashboard/products",
				label: "Produtos",
				icon: <Package className="mr-2 h-5 w-5" />,
			},
			{
				path: "/dashboard/collaborators",
				label: "Colaboradores",
				icon: <Users className="mr-2 h-5 w-5" />,
			},
			{
				path: "/dashboard/companies",
				label: "Empresas",
				icon: <Building2 className="mr-2 h-5 w-5" />,
			},
			{
				path: "/dashboard/delegations",
				label: "Delegações",
				icon: <GitBranch className="mr-2 h-5 w-5" />,
			},
			{
				path: "/dashboard/branches",
				label: "Filiais",
				icon: <Network className="mr-2 h-5 w-5" />,
			},
			{
				path: "/dashboard/configurations",
				label: "Configurações",
				icon: <Settings className="mr-2 h-5 w-5" />,
			},
		],
		[],
	);

	// Handle mouse over for prefetch
	const handleMouseOver = (path: string) => {
		router.prefetch(path);
	};

	// Highlight active route
	function getButtonClassName(path: string) {
		return pathname === path || pathname.startsWith(`${path}/`)
			? "border border-blue-500 text-blue-700 bg-blue-100"
			: "text-gray-900 hover:bg-gray-100";
	}

	return (
		<div className="flex h-screen bg-background">
			{/* Mobile sidebar toggle */}
			<div className="lg:hidden fixed top-4 left-4 z-50">
				<Button
					variant="outline"
					size="icon"
					onClick={() => setSidebarOpen(!sidebarOpen)}
				>
					{sidebarOpen ? <X size={20} /> : <Menu size={20} />}
				</Button>
			</div>

			{/* Sidebar */}
			<div
				className={`fixed inset-y-0 left-0 z-40 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex flex-col h-full">
					<div className="p-4 border-b bg-blue-800">
						<h2 className="text-xl font-bold text-zinc-50 text-center">
							CompanyX
						</h2>
					</div>
					<nav className="flex-1 p-4 space-y-2">
						{/* Iterando sobre as rotas para criar os botões */}
						{routes.map(({ path, label, icon }) => (
							<Link key={path} href={path} passHref>
								<Button
									variant="ghost"
									className={`w-full justify-start cursor-pointer ${getButtonClassName(path)}`}
									onMouseOver={() => handleMouseOver(path)} // Prefetch on mouse over
									onFocus={() => handleMouseOver(path)} // Accessbility
								>
									{icon}
									{label}
								</Button>
							</Link>
						))}
					</nav>
					<div className="p-4 border-t">
						<Button
							variant="outline"
							className="w-full justify-start cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
							onClick={handleLogout}
						>
							<LogOut className="mr-2 h-5 w-5" />
							Sair
						</Button>
					</div>
				</div>
			</div>

			{/* Overlay for mobile */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
					onClick={() => setSidebarOpen(false)}
					onKeyDown={(e) => {
						if (e.key === "Escape" || e.key === "Enter") setSidebarOpen(false);
					}}
					role="button"
					tabIndex={0} // Permite que o elemento seja focável
				/>
			)}

			{/* Main content */}
			<div className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
				<div className="p-4">{children}</div>
			</div>
		</div>
	);
}
