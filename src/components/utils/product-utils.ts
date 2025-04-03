/* import { regionToDelegationMap } from "../data/mappings"; */
import type { Product } from "../types/product.types";

export const calculateAgeInYears = (acquisitionDate: Date): number => {
	const today = new Date();
	const diffTime = Math.abs(today.getTime() - acquisitionDate.getTime());
	const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
	return diffYears;
};

export const filterProducts = (
	products: Product[],
	{
		companyFilter,
		delegationFilter,
		branchFilter,
		statusFilter,
		monthFilter,
		maintenanceMonthFilter,
		categoryFilter,
		ageFilter,
		regionFilter,
		searchTerm,
	}: {
		companyFilter?: string | null;
		delegationFilter?: string | null;
		branchFilter?: string | null;
		statusFilter?: string | null;
		monthFilter?: string | null;
		maintenanceMonthFilter?: string | null;
		categoryFilter?: string | null;
		ageFilter?: string | null;
		regionFilter?: string | null;
		searchTerm?: string;
	},
): Product[] => {
	let filtered = [...products];

	if (companyFilter) {
		filtered = filtered.filter(
			(product) => product.companyId === companyFilter,
		);
	}

	if (delegationFilter) {
		filtered = filtered.filter(
			(product) => product.delegationId === delegationFilter,
		);
	}

	if (branchFilter) {
		filtered = filtered.filter((product) => product.branchId === branchFilter);
	}

	if (statusFilter) {
		filtered = filtered.filter((product) => product.status === statusFilter);
	}

	if (monthFilter) {
		filtered = filtered.filter(
			(product) => product.acquisitionMonth === monthFilter,
		);
	}

	if (maintenanceMonthFilter) {
		filtered = filtered.filter((product) =>
			product.interventions.some((intervention) => {
				const interventionMonth = String(
					intervention.date.getMonth() + 1,
				).padStart(2, "0");
				return interventionMonth === maintenanceMonthFilter;
			}),
		);
	}

	if (categoryFilter) {
		filtered = filtered.filter(
			(product) => product.category === categoryFilter,
		);
	}

	if (ageFilter) {
		filtered = filtered.filter((product) => {
			const ageInYears = calculateAgeInYears(product.acquisitionDate);

			if (ageFilter === "< 1 ano" && ageInYears < 1) return true;
			if (ageFilter === "1-2 anos" && ageInYears >= 1 && ageInYears < 2)
				return true;
			if (ageFilter === "2-3 anos" && ageInYears >= 2 && ageInYears < 3)
				return true;
			if (ageFilter === "3-4 anos" && ageInYears >= 3 && ageInYears < 4)
				return true;
			if (ageFilter === "4-5 anos" && ageInYears >= 4 && ageInYears < 5)
				return true;
			if (ageFilter === "> 5 anos" && ageInYears >= 5) return true;

			return false;
		});
	}

	/* if (regionFilter) {
		const delegationIds = regionToDelegationMap[regionFilter] || [];
		if (delegationIds.length > 0) {
			filtered = filtered.filter(
				(product) =>
					product.delegationId && delegationIds.includes(product.delegationId),
			);
		}
	} */

	if (searchTerm) {
		filtered = filtered.filter((product) =>
			Object.values(product).some(
				(value) =>
					value &&
					typeof value === "string" &&
					value.toLowerCase().includes(searchTerm.toLowerCase()),
			),
		);
	}

	return filtered;
};
