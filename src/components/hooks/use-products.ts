"use client";

import { useEffect, useState } from "react";
import { initialProducts } from "../data/products";
import type { Intervention, NewIntervention } from "../types/product.types";
import type { Product } from "../types/product.types";
import { filterProducts } from "../utils/product-utils";

export const useProducts = ({
	initialCompanyFilter = null,
	initialDelegationFilter = null,
	initialBranchFilter = null,
	initialStatusFilter = null,
	initialMonthFilter = null,
	initialMaintenanceMonthFilter = null,
	initialCategoryFilter = null,
	initialAgeFilter = null,
	initialRegionFilter = null,
}: {
	initialCompanyFilter?: string | null;
	initialDelegationFilter?: string | null;
	initialBranchFilter?: string | null;
	initialStatusFilter?: string | null;
	initialMonthFilter?: string | null;
	initialMaintenanceMonthFilter?: string | null;
	initialCategoryFilter?: string | null;
	initialAgeFilter?: string | null;
	initialRegionFilter?: string | null;
}) => {
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
	const [filteredProducts, setFilteredProducts] =
		useState<Product[]>(initialProducts);

	// Atualizar o useEffect que aplica os filtros
	useEffect(() => {
		const filtered = filterProducts(initialProducts, {
			companyFilter: initialCompanyFilter,
			delegationFilter: initialDelegationFilter,
			branchFilter: initialBranchFilter,
			statusFilter: initialStatusFilter,
			monthFilter: initialMonthFilter,
			maintenanceMonthFilter: initialMaintenanceMonthFilter,
			categoryFilter: initialCategoryFilter,
			ageFilter: initialAgeFilter,
			regionFilter: initialRegionFilter,
		});
		setFilteredProducts(filtered);
	}, [
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

	// Filtrar produtos por termo de pesquisa
	const searchFilteredProducts = filterProducts(filteredProducts, {
		searchTerm,
	});

	const toggleRow = (productId: string) => {
		const newExpandedRows = new Set(expandedRows);
		if (newExpandedRows.has(productId)) {
			newExpandedRows.delete(productId);
		} else {
			newExpandedRows.add(productId);
		}
		setExpandedRows(newExpandedRows);
	};

	const addProduct = (newProduct: Omit<Product, "id" | "interventions">) => {
		const product: Product = {
			id: Date.now().toString(),
			...newProduct,
			interventions: [],
		};
		setProducts([...products, product]);
		return product;
	};

	const deleteProduct = (productId: string) => {
		setProducts(products.filter((product) => product.id !== productId));
	};

	const addIntervention = (
		productId: string,
		newIntervention: NewIntervention,
	) => {
		const intervention: Intervention = {
			id: Date.now().toString(),
			...newIntervention,
		};

		const updatedProducts = products.map((product) => {
			if (product.id === productId) {
				return {
					...product,
					interventions: [...product.interventions, intervention],
				};
			}
			return product;
		});

		setProducts(updatedProducts);
		return intervention;
	};

	const updateIntervention = (
		productId: string,
		interventionId: string,
		updatedIntervention: Intervention,
	) => {
		const updatedProducts = products.map((product) => {
			if (product.id === productId) {
				return {
					...product,
					interventions: product.interventions.map((intervention) =>
						intervention.id === interventionId
							? updatedIntervention
							: intervention,
					),
				};
			}
			return product;
		});

		setProducts(updatedProducts);
	};

	const deleteIntervention = (productId: string, interventionId: string) => {
		const updatedProducts = products.map((product) => {
			if (product.id === productId) {
				return {
					...product,
					interventions: product.interventions.filter(
						(intervention) => intervention.id !== interventionId,
					),
				};
			}
			return product;
		});

		setProducts(updatedProducts);
	};

	return {
		products,
		filteredProducts: searchFilteredProducts,
		searchTerm,
		setSearchTerm,
		expandedRows,
		toggleRow,
		addProduct,
		deleteProduct,
		addIntervention,
		updateIntervention,
		deleteIntervention,
	};
};
