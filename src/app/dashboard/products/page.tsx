"use client";

import DashboardLayout from "@/components/dashboard-layout";
/* import ProductList from "@/components/product-list"; */
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const companyId = searchParams.get("companyId");
	const delegationId = searchParams.get("delegationId");
	const branchId = searchParams.get("branchId");
	const status = searchParams.get("status");
	const month = searchParams.get("month");
	const maintenanceMonth = searchParams.get("maintenanceMonth");
	const category = searchParams.get("category");
	const age = searchParams.get("age");
	const region = searchParams.get("region");
	const [mounted, setMounted] = useState(false);

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
					Gerenciamento de Equipamentos
				</h1>
				{/* 				<ProductList
					initialCompanyFilter={companyId}
					initialDelegationFilter={delegationId}
					initialBranchFilter={branchId}
					initialStatusFilter={status}
					initialMonthFilter={month}
					initialMaintenanceMonthFilter={maintenanceMonth}
					initialCategoryFilter={category}
					initialAgeFilter={age}
					initialRegionFilter={region}
				/> */}
			</div>
		</DashboardLayout>
	);
}
