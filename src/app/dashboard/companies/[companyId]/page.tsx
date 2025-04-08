"use client";

import CompanyDelegations from "@/components/companies/company-delegations";
import DashboardLayout from "@/components/dashboard-layout";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Building2, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Dados simulados de empresas
const companies = [
	{ id: "1", name: "Empresa 1" },
	{ id: "2", name: "Empresa 2" },
	{ id: "3", name: "Empresa 3" },
];

export default function CompanyDelegationsPage() {
	const router = useRouter();
	const params = useParams();
	const companyId = params.companyId as string;
	const [companyName, setCompanyName] = useState("");

	useEffect(() => {
		// Verificar autenticação
		const isAuthenticated = localStorage.getItem("isAuthenticated");
		if (!isAuthenticated) {
			router.push("/");
			return;
		}

		// Buscar nome da empresa
		const company = companies.find((c) => c.id === companyId);
		if (company) {
			setCompanyName(company.name);
		} else {
			// Empresa não encontrada, redirecionar para a lista de empresas
			router.push("/dashboard/companies");
		}
	}, [router, companyId]);

	return (
		<DashboardLayout>
			<div className="p-6">
				<div className="flex items-center gap-3 mb-6">
					<Building2 className="h-6 w-6 text-primary" />
					<h1 className="text-2xl font-bold">Delegações de {companyName}</h1>
				</div>

				<CompanyDelegations companyId={companyId} companyName={companyName} />
			</div>
		</DashboardLayout>
	);
}
