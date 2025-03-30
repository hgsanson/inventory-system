import type { Product } from "../types/product.types"; // Ajuste o caminho conforme sua estrutura

export interface Filters {
	companyId?: string;
	delegationId?: string;
	branchId?: string;
	status?: string;
	acquisitionMonth?: string;
	maintenanceMonth?: string;
	category?: string;
	ageRange?: string;
	region?: string;
}

export function filterProducts(
	products: Product[],
	filters: Filters,
	calculateAgeInYears: (date: Date) => number,
): Product[] {
	let filtered = [...products];

	if (filters.companyId) {
		filtered = filtered.filter(
			(product) => product.companyId === filters.companyId,
		);
	}

	if (filters.delegationId) {
		filtered = filtered.filter(
			(product) => product.delegationId === filters.delegationId,
		);
	}

	if (filters.branchId) {
		filtered = filtered.filter(
			(product) => product.branchId === filters.branchId,
		);
	}

	if (filters.status) {
		filtered = filtered.filter((product) => product.status === filters.status);
	}

	if (filters.acquisitionMonth) {
		filtered = filtered.filter(
			(product) => product.acquisitionMonth === filters.acquisitionMonth,
		);
	}

	if (filters.maintenanceMonth) {
		filtered = filtered.filter((product) =>
			product.interventions.some((intervention) => {
				const interventionMonth = String(
					intervention.date.getMonth() + 1,
				).padStart(2, "0");
				return interventionMonth === filters.maintenanceMonth;
			}),
		);
	}

	if (filters.category) {
		filtered = filtered.filter(
			(product) => product.category === filters.category,
		);
	}

	if (filters.ageRange) {
		filtered = filtered.filter((product) => {
			const ageInYears = calculateAgeInYears(product.acquisitionDate);

			switch (filters.ageRange) {
				case "< 1 ano":
					return ageInYears < 1;
				case "1-2 anos":
					return ageInYears >= 1 && ageInYears < 2;
				case "2-3 anos":
					return ageInYears >= 2 && ageInYears < 3;
				case "3-4 anos":
					return ageInYears >= 3 && ageInYears < 4;
				case "4-5 anos":
					return ageInYears >= 4 && ageInYears < 5;
				case "> 5 anos":
					return ageInYears >= 5;
				default:
					return false;
			}
		});
	}

	if (filters.region) {
		const regionToDelegationMap: Record<string, string[]> = {
			Sudeste: ["1", "2", "3"],
			Sul: ["4"],
			Nordeste: ["5"],
			"Centro-Oeste": ["6"],
			Norte: ["7"],
		};

		const delegationIds = regionToDelegationMap[filters.region] || [];
		if (delegationIds.length > 0) {
			filtered = filtered.filter(
				(product) =>
					product.delegationId && delegationIds.includes(product.delegationId),
			);
		}
	}

	return filtered;
}
