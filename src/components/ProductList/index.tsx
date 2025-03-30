"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Label } from "recharts";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type {
	Intervention,
	Product,
	ProductListProps,
} from "./types/product.types";

import { cn } from "@/lib/utils";
import {
	CalendarIcon,
	CheckCircle2Icon,
	InfoIcon,
	Plus,
	Search,
	Trash2,
	WrenchIcon,
} from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Collapsible, CollapsibleTrigger } from "../ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { initialProducts } from "./mocks/productMocks";
import { categoryMap, monthDisplay, statusMap } from "./types/product.types";

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
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [productToDelete, setProductToDelete] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [isInterventionDialogOpen, setIsInterventionDialogOpen] =
		useState(false);
	const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
	const [productDetails, setProductDetails] = useState<Product | null>(null);
	const [filteredProducts, setFilteredProducts] =
		useState<Product[]>(initialProducts);

	// Atualizar o estado da nova intervenção para incluir os novos campos
	const [newIntervention, setNewIntervention] = useState<
		Omit<Intervention, "id">
	>({
		date: new Date(),
		description: "",
		technician: "",
		status: "",
		maintenanceType: "preventive",
		observations: "",
	});

	// Atualizar o estado do novo produto para incluir os novos campos
	const [newProduct, setNewProduct] = useState<
		Omit<
			Product,
			"id" | "interventions" | "companyId" | "delegationId" | "branchId"
		>
	>({
		status: "available",
		category: "computing",
		model: "",
		brand: "",
		partNumber: "",
		serialNumber: "",
		location: "",
		responsible: "",
		acquisitionDate: new Date(),
		warrantyLimit: new Date(),
	});

	// Atualizar o useEffect que aplica os filtros para incluir o novo filtro
	useEffect(() => {
		let filtered = [...initialProducts];

		if (initialCompanyFilter) {
			filtered = filtered.filter(
				(product) => product.companyId === initialCompanyFilter,
			);
		}

		if (initialDelegationFilter) {
			filtered = filtered.filter(
				(product) => product.delegationId === initialDelegationFilter,
			);
		}

		if (initialBranchFilter) {
			filtered = filtered.filter(
				(product) => product.branchId === initialBranchFilter,
			);
		}

		if (initialStatusFilter) {
			filtered = filtered.filter(
				(product) => product.status === initialStatusFilter,
			);
		}

		if (initialMonthFilter) {
			filtered = filtered.filter(
				(product) => product.acquisitionMonth === initialMonthFilter,
			);
		}

		if (initialMaintenanceMonthFilter) {
			filtered = filtered.filter((product) =>
				product.interventions.some((intervention) => {
					const interventionMonth = String(
						intervention.date.getMonth() + 1,
					).padStart(2, "0");
					return interventionMonth === initialMaintenanceMonthFilter;
				}),
			);
		}

		if (initialCategoryFilter) {
			filtered = filtered.filter(
				(product) => product.category === initialCategoryFilter,
			);
		}

		if (initialAgeFilter) {
			filtered = filtered.filter((product) => {
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

		if (initialRegionFilter) {
			// Mapear regiões para delegações
			const regionToDelegationMap: Record<string, string[]> = {
				Sudeste: ["1", "2", "3"], // IDs das delegações do Sudeste
				Sul: ["4"], // IDs das delegações do Sul
				Nordeste: ["5"], // IDs das delegações do Nordeste
				"Centro-Oeste": ["6"], // IDs das delegações do Centro-Oeste
				Norte: ["7"], // IDs das delegações do Norte
			};

			const delegationIds = regionToDelegationMap[initialRegionFilter] || [];
			if (delegationIds.length > 0) {
				filtered = filtered.filter(
					(product) =>
						product.delegationId &&
						delegationIds.includes(product.delegationId),
				);
			}
		}

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

	// Função auxiliar para calcular a idade em anos
	const calculateAgeInYears = (acquisitionDate: Date): number => {
		const today = new Date();
		const diffTime = Math.abs(today.getTime() - acquisitionDate.getTime());
		const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
		return diffYears;
	};

	// Filtrar produtos
	const searchFilteredProducts = filteredProducts.filter((product) =>
		Object.values(product).some(
			(value) =>
				value &&
				typeof value === "string" &&
				value.toLowerCase().includes(searchTerm.toLowerCase()),
		),
	);

	const toggleRow = (productId: string) => {
		const newExpandedRows = new Set(expandedRows);
		if (newExpandedRows.has(productId)) {
			newExpandedRows.delete(productId);
		} else {
			newExpandedRows.add(productId);
		}
		setExpandedRows(newExpandedRows);
	};

	const handleAddProduct = () => {
		const product: Product = {
			id: Date.now().toString(),
			...newProduct,
			interventions: [],
			companyId: initialCompanyFilter || undefined,
			delegationId: initialDelegationFilter || undefined,
			branchId: initialBranchFilter || undefined,
		};
		setProducts([...products, product]);
		setIsAddDialogOpen(false);
		resetNewProduct();
	};

	const handleDeleteProduct = (id: string) => {
		setProductToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = () => {
		if (productToDelete) {
			setProducts(products.filter((product) => product.id !== productToDelete));
			setIsDeleteDialogOpen(false);
			setProductToDelete(null);
		}
	};

	const handleAddIntervention = () => {
		if (selectedProduct) {
			const intervention: Intervention = {
				id: Date.now().toString(),
				...newIntervention,
			};

			const updatedProducts = products.map((product) => {
				if (product.id === selectedProduct.id) {
					return {
						...product,
						interventions: [...product.interventions, intervention],
					};
				}
				return product;
			});

			setProducts(updatedProducts);
			setIsInterventionDialogOpen(false);
			setNewIntervention({
				date: new Date(),
				description: "",
				technician: "",
				status: "",
				maintenanceType: "preventive",
				observations: "",
			});
		}
	};

	const openProductDetails = (product: Product) => {
		setProductDetails(product);
		setIsDetailsDialogOpen(true);
	};

	// Atualizar a função resetNewProduct para incluir os novos campos
	const resetNewProduct = () => {
		setNewProduct({
			status: "available",
			category: "computing",
			model: "",
			brand: "",
			partNumber: "",
			serialNumber: "",
			location: "",
			responsible: "",
			acquisitionDate: new Date(),
			warrantyLimit: new Date(),
		});
	};

	const statusDisplay: Record<string, string> = {
		available: "Disponível",
		in_use: "Em uso",
		maintenance: "Manutenção",
		lost: "Extraviado",
	};

	const statusColors: Record<string, string> = {
		available: "text-green-500",
		in_use: "text-blue-500",
		maintenance: "text-yellow-500",
		lost: "text-red-500",
	};

	return (
		<div className="space-y-6">
			{/* Adicionar exibição dos novos filtros na interface */}
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

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Status</TableHead>
							<TableHead>Categoria</TableHead>
							<TableHead>Modelo</TableHead>
							<TableHead>Marca</TableHead>
							<TableHead>Localização</TableHead>
							<TableHead>Responsável</TableHead>
							<TableHead>Aquisição</TableHead>
							<TableHead>Mês de Aquisição</TableHead>
							<TableHead>Intervenções</TableHead>
							<TableHead>Detalhes</TableHead>
							<TableHead className="text-right">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{searchFilteredProducts.map((product) => (
							<>
								<TableRow
									key={product.id}
									className="cursor-pointer hover:bg-gray-50"
								>
									<TableCell>
										<span
											className={cn(
												"font-medium",
												statusMap[product.status].color,
											)}
										>
											{statusMap[product.status].label}
										</span>
									</TableCell>
									<TableCell>{categoryMap[product.category]}</TableCell>
									<TableCell>{product.model}</TableCell>
									<TableCell>{product.brand}</TableCell>
									<TableCell>{product.location}</TableCell>
									<TableCell>{product.responsible}</TableCell>
									<TableCell>
										{format(product.acquisitionDate, "dd/MM/yyyy")}
									</TableCell>
									<TableCell>
										{monthDisplay[product.acquisitionMonth] ||
											product.acquisitionMonth}
										/{product.acquisitionYear}
									</TableCell>
									<TableCell>
										<Collapsible>
											<CollapsibleTrigger
												onClick={(e) => {
													e.stopPropagation();
													toggleRow(product.id);
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
												openProductDetails(product);
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
												handleDeleteProduct(product.id);
											}}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
								{expandedRows.has(product.id) && (
									<TableRow>
										<TableCell colSpan={10} className="bg-gray-50 p-4">
											<div className="space-y-4">
												<div className="flex justify-between items-center">
													<h4 className="text-sm font-semibold">
														Histórico de Intervenções
													</h4>
													<Button
														size="sm"
														onClick={() => {
															setSelectedProduct(product);
															setIsInterventionDialogOpen(true);
														}}
													>
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
																	<span className="text-gray-500">
																		Técnico: {intervention.technician}
																	</span>
																</div>
																<div className="mt-1 flex items-center gap-2">
																	<span className="font-medium">Tipo:</span>
																	<span
																		className={
																			intervention.maintenanceType ===
																			"preventive"
																				? "text-blue-500"
																				: "text-amber-500"
																		}
																	>
																		{intervention.maintenanceType ===
																		"preventive"
																			? "Preventiva"
																			: "Corretiva"}
																	</span>
																</div>
																<p className="mt-1">
																	<span className="font-medium">
																		Descrição:
																	</span>{" "}
																	{intervention.description}
																</p>
																<p className="mt-1">
																	<span className="font-medium">
																		Observações:
																	</span>{" "}
																	{intervention.observations}
																</p>
																<p className="mt-1 text-gray-500">
																	Status: {intervention.status}
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
						))}
					</TableBody>
				</Table>
			</div>

			{/* Dialog para adicionar produto */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="overflow-y-auto max-h-[90vh]">
					<DialogHeader>
						<DialogTitle>Adicionar Novo Produto</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Status</Label>
								<Select
									value={newProduct.status}
									onValueChange={(value: Product["status"]) =>
										setNewProduct({ ...newProduct, status: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecione o status" />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(statusMap).map(([value, { label }]) => (
											<SelectItem key={value} value={value}>
												{label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Categoria</Label>
								<Select
									value={newProduct.category}
									onValueChange={(value: Product["category"]) =>
										setNewProduct({ ...newProduct, category: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecione a categoria" />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(categoryMap).map(([value, label]) => (
											<SelectItem key={value} value={value}>
												{label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Modelo</Label>
								<Input
									value={newProduct.model}
									onChange={(e) =>
										setNewProduct({ ...newProduct, model: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Marca</Label>
								<Input
									value={newProduct.brand}
									onChange={(e) =>
										setNewProduct({ ...newProduct, brand: e.target.value })
									}
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Part Number</Label>
								<Input
									value={newProduct.partNumber}
									onChange={(e) =>
										setNewProduct({ ...newProduct, partNumber: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Serial Number</Label>
								<Input
									value={newProduct.serialNumber}
									onChange={(e) =>
										setNewProduct({
											...newProduct,
											serialNumber: e.target.value,
										})
									}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label>Localização</Label>
							<Input
								value={newProduct.location}
								onChange={(e) =>
									setNewProduct({ ...newProduct, location: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Responsável</Label>
							<Input
								value={newProduct.responsible}
								onChange={(e) =>
									setNewProduct({ ...newProduct, responsible: e.target.value })
								}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Data de Aquisição</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={"outline"}
											className={cn(
												"w-full justify-start text-left font-normal",
												!newProduct.acquisitionDate && "text-muted-foreground",
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{newProduct.acquisitionDate ? (
												format(newProduct.acquisitionDate, "dd/MM/yyyy")
											) : (
												<span>Selecione a data</span>
											)}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={newProduct.acquisitionDate}
											onSelect={(date) =>
												setNewProduct({
													...newProduct,
													acquisitionDate: date || new Date(),
												})
											}
											initialFocus
											locale={ptBR}
										/>
									</PopoverContent>
								</Popover>
							</div>
							<div className="space-y-2">
								<Label>Limite da Garantia</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={"outline"}
											className={cn(
												"w-full justify-start text-left font-normal",
												!newProduct.warrantyLimit && "text-muted-foreground",
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{newProduct.warrantyLimit ? (
												format(newProduct.warrantyLimit, "dd/MM/yyyy")
											) : (
												<span>Selecione a data</span>
											)}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={newProduct.warrantyLimit}
											onSelect={(date) =>
												setNewProduct({
													...newProduct,
													warrantyLimit: date || new Date(),
												})
											}
											initialFocus
											locale={ptBR}
										/>
									</PopoverContent>
								</Popover>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
							Cancelar
						</Button>
						<Button onClick={handleAddProduct}>Adicionar</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Dialog para adicionar intervenção */}
			<Dialog
				open={isInterventionDialogOpen}
				onOpenChange={setIsInterventionDialogOpen}
			>
				<DialogContent className="overflow-y-auto max-h-[90vh]">
					<DialogHeader>
						<DialogTitle>Adicionar Nova Intervenção</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Data</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={"outline"}
										className={cn(
											"w-full justify-start text-left font-normal",
											!newIntervention.date && "text-muted-foreground",
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{newIntervention.date ? (
											format(newIntervention.date, "dd/MM/yyyy")
										) : (
											<span>Selecione a data</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={newIntervention.date}
										onSelect={(date) =>
											setNewIntervention({
												...newIntervention,
												date: date || new Date(),
											})
										}
										initialFocus
										locale={ptBR}
									/>
								</PopoverContent>
							</Popover>
						</div>
						<div className="space-y-2">
							<Label>Tipo de Manutenção</Label>
							<Select
								value={newIntervention.maintenanceType}
								onValueChange={(value: "preventive" | "corrective") =>
									setNewIntervention({
										...newIntervention,
										maintenanceType: value,
									})
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione o tipo de manutenção" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="preventive">
										Manutenção Preventiva
									</SelectItem>
									<SelectItem value="corrective">
										Manutenção Corretiva
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Descrição</Label>
							<Input
								value={newIntervention.description}
								onChange={(e) =>
									setNewIntervention({
										...newIntervention,
										description: e.target.value,
									})
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Observações</Label>
							<Input
								value={newIntervention.observations}
								onChange={(e) =>
									setNewIntervention({
										...newIntervention,
										observations: e.target.value,
									})
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Técnico Responsável</Label>
							<Input
								value={newIntervention.technician}
								onChange={(e) =>
									setNewIntervention({
										...newIntervention,
										technician: e.target.value,
									})
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Status</Label>
							<Input
								value={newIntervention.status}
								onChange={(e) =>
									setNewIntervention({
										...newIntervention,
										status: e.target.value,
									})
								}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsInterventionDialogOpen(false)}
						>
							Cancelar
						</Button>
						<Button onClick={handleAddIntervention}>Adicionar</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Dialog para detalhes do produto */}
			<Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
				<DialogContent className="overflow-y-auto max-h-[90vh]">
					<DialogHeader>
						<DialogTitle>Detalhes do Produto</DialogTitle>
					</DialogHeader>

					{productDetails && (
						<div className="space-y-4 py-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="text-sm font-medium text-gray-500">Modelo</h3>
									<p className="mt-1 text-sm">{productDetails.model}</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-500">Marca</h3>
									<p className="mt-1 text-sm">{productDetails.brand}</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="text-sm font-medium text-gray-500">Status</h3>
									<p
										className={cn(
											"mt-1 text-sm font-medium",
											statusMap[productDetails.status].color,
										)}
									>
										{statusMap[productDetails.status].label}
									</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										Categoria
									</h3>
									<p className="mt-1 text-sm">
										{categoryMap[productDetails.category]}
									</p>
								</div>
							</div>

							<div className="border-t pt-4">
								<h3 className="text-sm font-medium text-gray-500 mb-2">
									Informações Técnicas
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<h4 className="text-xs font-medium text-gray-500">
											Part Number
										</h4>
										<p className="mt-1 text-sm font-mono">
											{productDetails.partNumber}
										</p>
									</div>
									<div>
										<h4 className="text-xs font-medium text-gray-500">
											Serial Number
										</h4>
										<p className="mt-1 text-sm font-mono">
											{productDetails.serialNumber}
										</p>
									</div>
								</div>
							</div>

							<div className="border-t pt-4">
								<h3 className="text-sm font-medium text-gray-500 mb-2">
									Localização e Responsável
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<h4 className="text-xs font-medium text-gray-500">
											Localização
										</h4>
										<p className="mt-1 text-sm">{productDetails.location}</p>
									</div>
									<div>
										<h4 className="text-xs font-medium text-gray-500">
											Responsável
										</h4>
										<p className="mt-1 text-sm">{productDetails.responsible}</p>
									</div>
								</div>
							</div>

							<div className="border-t pt-4">
								<h3 className="text-sm font-medium text-gray-500 mb-2">
									Datas
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<h4 className="text-xs font-medium text-gray-500">
											Data de Aquisição
										</h4>
										<p className="mt-1 text-sm">
											{format(productDetails.acquisitionDate, "dd/MM/yyyy")}
										</p>
									</div>
									<div>
										<h4 className="text-xs font-medium text-gray-500">
											Garantia até
										</h4>
										<p className="mt-1 text-sm">
											{format(productDetails.warrantyLimit, "dd/MM/yyyy")}
										</p>
									</div>
								</div>
							</div>

							<div className="border-t pt-4">
								<div className="flex justify-between items-center">
									<h3 className="text-sm font-medium text-gray-500">
										Intervenções
									</h3>
									<span className="text-sm text-gray-500">
										{productDetails.interventions.length} registros
									</span>
								</div>
							</div>
						</div>
					)}

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsDetailsDialogOpen(false)}
						>
							Fechar
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Dialog para confirmar exclusão */}
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
		</div>
	);
};
