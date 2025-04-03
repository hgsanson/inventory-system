export type ProductStatus = "available" | "in_use" | "maintenance" | "lost";

export type ProductCategory =
	| "computing"
	| "network"
	| "peripherals"
	| "printing"
	| "monitoring"
	| "audio_video";

export type MaintenanceType = "preventive" | "corrective";

export interface Intervention {
	id: string;
	date: Date;
	description: string;
	technician: string;
	status: string;
	maintenanceType: MaintenanceType;
	observations: string;
}

export interface Product {
	id: string;
	status: ProductStatus;
	category: ProductCategory;
	model: string;
	brand: string;
	partNumber: string;
	serialNumber: string;
	location: string;
	responsible: string;
	acquisitionDate: Date;
	warrantyLimit: Date;

	companyId?: string;
	delegationId?: string;
	branchId?: string;
	interventions: Intervention[];

	acquisitionMonth?: string;
	acquisitionYear?: string;
	department?: string;
	companyName?: string;
	delegationName?: string;
	branchName?: string;
}

export interface ProductListProps {
	initialCompanyFilter?: string | null;
	initialDelegationFilter?: string | null;
	initialBranchFilter?: string | null;
	initialStatusFilter?: string | null;
	initialMonthFilter?: string | null;
	initialMaintenanceMonthFilter?: string | null;
	initialCategoryFilter?: string | null;
	initialAgeFilter?: string | null;
	initialRegionFilter?: string | null;
}

export type NewIntervention = Omit<Intervention, "id">;
export type NewProduct = Omit<
	Product,
	"id" | "interventions" | "companyId" | "delegationId" | "branchId"
>;
