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
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ChevronDown,
	ChevronRight,
	Package,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";

// Interfaces
interface Company {
	id: string;
	name: string;
}

interface Delegation {
	id: string;
	name: string;
	companyId: string;
}

interface Branch {
	id: string;
	name: string;
	delegationId: string;
}

interface Product {
	id: string;
	name: string;
	model: string;
	brand: string;
	category: string;
	status: string;
}

interface Collaborator {
	id: string;
	name: string;
	position: string;
	email: string;
	phone: string;
	companyId: string;
	delegationId: string;
	branchId: string;
	products: Product[];
}

// Adicionar o parâmetro initialCompanyFilter à interface de props
interface CollaboratorListProps {
	initialCompanyFilter?: string | null;
	initialDelegationFilter?: string | null;
	initialBranchFilter?: string | null;
}

// Dados de exemplo
const companies: Company[] = [
	{ id: "1", name: "Empresa 1" },
	{ id: "2", name: "Empresa 2" },
	{ id: "3", name: "Empresa 3" },
];

const delegations: Delegation[] = [
	{ id: "1", name: "Empresa 1", companyId: "1" },
	{ id: "2", name: "Empresa 1", companyId: "1" },
	{ id: "3", name: "Empresa 3", companyId: "2" },
];

const branches: Branch[] = [
	{ id: "1", name: "Empresa X", delegationId: "1" },
	{ id: "2", name: "Empresa Y", delegationId: "2" },
	{ id: "3", name: "Empresa Z", delegationId: "3" },
];

// Produtos de exemplo
const sampleProducts: Product[] = [
	{
		id: "1",
		name: "Notebook Dell",
		model: "Latitude 5420",
		brand: "Dell",
		category: "Computação",
		status: "Em uso",
	},
	{
		id: "2",
		name: "Monitor LG",
		model: "29WK600",
		brand: "LG",
		category: "Periféricos",
		status: "Em uso",
	},
	{
		id: "3",
		name: "iPhone",
		model: "13 Pro",
		brand: "Apple",
		category: "Comunicação",
		status: "Em uso",
	},
];

const initialCollaborators: Collaborator[] = [
	{
		id: "1",
		name: "Mónica Test",
		position: "Gerente de Vendas",
		email: "ana.silva@exemplo.com",
		phone: "(11) 98765-4321",
		companyId: "1",
		delegationId: "1",
		branchId: "1",
		products: [sampleProducts[0], sampleProducts[1]],
	},
	{
		id: "2",
		name: "Carlos Oliveira",
		position: "Desenvolvedor Frontend",
		email: "carlos.oliveira@exemplo.com",
		phone: "(21) 99876-5432",
		companyId: "2",
		delegationId: "3",
		branchId: "3",
		products: [sampleProducts[0]],
	},
	{
		id: "3",
		name: "Mariana Santos",
		position: "Gestor de Marketing",
		email: "mariana.santos@exemplo.com",
		phone: "(31) 97654-3210",
		companyId: "3",
		delegationId: "2",
		branchId: "2",
		products: [sampleProducts[0], sampleProducts[1], sampleProducts[2]],
	},
];

// Modificar a declaração da função para aceitar os novos parâmetros
export default function CollaboratorList({
	initialCompanyFilter = null,
	initialDelegationFilter = null,
	initialBranchFilter = null,
}: CollaboratorListProps) {
	const [collaborators, setCollaborators] =
		useState<Collaborator[]>(initialCollaborators);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [collaboratorToDelete, setCollaboratorToDelete] = useState<
		string | null
	>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

	// Estado para o formulário de novo colaborador
	const [newCollaborator, setNewCollaborator] = useState<
		Omit<Collaborator, "id" | "products">
	>({
		name: "",
		position: "",
		email: "",
		phone: "",
		companyId: "",
		delegationId: "",
		branchId: "",
	});

	// Filtrar colaboradores
	const filteredCollaborators = collaborators.filter(
		(collaborator) =>
			collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			collaborator.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
			collaborator.email.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const toggleRow = (collaboratorId: string) => {
		const newExpandedRows = new Set(expandedRows);
		if (newExpandedRows.has(collaboratorId)) {
			newExpandedRows.delete(collaboratorId);
		} else {
			newExpandedRows.add(collaboratorId);
		}
		setExpandedRows(newExpandedRows);
	};

	const getCompanyInfo = (collaborator: Collaborator) => {
		const company = companies.find((c) => c.id === collaborator.companyId);
		const delegation = delegations.find(
			(d) => d.id === collaborator.delegationId,
		);
		const branch = branches.find((b) => b.id === collaborator.branchId);

		return {
			company: company?.name || "",
			delegation: delegation?.name || "",
			branch: branch?.name || "",
		};
	};

	const handleAddCollaborator = () => {
		const collaborator: Collaborator = {
			id: Date.now().toString(),
			...newCollaborator,
			products: [],
		};
		setCollaborators([...collaborators, collaborator]);
		setIsAddDialogOpen(false);
		// Resetar o formulário
		setNewCollaborator({
			name: "",
			position: "",
			email: "",
			phone: "",
			companyId: "",
			delegationId: "",
			branchId: "",
		});
	};

	const handleDeleteCollaborator = (id: string) => {
		setCollaboratorToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = () => {
		if (collaboratorToDelete) {
			setCollaborators(
				collaborators.filter(
					(collaborator) => collaborator.id !== collaboratorToDelete,
				),
			);
			setIsDeleteDialogOpen(false);
			setCollaboratorToDelete(null);
		}
	};

	// Filtrar delegações baseado na empresa selecionada
	const getFilteredDelegations = (companyId: string) => {
		return delegations.filter(
			(delegation) => delegation.companyId === companyId,
		);
	};

	// Filtrar filiais baseado na delegação selecionada
	const getFilteredBranches = (delegationId: string) => {
		return branches.filter((branch) => branch.delegationId === delegationId);
	};

	// Adicionar um useEffect para aplicar os filtros iniciais
	useEffect(() => {
		let filtered = [...initialCollaborators];

		if (initialCompanyFilter) {
			filtered = filtered.filter(
				(collaborator) => collaborator.companyId === initialCompanyFilter,
			);
		}

		if (initialDelegationFilter) {
			filtered = filtered.filter(
				(collaborator) => collaborator.delegationId === initialDelegationFilter,
			);
		}

		if (initialBranchFilter) {
			filtered = filtered.filter(
				(collaborator) => collaborator.branchId === initialBranchFilter,
			);
		}

		if (
			initialCompanyFilter ||
			initialDelegationFilter ||
			initialBranchFilter
		) {
			setCollaborators(filtered);
		}
	}, [initialCompanyFilter, initialDelegationFilter, initialBranchFilter]);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
					<Input
						type="text"
						placeholder="Pesquisar colaboradores..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<Button onClick={() => setIsAddDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" /> Adicionar Colaborador
				</Button>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[250px]">Nome</TableHead>
							<TableHead>Cargo</TableHead>
							<TableHead className="w-[300px]">
								Empresa / Delegação / Filial
							</TableHead>
							<TableHead>Produtos</TableHead>
							<TableHead className="text-right">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredCollaborators.map((collaborator) => {
							const companyInfo = getCompanyInfo(collaborator);
							return (
								<React.Fragment key={collaborator.id}>
									<TableRow>
										<TableCell className="font-medium">
											<div>
												<div>{collaborator.name}</div>
												<div className="text-sm text-gray-500">
													{collaborator.email}
												</div>
											</div>
										</TableCell>
										<TableCell>{collaborator.position}</TableCell>
										<TableCell>
											<div className="space-y-1">
												<div className="font-medium">{companyInfo.company}</div>
												<div className="text-sm text-gray-500">
													{companyInfo.delegation}
												</div>
												<div className="text-sm text-gray-500">
													{companyInfo.branch}
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Collapsible>
												<CollapsibleTrigger asChild>
													<Button
														variant="ghost"
														size="sm"
														className="flex items-center gap-2 p-0 h-auto font-normal hover:bg-transparent"
														onClick={() => toggleRow(collaborator.id)}
													>
														<Package className="h-4 w-4" />
														<span>{collaborator.products.length} produtos</span>
														{expandedRows.has(collaborator.id) ? (
															<ChevronDown className="h-4 w-4" />
														) : (
															<ChevronRight className="h-4 w-4" />
														)}
													</Button>
												</CollapsibleTrigger>
											</Collapsible>
										</TableCell>
										<TableCell className="text-right">
											<Button
												variant="ghost"
												size="icon"
												className="text-red-500 hover:text-red-700 hover:bg-red-50"
												onClick={() =>
													handleDeleteCollaborator(collaborator.id)
												}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
									{expandedRows.has(collaborator.id) && (
										<TableRow>
											<TableCell colSpan={5} className="bg-gray-50 p-4">
												<div className="space-y-2">
													{collaborator.products.map((product) => (
														<div
															key={product.id}
															className="bg-white p-3 rounded-md border"
														>
															<div className="flex justify-between items-start">
																<div>
																	<div className="font-medium">
																		{product.name}
																	</div>
																	<div className="text-sm text-gray-500">
																		{product.brand} - {product.model}
																	</div>
																</div>
																<div className="text-sm text-gray-500">
																	{product.status}
																</div>
															</div>
														</div>
													))}
												</div>
											</TableCell>
										</TableRow>
									)}
								</React.Fragment>
							);
						})}
					</TableBody>
				</Table>
			</div>

			{/* Dialog para adicionar colaborador */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="overflow-y-auto max-h-[90vh]">
					<DialogHeader>
						<DialogTitle>Adicionar Novo Colaborador</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Nome Completo</Label>
							<Input
								value={newCollaborator.name}
								onChange={(e) =>
									setNewCollaborator({
										...newCollaborator,
										name: e.target.value,
									})
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Cargo</Label>
							<Input
								value={newCollaborator.position}
								onChange={(e) =>
									setNewCollaborator({
										...newCollaborator,
										position: e.target.value,
									})
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Email</Label>
							<Input
								type="email"
								value={newCollaborator.email}
								onChange={(e) =>
									setNewCollaborator({
										...newCollaborator,
										email: e.target.value,
									})
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Telefone</Label>
							<Input
								value={newCollaborator.phone}
								onChange={(e) =>
									setNewCollaborator({
										...newCollaborator,
										phone: e.target.value,
									})
								}
							/>
						</div>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label>Empresa</Label>
								<Select
									value={newCollaborator.companyId}
									onValueChange={(value) =>
										setNewCollaborator({
											...newCollaborator,
											companyId: value,
											delegationId: "",
											branchId: "",
										})
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecione uma empresa" />
									</SelectTrigger>
									<SelectContent>
										{companies.map((company) => (
											<SelectItem key={company.id} value={company.id}>
												{company.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							{newCollaborator.companyId && (
								<div className="space-y-2">
									<Label>Delegação</Label>
									<Select
										value={newCollaborator.delegationId}
										onValueChange={(value) =>
											setNewCollaborator({
												...newCollaborator,
												delegationId: value,
												branchId: "",
											})
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecione uma delegação" />
										</SelectTrigger>
										<SelectContent>
											{getFilteredDelegations(newCollaborator.companyId).map(
												(delegation) => (
													<SelectItem key={delegation.id} value={delegation.id}>
														{delegation.name}
													</SelectItem>
												),
											)}
										</SelectContent>
									</Select>
								</div>
							)}
							{newCollaborator.delegationId && (
								<div className="space-y-2">
									<Label>Filial</Label>
									<Select
										value={newCollaborator.branchId}
										onValueChange={(value) =>
											setNewCollaborator({
												...newCollaborator,
												branchId: value,
											})
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecione uma filial" />
										</SelectTrigger>
										<SelectContent>
											{getFilteredBranches(newCollaborator.delegationId).map(
												(branch) => (
													<SelectItem key={branch.id} value={branch.id}>
														{branch.name}
													</SelectItem>
												),
											)}
										</SelectContent>
									</Select>
								</div>
							)}
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
							Cancelar
						</Button>
						<Button onClick={handleAddCollaborator}>Adicionar</Button>
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
							Tem certeza que deseja excluir este colaborador? Esta ação não
							pode ser desfeita.
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
}
