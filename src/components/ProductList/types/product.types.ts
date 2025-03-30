export type ProductStatus = "available" | "in_use" | "maintenance" | "lost";

export const monthDisplay: Record<string, string> = {
	"01": "Janeiro",
	"02": "Fevereiro",
	"03": "Março",
	"04": "Abril",
	"05": "Maio",
	"06": "Junho",
	"07": "Julho",
	"08": "Agosto",
	"09": "Setembro",
	"10": "Outubro",
	"11": "Novembro",
	"12": "Dezembro",
};

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

export const statusMap = {
	available: { label: "Disponível", color: "text-green-600" },
	in_use: { label: "Em uso", color: "text-blue-600" },
	maintenance: { label: "Manutenção", color: "text-yellow-600" },
	lost: { label: "Extraviado", color: "text-red-600" },
};

export const categoryMap = {
	computing: "Computação",
	network: "Rede",
	peripherals: "Periféricos",
	printing: "Impressão",
	monitoring: "Monitoramento",
	audio_video: "Áudio e Vídeo",
};
