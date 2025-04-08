"use client";

import BranchList from "@/components/branches";
import DashboardLayout from "@/components/dashboard-layout";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function BranchesPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const companyId = searchParams.get("companyId");

	useEffect(() => {
		// Verificar autenticação
		const isAuthenticated = localStorage.getItem("isAuthenticated");
		if (!isAuthenticated) {
			router.push("/");
		}
	}, [router]);

	return (
		<DashboardLayout>
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-6">Gerenciamento de Filiais</h1>
				<BranchList initialCompanyFilter={companyId} />
			</div>
		</DashboardLayout>
	);
}
