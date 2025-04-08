"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import CollaboratorList from "../../../components/collaborators/index";

export default function CollaboratorsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const companyId = searchParams.get("companyId");
	const delegationId = searchParams.get("delegationId");
	const branchId = searchParams.get("branchId");

	useEffect(() => {
		// Otimizar a verificação de autenticação
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
				<h1 className="text-2xl font-bold mb-6">
					Gerenciamento de Colaboradores
				</h1>
				<CollaboratorList
					initialCompanyFilter={companyId}
					initialDelegationFilter={delegationId}
					initialBranchFilter={branchId}
				/>
			</div>
		</DashboardLayout>
	);
}
