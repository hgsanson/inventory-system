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
import { Card } from "@/components/ui/card";
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
	Building2,
	ChevronRight,
	GitBranch,
	Package,
	Plus,
	Search,
	Trash2,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Tipo para a delegação
interface Delegation {
	id: string;
	name: string;
	branchCount: number;
	employeeCount: number;
	equipmentCount: number;
	region: string;
	manager: string;
	companyId?: string;
}

// Interface para as props
interface DelegationListProps {
	initialCompanyFilter?: string | null;
}

// Delegações de exemplo
const initialDelegations: Delegation[] = [
	{
		id: "1",
		name: "Delegação São Paulo Capital",
		branchCount: 15,
		employeeCount: 450,
		equipmentCount: 850,
		region: "Empresa 01",
		manager: "Ricardo Santos",
		companyId: "1",
	},
	{
		id: "2",
		name: "Delegação Rio de Janeiro",
		branchCount: 8,
		employeeCount: 280,
		equipmentCount: 520,
		region: "Empresa 02",
		manager: "Amanda Costa",
		companyId: "1",
	},
	{
		id: "3",
		name: "Delegação Belo Horizonte",
		branchCount: 6,
		employeeCount: 180,
		equipmentCount: 340,
		region: "Empresa 03",
		manager: "Carlos Mendes",
		companyId: "2",
	},
	{
		id: "4",
		name: "Delegação Porto Alegre",
		branchCount: 5,
		employeeCount: 150,
		equipmentCount: 280,
		region: "Empresa 04",
		manager: "Fernanda Lima",
		companyId: "3",
	},
	{
		id: "5",
		name: "Delegação Recife",
		branchCount: 4,
		employeeCount: 120,
		equipmentCount: 220,
		region: "Empresa 05",
		manager: "Paulo Oliveira",
		companyId: "2",
	},
];

export default function DelegationList({
	initialCompanyFilter = null,
}: DelegationListProps) {
	const router = useRouter();
	const [delegations, setDelegations] =
		useState<Delegation[]>(initialDelegations);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [delegationToDelete, setDelegationToDelete] = useState<string | null>(
		null,
	);
	const [searchTerm, setSearchTerm] = useState("");

	// Formulário para adicionar delegação
	const [newDelegation, setNewDelegation] = useState<Omit<Delegation, "id">>({
		name: "",
		branchCount: 0,
		employeeCount: 0,
		equipmentCount: 0,
		region: "",
		manager: "",
	});

	// Filtrar delegações com base na pesquisa
	const filteredDelegations = delegations.filter(
		(delegation) =>
			delegation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			delegation.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
			delegation.manager.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Aplicar filtro inicial por empresa
	useEffect(() => {
		if (initialCompanyFilter) {
			const filteredByCompany = initialDelegations.filter(
				(delegation) => delegation.companyId === initialCompanyFilter,
			);
			setDelegations(filteredByCompany);
		}
	}, [initialCompanyFilter]);

	const handleAddDelegation = () => {
		const delegation: Delegation = {
			id: Date.now().toString(),
			...newDelegation,
		};
		setDelegations([...delegations, delegation]);
		setIsAddDialogOpen(false);
		// Resetar o formulário
		setNewDelegation({
			name: "",
			branchCount: 0,
			employeeCount: 0,
			equipmentCount: 0,
			region: "",
			manager: "",
		});
	};

	const handleDeleteDelegation = (id: string) => {
		setDelegationToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = () => {
		if (delegationToDelete) {
			setDelegations(
				delegations.filter(
					(delegation) => delegation.id !== delegationToDelete,
				),
			);
			setIsDeleteDialogOpen(false);
			setDelegationToDelete(null);
		}
	};

	// Otimizar as funções de navegação
	const handleViewDelegationBranches = (delegationId: string) => {
		router.push(
			`/dashboard/empresas/${initialCompanyFilter || "1"}/delegacoes/${delegationId}`,
			undefined,
			{
				shallow: false,
			},
		);
	};

	const handleViewDelegationCollaborators = (delegationId: string) => {
		router.push(
			`/dashboard/colaboradores?delegationId=${delegationId}`,
			undefined,
			{ shallow: true },
		);
	};

	const handleViewDelegationEquipment = (delegationId: string) => {
		router.push(`/dashboard/produtos?delegationId=${delegationId}`, undefined, {
			shallow: true,
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
					<Input
						type="text"
						placeholder="Pesquisar delegações..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<Button onClick={() => setIsAddDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" /> Adicionar Delegação
				</Button>
			</div>

			<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				{filteredDelegations.length === 0 ? (
					<div className="col-span-full text-center py-10">
						<GitBranch className="mx-auto h-10 w-10 text-gray-400" />
						<h3 className="mt-2 text-sm font-semibold">
							Nenhuma delegação encontrada
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							Comece adicionando uma nova delegação ao sistema.
						</p>
					</div>
				) : (
					filteredDelegations.map((delegation) => (
						<Card key={delegation.id} className="overflow-hidden">
							<div className="p-4">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="text-lg font-semibold">{delegation.name}</h3>
										<p className="text-xs text-muted-foreground">
											Região: {delegation.region}
										</p>
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="text-red-500 hover:text-red-700 hover:bg-red-50"
										onClick={() => handleDeleteDelegation(delegation.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>

								<div className="mt-2 text-sm text-muted-foreground">
									<div className="flex items-center gap-1">
										<Users className="h-3.5 w-3.5" />
										<span>Gestor: {delegation.manager}</span>
									</div>
								</div>

								<div className="mt-2 grid grid-cols-3 gap-1 text-xs">
									<Button
										variant="ghost"
										size="sm"
										className="h-auto p-1 justify-start hover:bg-green-50"
										onClick={() => handleViewDelegationBranches(delegation.id)}
									>
										<Building2 className="h-3.5 w-3.5 text-green-500 mr-1" />
										<span>{delegation.branchCount}</span>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="h-auto p-1 justify-start hover:bg-purple-50"
										onClick={() =>
											handleViewDelegationCollaborators(delegation.id)
										}
									>
										<Users className="h-3.5 w-3.5 text-purple-500 mr-1" />
										<span>{delegation.employeeCount}</span>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="h-auto p-1 justify-start hover:bg-amber-50"
										onClick={() => handleViewDelegationEquipment(delegation.id)}
									>
										<Package className="h-3.5 w-3.5 text-amber-500 mr-1" />
										<span>{delegation.equipmentCount}</span>
									</Button>
								</div>
							</div>

							<div className="border-t p-2 bg-muted/30">
								<Button
									variant="ghost"
									size="sm"
									className="w-full justify-between text-sm"
									onClick={() => handleViewDelegationBranches(delegation.id)}
								>
									<span>Ver filiais</span>
									<ChevronRight className="h-3.5 w-3.5" />
								</Button>
							</div>
						</Card>
					))
				)}
			</div>

			{/* Dialog para adicionar delegação */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent
					className="overflow-y-auto max-h-[90vh]"
					onOpenAutoFocus={(e) => e.preventDefault()}
				>
					<DialogHeader>
						<DialogTitle>Adicionar Nova Delegação</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="name">Nome da Delegação</Label>
							<Input
								id="name"
								value={newDelegation.name}
								onChange={(e) =>
									setNewDelegation({ ...newDelegation, name: e.target.value })
								}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="branchCount">Quantidade de Filiais</Label>
								<Input
									id="branchCount"
									type="number"
									min="0"
									value={newDelegation.branchCount}
									onChange={(e) =>
										setNewDelegation({
											...newDelegation,
											branchCount: Number(e.target.value) || 0,
										})
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="employeeCount">
									Quantidade de Colaboradores
								</Label>
								<Input
									id="employeeCount"
									type="number"
									min="0"
									value={newDelegation.employeeCount}
									onChange={(e) =>
										setNewDelegation({
											...newDelegation,
											employeeCount: Number(e.target.value) || 0,
										})
									}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="equipmentCount">Quantidade de Equipamentos</Label>
							<Input
								id="equipmentCount"
								type="number"
								min="0"
								value={newDelegation.equipmentCount}
								onChange={(e) =>
									setNewDelegation({
										...newDelegation,
										equipmentCount: Number(e.target.value) || 0,
									})
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="region">Região</Label>
							<Input
								id="region"
								value={newDelegation.region}
								onChange={(e) =>
									setNewDelegation({ ...newDelegation, region: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="manager">Gestor Responsável</Label>
							<Input
								id="manager"
								value={newDelegation.manager}
								onChange={(e) =>
									setNewDelegation({
										...newDelegation,
										manager: e.target.value,
									})
								}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
							Cancelar
						</Button>
						<Button onClick={handleAddDelegation}>Adicionar</Button>
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
							Tem certeza que deseja excluir esta delegação? Esta ação não pode
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
}
