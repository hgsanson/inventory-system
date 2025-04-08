"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialProducts } from "@/data/products";
import type { Intervention, NewIntervention } from "@/types/intervention";
import type { Product } from "@/types/product";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { FilterDisplay } from "./filter-display";
import { AddInterventionModal } from "./modals/add-intervention-modal";
import { AddProductModal } from "./modals/add-product-modal";
import { DeleteInterventionModal } from "./modals/delete-intervention-modal";
import { DeleteProductModal } from "./modals/delete-product-modal";
import { EditInterventionModal } from "./modals/edit-intervention-modal";
import { ProductDetailsModal } from "./modals/product-details-modal";
import { ProductTable } from "./product-table";

// Interface para as props
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

const ProductList = ({
	initialCompanyFilter = null,
	initialDelegationFilter = null,
	initialBranchFilter = null,
	initialStatusFilter = null,
	initialMonthFilter = null,
	initialMaintenanceMonthFilter = null,
	initialCategoryFilter = null,
	initialAgeFilter = null,
	initialRegionFilter = null,
}: ProductListProps) => {
	// Estados principais
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [filteredProducts, setFilteredProducts] =
		useState<Product[]>(initialProducts);
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
	const [selectedProductId, setSelectedProductId] = useState<string | null>(
		null,
	);
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

	// Aplicar filtros e pesquisa
	useEffect(() => {
		let result = [...products];
		W;
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

		setFilteredProducts(result);
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
	]);

	// Função auxiliar para calcular a idade em anos
	const calculateAgeInYears = (acquisitionDate: Date): number => {
		const today = new Date();
		const diffTime = Math.abs(today.getTime() - acquisitionDate.getTime());
		const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
		return diffYears;
	};

	// Funções para manipular produtos
	const toggleRow = (productId: string) => {
		const newExpandedRows = new Set(expandedRows);
		if (newExpandedRows.has(productId)) {
			newExpandedRows.delete(productId);
		} else {
			newExpandedRows.add(productId);
		}
		setExpandedRows(newExpandedRows);
	};

	const handleAddProduct = (
		newProduct: Omit<Product, "id" | "interventions">,
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
	};

	const handleDeleteProduct = (id: string) => {
		setProductToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const confirmDeleteProduct = () => {
		if (productToDelete) {
			setProducts((prev) =>
				prev.filter((product) => product.id !== productToDelete),
			);
			setIsDeleteDialogOpen(false);
			setProductToDelete(null);
		}
	};

	// Funções para manipular intervenções
	const handleAddIntervention = (productId: string) => {
		setSelectedProductId(productId);
		setIsInterventionDialogOpen(true);
	};

	const confirmAddIntervention = (newIntervention: NewIntervention) => {
		if (selectedProductId) {
			const intervention = {
				id: Date.now().toString(),
				...newIntervention,
			};

			setProducts((prev) =>
				prev.map((product) => {
					if (product.id === selectedProductId) {
						return {
							...product,
							interventions: [...product.interventions, intervention],
						};
					}
					return product;
				}),
			);

			setIsInterventionDialogOpen(false);
		}
	};

	const handleEditIntervention = (
		productId: string,
		intervention: Intervention,
	) => {
		setSelectedProductId(productId);
		setInterventionToEdit(intervention);
		setIsEditInterventionDialogOpen(true);
	};

	const confirmEditIntervention = (updatedIntervention: Intervention) => {
		if (selectedProductId && interventionToEdit) {
			setProducts((prev) =>
				prev.map((product) => {
					if (product.id === selectedProductId) {
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
		}
	};

	const handleDeleteIntervention = (
		productId: string,
		interventionId: string,
	) => {
		setInterventionToDelete({ productId, interventionId });
		setIsDeleteInterventionDialogOpen(true);
	};

	const confirmDeleteIntervention = () => {
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
	};

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
			{filteredProducts.length === 0 ? (
				<div className="text-center py-10 border rounded-md">
					<p className="text-gray-500">Nenhum produto encontrado.</p>
					{searchTerm && (
						<p className="text-sm text-gray-400 mt-2">
							Tente ajustar sua pesquisa ou remover os filtros aplicados.
						</p>
					)}
				</div>
			) : (
				<ProductTable
					products={filteredProducts}
					expandedRows={expandedRows}
					onToggleRow={toggleRow}
					onViewDetails={(product) => {
						setProductDetails(product);
						setIsDetailsDialogOpen(true);
					}}
					onDeleteProduct={handleDeleteProduct}
					onAddIntervention={handleAddIntervention}
					onEditIntervention={handleEditIntervention}
					onDeleteIntervention={handleDeleteIntervention}
				/>
			)}

			{/* Modais */}
			<AddProductModal
				open={isAddDialogOpen}
				onOpenChange={setIsAddDialogOpen}
				onAddProduct={handleAddProduct}
				initialCompanyFilter={initialCompanyFilter}
				initialDelegationFilter={initialDelegationFilter}
				initialBranchFilter={initialBranchFilter}
			/>

			<DeleteProductModal
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				onConfirmDelete={confirmDeleteProduct}
			/>

			<ProductDetailsModal
				open={isDetailsDialogOpen}
				onOpenChange={setIsDetailsDialogOpen}
				product={productDetails}
			/>

			<AddInterventionModal
				open={isInterventionDialogOpen}
				onOpenChange={setIsInterventionDialogOpen}
				onAddIntervention={confirmAddIntervention}
			/>

			<EditInterventionModal
				open={isEditInterventionDialogOpen}
				onOpenChange={setIsEditInterventionDialogOpen}
				intervention={interventionToEdit}
				onSaveIntervention={confirmEditIntervention}
			/>

			<DeleteInterventionModal
				open={isDeleteInterventionDialogOpen}
				onOpenChange={setIsDeleteInterventionDialogOpen}
				onConfirmDelete={confirmDeleteIntervention}
			/>
		</div>
	);
};

export default ProductList;
