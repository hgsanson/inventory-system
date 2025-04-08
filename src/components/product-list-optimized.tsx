"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
	CheckCircle2Icon,
	InfoIcon,
	Plus,
	Search,
	Trash2,
	WrenchIcon,
} from "lucide-react";
import React, { useState, useCallback, useMemo } from "react";
import InterventionForm from "./intervention-form";
import ProductForm from "./product-form";

// Interfaces
interface Intervention {
	id: string;
	date: Date;
	description: string;
	technician: string;
	status: string;
	maintenanceType: "preventive" | "corrective";
	observations: string;
}

interface Product {
	id: string;
	status: "available" | "in_use" | "maintenance" | "lost";
	category:
		| "computing"
		| "network"
		| "peripherals"
		| "printing"
		| "monitoring"
		| "audio_video";
	model: string;
	brand: string;
	partNumber: string;
	serialNumber: string;
	location: string;
	responsible: string;
	acquisitionDate: Date;
	warrantyLimit: Date;
	interventions: Intervention[];
	companyId?: string;
	delegationId?: string;
	branchId?: string;
	acquisitionMonth?: string;
	acquisitionYear?: string;
	department?: string;
	companyName?: string;
	delegationName?: string;
	branchName?: string;
}

interface ProductListProps {
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

// Dados iniciais
const initialProducts: Product[] = [
	{
		id: "1",
		status: "in_use",
		category: "computing",
		model: "Latitude 5420",
		brand: "Dell",
		partNumber: "LAT-5420-01",
		serialNumber: "SN12345678",
		location: "Setor Financeiro - 2º Andar",
		responsible: "Maria Silva",
		acquisitionDate: new Date(2023, 0, 15),
		acquisitionMonth: "01",
		acquisitionYear: "2023",
		warrantyLimit: new Date(2026, 5, 15),
		interventions: [
			{
				id: "1",
				date: new Date(2024, 1, 10),
				description: "Troca de SSD",
				technician: "João Paulo",
				status: "Concluído",
				maintenanceType: "corrective",
				observations:
					"Cliente relatou lentidão no sistema. SSD substituído por um modelo de maior capacidade.",
			},
		],
		companyId: "1",
		delegationId: "1",
		branchId: "1",
		department: "Financeiro",
		companyName: "Empresa ABC",
		delegationName: "São Paulo Capital",
		branchName: "Unidade Centro",
	},
	{
		id: "2",
		status: "available",
		category: "network",
		model: "Catalyst 2960",
		brand: "Cisco",
		partNumber: "WS-C2960-24TC-L",
		serialNumber: "FOC1628Y4LT",
		location: "Almoxarifado TI",
		responsible: "Departamento TI",
		acquisitionDate: new Date(2023, 8, 20),
		acquisitionMonth: "09",
		acquisitionYear: "2023",
		warrantyLimit: new Date(2026, 8, 20),
		interventions: [],
		companyId: "1",
		delegationId: "2",
		branchId: "2",
		department: "TI",
		companyName: "Empresa ABC",
		delegationName: "Rio de Janeiro",
		branchName: "Unidade Barra",
	},
	{
		id: "3",
		status: "maintenance",
		category: "printing",
		model: "LaserJet Pro M404",
		brand: "HP",
		partNumber: "W1A52A",
		serialNumber: "VNB3R12345",
		location: "Setor Administrativo - 1º Andar",
		responsible: "Carlos Oliveira",
		acquisitionDate: new Date(2022, 3, 10),
		acquisitionMonth: "04",
		acquisitionYear: "2022",
		warrantyLimit: new Date(2025, 3, 10),
		interventions: [
			{
				id: "2",
				date: new Date(2024, 2, 15),
				description: "Substituição de toner",
				technician: "Ana Paula",
				status: "Concluído",
				maintenanceType: "preventive",
				observations:
					"Toner substituído durante manutenção preventiva programada.",
			},
			{
				id: "3",
				date: new Date(2024, 3, 20),
				description: "Reparo no fusor",
				technician: "Roberto Alves",
				status: "Em andamento",
				maintenanceType: "corrective",
				observations:
					"Equipamento apresentou falha ao imprimir. Fusor com desgaste excessivo.",
			},
		],
		companyId: "2",
		delegationId: "3",
		branchId: "3",
		department: "Administrativo",
		companyName: "Empresa XYZ",
		delegationName: "Belo Horizonte",
		branchName: "Unidade Savassi",
	},
];

// Mapeamentos
const statusMap = {
	available: { label: "Disponível", color: "text-green-600" },
	in_use: { label: "Em uso", color: "text-blue-600" },
	maintenance: { label: "Manutenção", color: "text-yellow-600" },
	lost: { label: "Extraviado", color: "text-red-600" },
};

const categoryMap = {
	computing: "Computação",
	network: "Rede",
	peripherals: "Periféricos",
	printing: "Impressão",
	monitoring: "Monitoramento",
	audio_video: "Áudio e Vídeo",
};

const monthDisplay: Record<string, string> = {
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

// Componente de filtro otimizado
const FilterDisplay = React.memo(
	({
		initialStatusFilter,
		initialMonthFilter,
		initialMaintenanceMonthFilter,
		initialCategoryFilter,
		initialAgeFilter,
		initialRegionFilter,
	}: {
		initialStatusFilter?: string | null;
		initialMonthFilter?: string | null;
		initialMaintenanceMonthFilter?: string | null;
		initialCategoryFilter?: string | null;
		initialAgeFilter?: string | null;
		initialRegionFilter?: string | null;
	}) => {
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
							<span
								className={
									statusMap[initialStatusFilter as keyof typeof statusMap]
										?.color || ""
								}
							>
								{statusMap[initialStatusFilter as keyof typeof statusMap]
									?.label || initialStatusFilter}
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
								{categoryMap[
									initialCategoryFilter as keyof typeof categoryMap
								] || initialCategoryFilter}
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
	},
);

FilterDisplay.displayName = "FilterDisplay";

// Componente de linha de produto otimizado
const ProductRow = React.memo(
	({
		product,
		isExpanded,
		onToggleExpand,
		onViewDetails,
		onDeleteProduct,
		onAddIntervention,
		onEditIntervention,
		onDeleteIntervention,
	}: {
		product: Product;
		isExpanded: boolean;
		onToggleExpand: () => void;
		onViewDetails: () => void;
		onDeleteProduct: () => void;
		onAddIntervention: () => void;
		onEditIntervention: (intervention: Intervention) => void;
		onDeleteIntervention: (interventionId: string) => void;
	}) => {
		return (
			<>
				<TableRow className="cursor-pointer hover:bg-gray-50">
					<TableCell>
						<span
							className={cn("font-medium", statusMap[product.status].color)}
						>
							{statusMap[product.status].label}
						</span>
					</TableCell>
					<TableCell>{categoryMap[product.category]}</TableCell>
					<TableCell>{product.model}</TableCell>
					<TableCell>{product.brand}</TableCell>
					<TableCell>
						<div className="flex flex-col">
							<span className="font-medium">
								{product.companyName || "N/A"}
							</span>
							<span className="text-sm text-muted-foreground">
								{product.delegationName || "N/A"}
							</span>
							<span className="text-xs text-muted-foreground">
								{product.branchName || "N/A"}
							</span>
						</div>
					</TableCell>
					<TableCell>{product.department || "N/A"}</TableCell>
					<TableCell>{product.responsible}</TableCell>
					<TableCell>{format(product.acquisitionDate, "dd/MM/yyyy")}</TableCell>
					<TableCell>
						<Collapsible>
							<CollapsibleTrigger
								onClick={(e) => {
									e.stopPropagation();
									onToggleExpand();
								}}
								className="hover:bg-gray-100 p-2 rounded-full"
							>
								{product.interventions.length > 0 ? (
									<CheckCircle2Icon className="h-5 w-5 text-green-500" />
								) : (
									<WrenchIcon className="h-5 w-5 text-gray-400" />
								)}
							</CollapsibleTrigger>
						</Collapsible>
					</TableCell>
					<TableCell>
						<Button
							variant="ghost"
							size="icon"
							className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
							onClick={(e) => {
								e.stopPropagation();
								onViewDetails();
							}}
						>
							<InfoIcon className="h-4 w-4" />
						</Button>
					</TableCell>
					<TableCell className="text-right">
						<Button
							variant="ghost"
							size="icon"
							className="text-red-500 hover:text-red-700 hover:bg-red-50"
							onClick={(e) => {
								e.stopPropagation();
								onDeleteProduct();
							}}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</TableCell>
				</TableRow>
				{isExpanded && (
					<TableRow>
						<TableCell colSpan={11} className="bg-gray-50 p-4">
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<h4 className="text-sm font-semibold">
										Histórico de Intervenções
									</h4>
									<Button size="sm" onClick={onAddIntervention}>
										<Plus className="mr-2 h-4 w-4" /> Nova Intervenção
									</Button>
								</div>
								{product.interventions.length === 0 ? (
									<p className="text-sm text-gray-500">
										Nenhuma intervenção registrada
									</p>
								) : (
									<div className="space-y-2">
										{product.interventions.map((intervention) => (
											<div
												key={intervention.id}
												className="bg-white p-3 rounded-md border text-sm"
											>
												<div className="flex justify-between">
													<span className="font-medium">
														{format(intervention.date, "dd/MM/yyyy")}
													</span>
													<div className="flex gap-2">
														<Button
															variant="ghost"
															size="sm"
															className="h-8 px-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
															onClick={() => onEditIntervention(intervention)}
														>
															Editar
														</Button>
														<Button
															variant="ghost"
															size="sm"
															className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
															onClick={() =>
																onDeleteIntervention(intervention.id)
															}
														>
															Excluir
														</Button>
													</div>
												</div>
												<div className="mt-1 flex items-center gap-2">
													<span className="font-medium">Tipo:</span>
													<span
														className={
															intervention.maintenanceType === "preventive"
																? "text-blue-500"
																: "text-amber-500"
														}
													>
														{intervention.maintenanceType === "preventive"
															? "Preventiva"
															: "Corretiva"}
													</span>
												</div>
												<p className="mt-1">
													<span className="font-medium">Descrição:</span>{" "}
													{intervention.description}
												</p>
												<p className="mt-1">
													<span className="font-medium">Observações:</span>{" "}
													{intervention.observations}
												</p>
												<p className="mt-1 text-gray-500">
													Status: {intervention.status}
												</p>
												<p className="mt-1 text-gray-500">
													Técnico: {intervention.technician}
												</p>
											</div>
										))}
									</div>
								)}
							</div>
						</TableCell>
					</TableRow>
				)}
			</>
		);
	},
);

ProductRow.displayName = "ProductRow";

// Componente de detalhes do produto otimizado
const ProductDetails = React.memo(({ product }: { product: Product }) => {
	return (
		<div className="space-y-4 py-4">
			<div className="grid grid-cols-2 gap-4">
				<div>
					<h3 className="text-sm font-medium text-gray-500">Modelo</h3>
					<p className="mt-1 text-sm">{product.model}</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-gray-500">Marca</h3>
					<p className="mt-1 text-sm">{product.brand}</p>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<h3 className="text-sm font-medium text-gray-500">Status</h3>
					<p
						className={cn(
							"mt-1 text-sm font-medium",
							statusMap[product.status].color,
						)}
					>
						{statusMap[product.status].label}
					</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-gray-500">Categoria</h3>
					<p className="mt-1 text-sm">{categoryMap[product.category]}</p>
				</div>
			</div>

			<div className="border-t pt-4">
				<h3 className="text-sm font-medium text-gray-500 mb-2">
					Informações Técnicas
				</h3>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<h4 className="text-xs font-medium text-gray-500">Part Number</h4>
						<p className="mt-1 text-sm font-mono">{product.partNumber}</p>
					</div>
					<div>
						<h4 className="text-xs font-medium text-gray-500">Serial Number</h4>
						<p className="mt-1 text-sm font-mono">{product.serialNumber}</p>
					</div>
				</div>
			</div>

			<div className="border-t pt-4">
				<h3 className="text-sm font-medium text-gray-500 mb-2">
					Localização e Responsável
				</h3>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<h4 className="text-xs font-medium text-gray-500">Localização</h4>
						<p className="mt-1 text-sm">{product.location}</p>
					</div>
					<div>
						<h4 className="text-xs font-medium text-gray-500">Responsável</h4>
						<p className="mt-1 text-sm">{product.responsible}</p>
					</div>
				</div>
			</div>

			<div className="border-t pt-4">
				<h3 className="text-sm font-medium text-gray-500 mb-2">Datas</h3>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<h4 className="text-xs font-medium text-gray-500">
							Data de Aquisição
						</h4>
						<p className="mt-1 text-sm">
							{format(product.acquisitionDate, "dd/MM/yyyy")}
						</p>
					</div>
					<div>
						<h4 className="text-xs font-medium text-gray-500">Garantia até</h4>
						<p className="mt-1 text-sm">
							{format(product.warrantyLimit, "dd/MM/yyyy")}
						</p>
					</div>
				</div>
			</div>

			<div className="border-t pt-4">
				<div className="flex justify-between items-center">
					<h3 className="text-sm font-medium text-gray-500">Intervenções</h3>
					<span className="text-sm text-gray-500">
						{product.interventions.length} registros
					</span>
				</div>
			</div>
		</div>
	);
});

ProductDetails.displayName = "ProductDetails";

// Componente principal otimizado
export default function ProductListOptimized({
	initialCompanyFilter = null,
	initialDelegationFilter = null,
	initialBranchFilter = null,
	initialStatusFilter = null,
	initialMonthFilter = null,
	initialMaintenanceMonthFilter = null,
	initialCategoryFilter = null,
	initialAgeFilter = null,
	initialRegionFilter = null,
}: ProductListProps) {
	// Estado principal
	const [products, setProducts] = useState<Product[]>([...initialProducts]);
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

	// Estados para modais
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [productToDelete, setProductToDelete] = useState<string | null>(null);
	const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
	const [productDetails, setProductDetails] = useState<Product | null>(null);
	const [isInterventionDialogOpen, setIsInterventionDialogOpen] =
		useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [isEditInterventionDialogOpen, setIsEditInterventionDialogOpen] =
		useState(false);
	const [interventionToEdit, setInterventionToEdit] =
		useState<Intervention | null>(null);
	const [isDeleteInterventionDialogOpen, setIsDeleteInterventionDialogOpen] =
		useState(false);
	const [interventionToDelete, setInterventionToDelete] = useState<{
		productId: string;
		interventionId: string;
	} | null>(null);

	// Função auxiliar para calcular a idade em anos
	const calculateAgeInYears = useCallback((acquisitionDate: Date): number => {
		const today = new Date();
		const diffTime = Math.abs(today.getTime() - acquisitionDate.getTime());
		const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
		return diffYears;
	}, []);

	// Filtrar produtos com base nos filtros e na pesquisa
	const filteredProducts = useMemo(() => {
		let result = [...products];

		// Aplicar filtros
		if (initialCompanyFilter) {
			result = result.filter(
				(product) => product.companyId === initialCompanyFilter,
			);
		}
		if (initialDelegationFilter) {
			result = result.filter(
				(product) => product.delegationId === initialDelegationFilter,
			);
		}
		if (initialBranchFilter) {
			result = result.filter(
				(product) => product.branchId === initialBranchFilter,
			);
		}
		if (initialStatusFilter) {
			result = result.filter(
				(product) => product.status === initialStatusFilter,
			);
		}
		if (initialMonthFilter) {
			result = result.filter(
				(product) => product.acquisitionMonth === initialMonthFilter,
			);
		}
		if (initialMaintenanceMonthFilter) {
			result = result.filter((product) =>
				product.interventions.some((intervention) => {
					const interventionMonth = String(
						intervention.date.getMonth() + 1,
					).padStart(2, "0");
					return interventionMonth === initialMaintenanceMonthFilter;
				}),
			);
		}
		if (initialCategoryFilter) {
			result = result.filter(
				(product) => product.category === initialCategoryFilter,
			);
		}
		if (initialAgeFilter) {
			result = result.filter((product) => {
				const ageInYears = calculateAgeInYears(product.acquisitionDate);
				if (initialAgeFilter === "< 1 ano" && ageInYears < 1) return true;
				if (
					initialAgeFilter === "1-2 anos" &&
					ageInYears >= 1 &&
					ageInYears < 2
				)
					return true;
				if (
					initialAgeFilter === "2-3 anos" &&
					ageInYears >= 2 &&
					ageInYears < 3
				)
					return true;
				if (
					initialAgeFilter === "3-4 anos" &&
					ageInYears >= 3 &&
					ageInYears < 4
				)
					return true;
				if (
					initialAgeFilter === "4-5 anos" &&
					ageInYears >= 4 &&
					ageInYears < 5
				)
					return true;
				if (initialAgeFilter === "> 5 anos" && ageInYears >= 5) return true;
				return false;
			});
		}

		// Aplicar pesquisa
		if (searchTerm) {
			result = result.filter((product) =>
				Object.values(product).some(
					(value) =>
						value &&
						typeof value === "string" &&
						value.toLowerCase().includes(searchTerm.toLowerCase()),
				),
			);
		}

		return result;
	}, [
		products,
		searchTerm,
		initialCompanyFilter,
		initialDelegationFilter,
		initialBranchFilter,
		initialStatusFilter,
		initialMonthFilter,
		initialMaintenanceMonthFilter,
		initialCategoryFilter,
		initialAgeFilter,
		initialRegionFilter,
		calculateAgeInYears,
	]);

	// Funções para manipular produtos
	const toggleRow = useCallback((productId: string) => {
		setExpandedRows((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(productId)) {
				newSet.delete(productId);
			} else {
				newSet.add(productId);
			}
			return newSet;
		});
	}, []);

	const handleAddProduct = useCallback(
		(
			newProduct: Omit<
				Product,
				"id" | "interventions" | "companyId" | "delegationId" | "branchId"
			>,
		) => {
			const product: Product = {
				id: Date.now().toString(),
				...newProduct,
				interventions: [],
				companyId: initialCompanyFilter || undefined,
				delegationId: initialDelegationFilter || undefined,
				branchId: initialBranchFilter || undefined,
			};

			setProducts((prev) => [...prev, product]);
			setIsAddDialogOpen(false);
		},
		[initialCompanyFilter, initialDelegationFilter, initialBranchFilter],
	);

	const handleDeleteProduct = useCallback((id: string) => {
		setProductToDelete(id);
		setIsDeleteDialogOpen(true);
	}, []);

	const confirmDelete = useCallback(() => {
		if (productToDelete) {
			setProducts((prev) =>
				prev.filter((product) => product.id !== productToDelete),
			);
			setIsDeleteDialogOpen(false);
			setProductToDelete(null);
		}
	}, [productToDelete]);

	// Funções para manipular intervenções
	const handleAddIntervention = useCallback(
		(productId: string) => {
			const product = products.find((p) => p.id === productId);
			if (product) {
				setSelectedProduct(product);
				setIsInterventionDialogOpen(true);
			}
		},
		[products],
	);

	const confirmAddIntervention = useCallback(
		(newIntervention: Omit<Intervention, "id">) => {
			if (selectedProduct) {
				const intervention = {
					id: Date.now().toString(),
					...newIntervention,
				};

				setProducts((prev) =>
					prev.map((product) => {
						if (product.id === selectedProduct.id) {
							return {
								...product,
								interventions: [...product.interventions, intervention],
							};
						}
						return product;
					}),
				);

				setIsInterventionDialogOpen(false);
				setSelectedProduct(null);
			}
		},
		[selectedProduct],
	);

	const handleEditIntervention = useCallback(
		(productId: string, intervention: Intervention) => {
			const product = products.find((p) => p.id === productId);
			if (product) {
				setSelectedProduct(product);
				setInterventionToEdit(intervention);
				setIsEditInterventionDialogOpen(true);
			}
		},
		[products],
	);

	const confirmEditIntervention = useCallback(
		(updatedIntervention: Intervention) => {
			if (selectedProduct && interventionToEdit) {
				setProducts((prev) =>
					prev.map((product) => {
						if (product.id === selectedProduct.id) {
							return {
								...product,
								interventions: product.interventions.map((intervention) =>
									intervention.id === updatedIntervention.id
										? updatedIntervention
										: intervention,
								),
							};
						}
						return product;
					}),
				);
				setIsEditInterventionDialogOpen(false);
				setSelectedProduct(null);
				setInterventionToEdit(null);
			}
		},
		[selectedProduct, interventionToEdit],
	);

	const handleDeleteIntervention = useCallback(
		(productId: string, interventionId: string) => {
			setInterventionToDelete({ productId, interventionId });
			setIsDeleteInterventionDialogOpen(true);
		},
		[],
	);

	const confirmDeleteIntervention = useCallback(() => {
		if (interventionToDelete) {
			setProducts((prev) =>
				prev.map((product) => {
					if (product.id === interventionToDelete.productId) {
						return {
							...product,
							interventions: product.interventions.filter(
								(intervention) =>
									intervention.id !== interventionToDelete.interventionId,
							),
						};
					}
					return product;
				}),
			);
			setIsDeleteInterventionDialogOpen(false);
			setInterventionToDelete(null);
		}
	}, [interventionToDelete]);

	const openProductDetails = useCallback((product: Product) => {
		setProductDetails(product);
		setIsDetailsDialogOpen(true);
	}, []);

	return (
		<div className="space-y-6">
			{/* Exibição de filtros ativos */}
			<FilterDisplay
				initialStatusFilter={initialStatusFilter}
				initialMonthFilter={initialMonthFilter}
				initialMaintenanceMonthFilter={initialMaintenanceMonthFilter}
				initialCategoryFilter={initialCategoryFilter}
				initialAgeFilter={initialAgeFilter}
				initialRegionFilter={initialRegionFilter}
			/>

			{/* Barra de pesquisa e botão de adicionar */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
					<Input
						type="text"
						placeholder="Pesquisar produtos..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<Button onClick={() => setIsAddDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" /> Adicionar Produto
				</Button>
			</div>

			{/* Tabela de produtos */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Status</TableHead>
							<TableHead>Categoria</TableHead>
							<TableHead>Modelo</TableHead>
							<TableHead>Marca</TableHead>
							<TableHead>Localização</TableHead>
							<TableHead>Departamento</TableHead>
							<TableHead>Responsável</TableHead>
							<TableHead>Aquisição</TableHead>
							<TableHead>Intervenções</TableHead>
							<TableHead>Detalhes</TableHead>
							<TableHead className="text-right">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredProducts.length === 0 ? (
							<TableRow>
								<TableCell colSpan={11} className="h-24 text-center">
									Nenhum produto encontrado
								</TableCell>
							</TableRow>
						) : (
							filteredProducts.map((product) => (
								<ProductRow
									key={product.id}
									product={product}
									isExpanded={expandedRows.has(product.id)}
									onToggleExpand={() => toggleRow(product.id)}
									onViewDetails={() => openProductDetails(product)}
									onDeleteProduct={() => handleDeleteProduct(product.id)}
									onAddIntervention={() => handleAddIntervention(product.id)}
									onEditIntervention={(intervention) =>
										handleEditIntervention(product.id, intervention)
									}
									onDeleteIntervention={(interventionId) =>
										handleDeleteIntervention(product.id, interventionId)
									}
								/>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Modais */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="overflow-y-auto max-h-[90vh]">
					<DialogHeader>
						<DialogTitle>Adicionar Novo Produto</DialogTitle>
					</DialogHeader>
					<ProductForm
						onSubmit={handleAddProduct}
						onCancel={() => setIsAddDialogOpen(false)}
					/>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
						<AlertDialogDescription>
							Tem certeza que deseja excluir este produto? Esta ação não pode
							ser desfeita.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-red-500 hover:bg-red-600"
						>
							Excluir
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
				<DialogContent className="overflow-y-auto max-h-[90vh]">
					<DialogHeader>
						<DialogTitle>Detalhes do Produto</DialogTitle>
					</DialogHeader>
					{productDetails && <ProductDetails product={productDetails} />}
					<div className="flex justify-end mt-4">
						<Button
							variant="outline"
							onClick={() => setIsDetailsDialogOpen(false)}
						>
							Fechar
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isInterventionDialogOpen}
				onOpenChange={setIsInterventionDialogOpen}
			>
				<DialogContent className="overflow-y-auto max-h-[90vh]">
					<DialogHeader>
						<DialogTitle>Adicionar Nova Intervenção</DialogTitle>
					</DialogHeader>
					<InterventionForm
						onSubmit={confirmAddIntervention}
						onCancel={() => setIsInterventionDialogOpen(false)}
					/>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isEditInterventionDialogOpen}
				onOpenChange={setIsEditInterventionDialogOpen}
			>
				<DialogContent className="overflow-y-auto max-h-[90vh]">
					<DialogHeader>
						<DialogTitle>Editar Intervenção</DialogTitle>
					</DialogHeader>
					{interventionToEdit && (
						<InterventionForm
							intervention={interventionToEdit}
							onSubmit={confirmEditIntervention}
							onCancel={() => setIsEditInterventionDialogOpen(false)}
						/>
					)}
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={isDeleteInterventionDialogOpen}
				onOpenChange={setIsDeleteInterventionDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Confirmar exclusão de intervenção
						</AlertDialogTitle>
						<AlertDialogDescription>
							Tem certeza que deseja excluir esta intervenção? Esta ação não
							pode ser desfeita.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDeleteIntervention}
							className="bg-red-500 hover:bg-red-600"
						>
							Excluir
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
