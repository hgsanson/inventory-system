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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Building2,
	MapPin,
	Package,
	Plus,
	Search,
	Trash2,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Adicionar o parâmetro initialCompanyFilter à interface de props
interface BranchListProps {
	initialCompanyFilter?: string | null;
	initialDelegationFilter?: string | null;
}

// Modificar a declaração da função para aceitar o novo parâmetro
export default function BranchList({
	initialCompanyFilter = null,
	initialDelegationFilter = null,
}: BranchListProps) {
	const router = useRouter();

	// Adicionar um campo companyId ao tipo Branch
	interface Branch {
		id: string;
		name: string;
		country: string;
		city: string;
		delegation: string;
		companyId?: string;
		delegationId?: string;
		employeeCount: number;
		equipmentCount: number;
		address: string;
		phone: string;
	}

	// Modificar as filiais de exemplo para incluir companyId e delegationId
	const initialBranches: Branch[] = [
		{
			id: "1",
			name: "Filial Centro SP",
			country: "Brasil",
			city: "São Paulo",
			delegation: "Delegação São Paulo Capital",
			companyId: "1",
			delegationId: "1",
			employeeCount: 120,
			equipmentCount: 250,
			address: "Av. Paulista, 1000",
			phone: "(11) 3333-4444",
		},
		{
			id: "2",
			name: "Filial Copacabana",
			country: "Brasil",
			city: "Rio de Janeiro",
			delegation: "Delegação Rio de Janeiro",
			companyId: "1",
			delegationId: "2",
			employeeCount: 85,
			equipmentCount: 180,
			address: "Av. Atlântica, 500",
			phone: "(21) 2222-3333",
		},
		{
			id: "3",
			name: "Filial Savassi",
			country: "Brasil",
			city: "Belo Horizonte",
			delegation: "Delegação Belo Horizonte",
			companyId: "2",
			delegationId: "3",
			employeeCount: 65,
			equipmentCount: 140,
			address: "Rua Pernambuco, 1100",
			phone: "(31) 3333-4444",
		},
		{
			id: "4",
			name: "Filial Jardins",
			country: "Brasil",
			city: "São Paulo",
			delegation: "Delegação São Paulo Capital",
			companyId: "1",
			delegationId: "1",
			employeeCount: 95,
			equipmentCount: 210,
			address: "Rua Oscar Freire, 500",
			phone: "(11) 3333-5555",
		},
		{
			id: "5",
			name: "Filial Ipanema",
			country: "Brasil",
			city: "Rio de Janeiro",
			delegation: "Delegação Rio de Janeiro",
			companyId: "1",
			delegationId: "2",
			employeeCount: 75,
			equipmentCount: 160,
			address: "Rua Visconde de Pirajá, 300",
			phone: "(21) 2222-4444",
		},
		{
			id: "6",
			name: "Filial Funcionários",
			country: "Brasil",
			city: "Belo Horizonte",
			delegation: "Delegação Belo Horizonte",
			companyId: "2",
			delegationId: "3",
			employeeCount: 55,
			equipmentCount: 120,
			address: "Av. Getúlio Vargas, 800",
			phone: "(31) 3333-5555",
		},
	];

	const [branches, setBranches] = useState<Branch[]>(initialBranches);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [branchToDelete, setBranchToDelete] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	// Formulário para adicionar filial
	const [newBranch, setNewBranch] = useState<
		Omit<Branch, "id" | "companyId" | "delegationId">
	>({
		name: "",
		country: "",
		city: "",
		delegation: "",
		employeeCount: 0,
		equipmentCount: 0,
		address: "",
		phone: "",
	});

	// Lista de delegações (opções para o Select)
	const delegationOptions = [
		"Delegação São Paulo Capital",
		"Delegação Rio de Janeiro",
		"Delegação Belo Horizonte",
		"Delegação Porto Alegre",
		"Delegação Curitiba",
	];

	// Filtrar filiais com base na pesquisa
	const filteredBranches = branches.filter(
		(branch) =>
			branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
			branch.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
			branch.delegation.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleAddBranch = () => {
		const branch: Branch = {
			id: Date.now().toString(),
			companyId: initialCompanyFilter || "1",
			delegationId: initialDelegationFilter || "1",
			...newBranch,
		};
		setBranches([...branches, branch]);
		setIsAddDialogOpen(false);
		// Resetar o formulário
		setNewBranch({
			name: "",
			country: "",
			city: "",
			delegation: "",
			employeeCount: 0,
			equipmentCount: 0,
			address: "",
			phone: "",
		});
	};

	const handleDeleteBranch = (id: string) => {
		setBranchToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = () => {
		if (branchToDelete) {
			setBranches(branches.filter((branch) => branch.id !== branchToDelete));
			setIsDeleteDialogOpen(false);
			setBranchToDelete(null);
		}
	};

	const handleViewBranchCollaborators = (branchId: string) => {
		// Navegar para a página de colaboradores com filtro por filial
		router.push(`/dashboard/collaborators?branchId=${branchId}`);
	};

	// Modificar o handler para equipamentos para redirecionar para a página de produtos
	const handleViewBranchEquipment = (branchId: string) => {
		router.push(`/dashboard/products?branchId=${branchId}`);
	};

	// Adicionar um useEffect para aplicar o filtro inicial por empresa e/ou delegação
	useEffect(() => {
		let filtered = [...initialBranches];

		if (initialCompanyFilter) {
			filtered = filtered.filter(
				(branch) => branch.companyId === initialCompanyFilter,
			);
		}

		if (initialDelegationFilter) {
			filtered = filtered.filter(
				(branch) => branch.delegationId === initialDelegationFilter,
			);
		}

		if (initialCompanyFilter || initialDelegationFilter) {
			setBranches(filtered);
		}
	}, [initialCompanyFilter, initialDelegationFilter]);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
					<Input
						type="text"
						placeholder="Pesquisar filiais..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<Button onClick={() => setIsAddDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" /> Adicionar Filial
				</Button>
			</div>

			{/* Ajustar o grid para mostrar mais cards por linha */}
			<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				{filteredBranches.length === 0 ? (
					<div className="col-span-full text-center py-10">
						<Building2 className="mx-auto h-10 w-10 text-gray-400" />
						<h3 className="mt-2 text-sm font-semibold">
							Nenhuma filial encontrada
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							Comece adicionando uma nova filial ao sistema.
						</p>
					</div>
				) : (
					filteredBranches.map((branch) => (
						// Ajustar o padding interno dos cards e o espaçamento entre elementos
						<Card key={branch.id} className="overflow-hidden">
							<div className="p-4">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="text-lg font-semibold">{branch.name}</h3>
										<p className="text-xs text-muted-foreground">
											{branch.city}/{branch.country}
										</p>
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="text-red-500 hover:text-red-700 hover:bg-red-50"
										onClick={() => handleDeleteBranch(branch.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>

								<div className="mt-2 text-sm text-muted-foreground">
									<div className="flex items-center gap-1">
										<MapPin className="h-3.5 w-3.5" />
										<span>{branch.address}</span>
									</div>
									<div className="mt-1">
										<span>{branch.delegation}</span>
									</div>
								</div>

								<div className="mt-2 grid grid-cols-2 gap-1 text-xs">
									<Button
										variant="ghost"
										size="sm"
										className="h-auto p-1 justify-start hover:bg-purple-50"
										onClick={() => handleViewBranchCollaborators(branch.id)}
									>
										<Users className="h-3.5 w-3.5 text-purple-500 mr-1" />
										<span>{branch.employeeCount}</span>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="h-auto p-1 justify-start hover:bg-amber-50"
										onClick={() => handleViewBranchEquipment(branch.id)}
									>
										<Package className="h-3.5 w-3.5 text-amber-500 mr-1" />
										<span>{branch.equipmentCount}</span>
									</Button>
								</div>
							</div>
						</Card>
					))
				)}
			</div>

			{/* Dialog para adicionar filial */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent
					className="overflow-y-auto max-h-[90vh]"
					onOpenAutoFocus={(e) => e.preventDefault()}
				>
					<DialogHeader>
						<DialogTitle>Adicionar Nova Filial</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="name">Nome da Filial</Label>
							<Input
								id="name"
								value={newBranch.name}
								onChange={(e) =>
									setNewBranch({ ...newBranch, name: e.target.value })
								}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="country">País</Label>
								<Input
									id="country"
									value={newBranch.country}
									onChange={(e) =>
										setNewBranch({ ...newBranch, country: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="city">Cidade</Label>
								<Input
									id="city"
									value={newBranch.city}
									onChange={(e) =>
										setNewBranch({ ...newBranch, city: e.target.value })
									}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="delegation">Delegação</Label>
							<Select
								value={newBranch.delegation}
								onValueChange={(value) =>
									setNewBranch({ ...newBranch, delegation: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione uma delegação" />
								</SelectTrigger>
								<SelectContent>
									{delegationOptions.map((delegation) => (
										<SelectItem key={delegation} value={delegation}>
											{delegation}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="employeeCount">
									Quantidade de Colaboradores
								</Label>
								<Input
									id="employeeCount"
									type="number"
									min="0"
									value={newBranch.employeeCount}
									onChange={(e) =>
										setNewBranch({
											...newBranch,
											employeeCount: Number.parseInt(e.target.value) || 0,
										})
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="equipmentCount">
									Quantidade de Equipamentos
								</Label>
								<Input
									id="equipmentCount"
									type="number"
									min="0"
									value={newBranch.equipmentCount}
									onChange={(e) =>
										setNewBranch({
											...newBranch,
											equipmentCount: Number.parseInt(e.target.value) || 0,
										})
									}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="address">Endereço</Label>
							<Input
								id="address"
								value={newBranch.address}
								onChange={(e) =>
									setNewBranch({ ...newBranch, address: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="phone">Telefone</Label>
							<Input
								id="phone"
								value={newBranch.phone}
								onChange={(e) =>
									setNewBranch({ ...newBranch, phone: e.target.value })
								}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
							Cancelar
						</Button>
						<Button onClick={handleAddBranch}>Adicionar</Button>
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
							Tem certeza que deseja excluir esta filial? Esta ação não pode ser
							desfeita.
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
