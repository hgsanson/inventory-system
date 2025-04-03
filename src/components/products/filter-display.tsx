"use client";

import { categoryMap, monthDisplay, statusColors } from "../data/mappings";

interface FilterDisplayProps {
	initialStatusFilter?: string | null;
	initialMonthFilter?: string | null;
	initialMaintenanceMonthFilter?: string | null;
	initialCategoryFilter?: string | null;
	initialAgeFilter?: string | null;
	initialRegionFilter?: string | null;
}

export function FilterDisplay({
	initialStatusFilter,
	initialMonthFilter,
	initialMaintenanceMonthFilter,
	initialCategoryFilter,
	initialAgeFilter,
	initialRegionFilter,
}: FilterDisplayProps) {
	const statusDisplay: Record<string, string> = {
		available: "Disponível",
		in_use: "Em uso",
		maintenance: "Manutenção",
		lost: "Extraviado",
	};

	if (
		!initialStatusFilter &&
		!initialMonthFilter &&
		!initialMaintenanceMonthFilter &&
		!initialCategoryFilter &&
		!initialAgeFilter &&
		!initialRegionFilter
	) {
		return null;
	}

	return (
		<div className="p-4 border-b">
			<h2 className="text-lg font-medium">Lista de Equipamentos</h2>
			<div className="mt-2 text-sm space-y-1">
				{initialStatusFilter && (
					<div>
						Filtrando por status:{" "}
						<span className={statusColors[initialStatusFilter] || ""}>
							{statusDisplay[initialStatusFilter] || initialStatusFilter}
						</span>
					</div>
				)}
				{initialMonthFilter && (
					<div>
						Filtrando por mês de aquisição:{" "}
						<span className="font-medium">
							{monthDisplay[initialMonthFilter] || initialMonthFilter}
						</span>
					</div>
				)}
				{initialMaintenanceMonthFilter && (
					<div>
						Filtrando por mês de manutenção:{" "}
						<span className="font-medium">
							{monthDisplay[initialMaintenanceMonthFilter] ||
								initialMaintenanceMonthFilter}
						</span>
					</div>
				)}
				{initialCategoryFilter && (
					<div>
						Filtrando por categoria:{" "}
						<span className="font-medium">
							{categoryMap[initialCategoryFilter as keyof typeof categoryMap] ||
								initialCategoryFilter}
						</span>
					</div>
				)}
				{initialAgeFilter && (
					<div>
						Filtrando por idade:{" "}
						<span className="font-medium">{initialAgeFilter}</span>
					</div>
				)}
				{initialRegionFilter && (
					<div>
						Filtrando por região:{" "}
						<span className="font-medium">{initialRegionFilter}</span>
					</div>
				)}
			</div>
		</div>
	);
}
