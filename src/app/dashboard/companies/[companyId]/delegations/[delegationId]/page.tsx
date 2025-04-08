"use client";

import DashboardLayout from "@/components/dashboard-layout";
import DelegationBranches from "@/components/delegations/delegation-branches";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, GitBranch } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Dados simulados de empresas e delegações
const companies = [
	{ id: "1", name: "Empresa 1" },
	{ id: "2", name: "Empresa 2" },
	{ id: "3", name: "Empresa 3" },
];

const delegations = [
	{ id: "1", companyId: "1", name: "Delegação Empresa X" },
	{ id: "2", companyId: "1", name: "Delegação Empresa Y" },
	{ id: "3", companyId: "1", name: "Delegação Empresa Z" },
	{ id: "4", companyId: "1", name: "Delegação Empresa X" },
	{ id: "5", companyId: "2", name: "Delegação Empresa Y" },
	{ id: "6", companyId: "2", name: "Delegação Empresa Z" },
	{ id: "7", companyId: "2", name: "Delegação Empresa X" },
	{ id: "8", companyId: "3", name: "Delegação Empresa Y" },
	{ id: "9", companyId: "3", name: "Delegação Empresa Z" },
];

export default function DelegationBranchesPage() {
	const router = useRouter();
	const params = useParams();
	const companyId = params.companyId as string;
	const delegationId = params.delegationId as string;
	const [companyName, setCompanyName] = useState("");
	const [delegationName, setDelegationName] = useState("");

	useEffect(() => {
		// Verificar autenticação
		const isAuthenticated = localStorage.getItem("isAuthenticated");
		if (!isAuthenticated) {
			router.push("/");
			return;
		}

		// Buscar nome da empresa e delegação
		const company = companies.find((c) => c.id === companyId);
		const delegation = delegations.find(
			(d) => d.id === delegationId && d.companyId === companyId,
		);

		if (company && delegation) {
			setCompanyName(company.name);
			setDelegationName(delegation.name);
		} else {
			// Empresa ou delegação não encontrada, redirecionar
			router.push("/dashboard/companies");
		}
	}, [router, companyId, delegationId]);

	return (
		<DashboardLayout>
			<div className="p-6">
				<div className="flex items-center gap-3 mb-6">
					<GitBranch className="h-6 w-6 text-primary" />
					<h1 className="text-2xl font-bold">Filiais de {delegationName}</h1>
				</div>

				<DelegationBranches
					companyId={companyId}
					companyName={companyName}
					delegationId={delegationId}
					delegationName={delegationName}
				/>
			</div>
		</DashboardLayout>
	);
}
