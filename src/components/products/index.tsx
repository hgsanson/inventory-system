"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useProducts } from "../hooks/use-products";
import type { ProductListProps } from "../types/product.types";
import type { Intervention } from "../types/product.types";
import { FilterDisplay } from "./filter-display";
import { AddInterventionModal } from "./modals/add-intervention-modal";
import { AddProductModal } from "./modals/add-product-modal";
import { DeleteInterventionModal } from "./modals/delete-intervention-modal";
import { DeleteProductModal } from "./modals/delete-product-modal";
import { EditInterventionModal } from "./modals/edit-intervention-modal";
import { ProductDetailsModal } from "./modals/product-details-modal";
import { ProductTable } from "./product-table";

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
	// Usar o hook personalizado para gerenciar produtos
	const {
		filteredProducts,
		searchTerm,
		setSearchTerm,
		expandedRows,
		toggleRow,
		addProduct,
		deleteProduct,
		addIntervention,
		updateIntervention,
		deleteIntervention,
	} = useProducts({
		initialCompanyFilter,
		initialDelegationFilter,
		initialBranchFilter,
		initialStatusFilter,
		initialMonthFilter,
		initialMaintenanceMonthFilter,
		initialCategoryFilter,
		initialAgeFilter,
		initialRegionFilter,
	});

	// Estados para controlar modais
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [productToDelete, setProductToDelete] = useState<string | null>(null);
	const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
	const [productDetails, setProductDetails] = useState<any>(null);
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

	// Handlers para produtos
	const handleDeleteProduct = (id: string) => {
		setProductToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const confirmDeleteProduct = () => {
		if (productToDelete) {
			deleteProduct(productToDelete);
			setIsDeleteDialogOpen(false);
			setProductToDelete(null);
		}
	};

	const handleViewProductDetails = (product: any) => {
		setProductDetails(product);
		setIsDetailsDialogOpen(true);
	};

	// Handlers para intervenções
	const handleAddIntervention = (productId: string) => {
		setSelectedProductId(productId);
		setIsInterventionDialogOpen(true);
	};

	const handleEditIntervention = (
		productId: string,
		intervention: Intervention,
	) => {
		setSelectedProductId(productId);
		setInterventionToEdit(intervention);
		setIsEditInterventionDialogOpen(true);
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
			deleteIntervention(
				interventionToDelete.productId,
				interventionToDelete.interventionId,
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
			<ProductTable
				products={filteredProducts}
				expandedRows={expandedRows}
				onToggleRow={toggleRow}
				onViewDetails={handleViewProductDetails}
				onDeleteProduct={handleDeleteProduct}
				onAddIntervention={handleAddIntervention}
				onEditIntervention={handleEditIntervention}
				onDeleteIntervention={handleDeleteIntervention}
			/>

			{/* Modais */}
			<AddProductModal
				open={isAddDialogOpen}
				onOpenChange={setIsAddDialogOpen}
				onAddProduct={addProduct}
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
				onAddIntervention={(newIntervention) => {
					if (selectedProductId) {
						addIntervention(selectedProductId, newIntervention);
					}
				}}
			/>

			<EditInterventionModal
				open={isEditInterventionDialogOpen}
				onOpenChange={setIsEditInterventionDialogOpen}
				intervention={interventionToEdit}
				onSaveIntervention={(updatedIntervention) => {
					if (selectedProductId && interventionToEdit) {
						updateIntervention(
							selectedProductId,
							interventionToEdit.id,
							updatedIntervention,
						);
					}
				}}
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
