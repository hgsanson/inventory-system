"use client";

import CompanyList from "@/components/companies/index";
import DashboardLayout from "@/components/dashboard-layout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CompaniesPage() {
	const router = useRouter();

	useEffect(() => {
		// Verificar autenticação de forma mais eficiente
		const checkAuth = () => {
			const isAuthenticated = localStorage.getItem("isAuthenticated");
			if (!isAuthenticated) {
				router.replace("/");
			}
		};

		// Executar apenas no cliente
		if (typeof window !== "undefined") {
			checkAuth();
		}
	}, [router]);

	return (
		<DashboardLayout>
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-6">Gerenciamento de Empresas</h1>
				<CompanyList />
			</div>
		</DashboardLayout>
	);
}
