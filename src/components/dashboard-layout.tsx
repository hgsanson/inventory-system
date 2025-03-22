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
import { usePathname, useRouter } from "next/navigation"; // Importe usePathname
import { useEffect, useState } from "react";
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
		router.push("/");
	};

	const routes = [
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
	];

	// Prefetch all routes on mount
	useEffect(() => {
		const prefetchRoutes = async () => {
			for (const route of routes) {
				router.prefetch(route.path);
			}
			// Prefetch additional routes for Delegations and Branches
			router.prefetch("/dashboard/delegations");
			router.prefetch("/dashboard/branches");
		};
		prefetchRoutes();
	}, [router]);

	// Handle mouse over for prefetch
	const handleMouseOver = (path: string) => {
		router.prefetch(path);
	};

	// Highlight active route
	function getButtonClassName(path: string) {
		return pathname.startsWith(path) ? "border" : "text-gray-900";
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
							Patrilar
						</h2>
					</div>
					<nav className="flex-1 p-4 space-y-2">
						{/* Iterando sobre as rotas para criar os botões */}
						{routes.map((route) => (
							<Button
								key={route.path}
								variant="ghost"
								className={`w-full justify-start cursor-pointer ${getButtonClassName(route.path)}`}
								onClick={() => router.push(route.path)}
								onMouseOver={() => handleMouseOver(route.path)} // Prefetch on mouse over
							>
								{route.icon}
								{route.label}
							</Button>
						))}

						<Button
							aria-label="delegations button"
							variant="ghost"
							onMouseOver={() => handleMouseOver("/dashboard/delegations")} // Prefetch on mouse over
							className="w-full justify-start cursor-pointer"
						>
							<GitBranch className="mr-2 h-5 w-5" />
							Delegações
						</Button>

						<Button
							aria-label="branches list button"
							variant="ghost"
							onMouseOver={() => handleMouseOver("/dashboard/branches")} // Prefetch on mouse over
							className="w-full justify-start cursor-pointer"
						>
							<Network className="mr-2 h-5 w-5" />
							Filiais
						</Button>

						<Button
							aria-label="configuration button"
							variant="ghost"
							className="w-full justify-start cursor-pointer"
						>
							<Settings className="mr-2 h-5 w-5" />
							Configurações
						</Button>
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
