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
	MapPin,
	Package,
	Plus,
	Search,
	Trash2,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Tipo para a delegação
interface Delegation {
	id: string;
	companyId: string;
	name: string;
	region: string;
	manager: string;
	address: string;
	city: string;
	state: string;
	phone: string;
	email: string;
	branchCount: number;
	employeeCount: number;
	equipmentCount: number;
}

// Delegações de exemplo
const allDelegations: Delegation[] = [
	{
		id: "1",
		companyId: "1",
		name: "Delegação São Paulo Capital",
		region: "Sudeste",
		manager: "Ricardo Santos",
		address: "Av. Paulista, 1500",
		city: "São Paulo",
		state: "SP",
		phone: "(11) 3333-5555",
		email: "sp.capital@techsolutions.com",
		branchCount: 5,
		employeeCount: 180,
		equipmentCount: 350,
	},
	{
		id: "2",
		companyId: "1",
		name: "Delegação Rio de Janeiro",
		region: "Sudeste",
		manager: "Amanda Costa",
		address: "Av. Rio Branco, 500",
		city: "Rio de Janeiro",
		state: "RJ",
		phone: "(21) 3333-5555",
		email: "rj@techsolutions.com",
		branchCount: 3,
		employeeCount: 120,
		equipmentCount: 220,
	},
	{
		id: "3",
		companyId: "1",
		name: "Delegação Belo Horizonte",
		region: "Sudeste",
		manager: "Carlos Mendes",
		address: "Av. Afonso Pena, 1000",
		city: "Belo Horizonte",
		state: "MG",
		phone: "(31) 3333-5555",
		email: "bh@techsolutions.com",
		branchCount: 2,
		employeeCount: 80,
		equipmentCount: 150,
	},
	{
		id: "4",
		companyId: "1",
		name: "Delegação Porto Alegre",
		region: "Sul",
		manager: "Fernanda Lima",
		address: "Av. Borges de Medeiros, 800",
		city: "Porto Alegre",
		state: "RS",
		phone: "(51) 3333-5555",
		email: "poa@techsolutions.com",
		branchCount: 2,
		employeeCount: 70,
		equipmentCount: 130,
	},
	{
		id: "5",
		companyId: "2",
		name: "Delegação São Paulo",
		region: "Sudeste",
		manager: "Paulo Oliveira",
		address: "Rua Augusta, 500",
		city: "São Paulo",
		state: "SP",
		phone: "(11) 2222-4444",
		email: "sp@webdevinc.com",
		branchCount: 4,
		employeeCount: 150,
		equipmentCount: 280,
	},
	{
		id: "6",
		companyId: "2",
		name: "Delegação Curitiba",
		region: "Sul",
		manager: "Mariana Silva",
		address: "Rua XV de Novembro, 700",
		city: "Curitiba",
		state: "PR",
		phone: "(41) 2222-4444",
		email: "curitiba@webdevinc.com",
		branchCount: 2,
		employeeCount: 70,
		equipmentCount: 130,
	},
	{
		id: "7",
		companyId: "2",
		name: "Delegação Brasília",
		region: "Centro-Oeste",
		manager: "Roberto Alves",
		address: "SBS Quadra 2, Bloco A",
		city: "Brasília",
		state: "DF",
		phone: "(61) 2222-4444",
		email: "brasilia@webdevinc.com",
		branchCount: 2,
		employeeCount: 60,
		equipmentCount: 110,
	},
	{
		id: "8",
		companyId: "3",
		name: "Delegação Rio de Janeiro",
		region: "Sudeste",
		manager: "Juliana Costa",
		address: "Av. Atlântica, 1200",
		city: "Rio de Janeiro",
		state: "RJ",
		phone: "(21) 3333-4444",
		email: "rj@marketingpro.com",
		branchCount: 3,
		employeeCount: 100,
		equipmentCount: 180,
	},
	{
		id: "9",
		companyId: "3",
		name: "Delegação Salvador",
		region: "Nordeste",
		manager: "Thiago Santos",
		address: "Av. Tancredo Neves, 900",
		city: "Salvador",
		state: "BA",
		phone: "(71) 3333-4444",
		email: "salvador@marketingpro.com",
		branchCount: 2,
		employeeCount: 80,
		equipmentCount: 160,
	},
];

interface CompanyDelegationsProps {
	companyId: string;
	companyName: string;
}

export default function CompanyDelegations({
	companyId,
	companyName,
}: CompanyDelegationsProps) {
	const router = useRouter();
	const [delegations, setDelegations] = useState<Delegation[]>(
		allDelegations.filter((delegation) => delegation.companyId === companyId),
	);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [delegationToDelete, setDelegationToDelete] = useState<string | null>(
		null,
	);
	const [searchTerm, setSearchTerm] = useState("");

	// Formulário para adicionar delegação
	const [newDelegation, setNewDelegation] = useState<
		Omit<Delegation, "id" | "branchCount" | "employeeCount" | "equipmentCount">
	>({
		companyId,
		name: "",
		region: "",
		manager: "",
		address: "",
		city: "",
		state: "",
		phone: "",
		email: "",
	});

	// Filtrar delegações com base na pesquisa
	const filteredDelegations = delegations.filter(
		(delegation) =>
			delegation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			delegation.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
			delegation.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
			delegation.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
			delegation.state.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleAddDelegation = () => {
		const delegation: Delegation = {
			id: Date.now().toString(),
			...newDelegation,
			branchCount: 0,
			employeeCount: 0,
			equipmentCount: 0,
		};
		setDelegations([...delegations, delegation]);
		setIsAddDialogOpen(false);
		// Resetar o formulário
		setNewDelegation({
			companyId,
			name: "",
			region: "",
			manager: "",
			address: "",
			city: "",
			state: "",
			phone: "",
			email: "",
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

	const handleViewBranches = (delegationId: string) => {
		router.push(
			`/dashboard/companies/${companyId}/delegations/${delegationId}`,
		);
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
							Comece adicionando uma nova delegação para {companyName}.
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

								<div className="mt-2 space-y-1 text-xs">
									<div className="flex items-center gap-1">
										<MapPin className="h-3.5 w-3.5 text-gray-500" />
										<span>
											{delegation.city}/{delegation.state}
										</span>
									</div>
									<div className="flex items-center gap-1">
										<Users className="h-3.5 w-3.5 text-gray-500" />
										<span>Gestor: {delegation.manager}</span>
									</div>
								</div>

								<div className="mt-3 grid grid-cols-3 gap-2 text-xs">
									<div className="flex items-center gap-1">
										<Building2 className="h-3.5 w-3.5 text-green-500" />
										<span>{delegation.branchCount}</span>
									</div>
									<div className="flex items-center gap-1">
										<Users className="h-3.5 w-3.5 text-purple-500" />
										<span>{delegation.employeeCount}</span>
									</div>
									<div className="flex items-center gap-1">
										<Package className="h-3.5 w-3.5 text-amber-500" />
										<span>{delegation.equipmentCount}</span>
									</div>
								</div>
							</div>

							<div className="border-t p-2 bg-muted/30">
								<Button
									variant="ghost"
									size="sm"
									className="w-full justify-between text-sm"
									onClick={() => handleViewBranches(delegation.id)}
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
				<DialogContent className="overflow-y-auto max-h-[90vh]">
					<DialogHeader>
						<DialogTitle>
							Adicionar Nova Delegação para {companyName}
						</DialogTitle>
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
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="address">Endereço</Label>
								<Input
									id="address"
									value={newDelegation.address}
									onChange={(e) =>
										setNewDelegation({
											...newDelegation,
											address: e.target.value,
										})
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="city">Cidade</Label>
								<Input
									id="city"
									value={newDelegation.city}
									onChange={(e) =>
										setNewDelegation({ ...newDelegation, city: e.target.value })
									}
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="state">Estado</Label>
								<Input
									id="state"
									value={newDelegation.state}
									onChange={(e) =>
										setNewDelegation({
											...newDelegation,
											state: e.target.value,
										})
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">Telefone</Label>
								<Input
									id="phone"
									value={newDelegation.phone}
									onChange={(e) =>
										setNewDelegation({
											...newDelegation,
											phone: e.target.value,
										})
									}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={newDelegation.email}
								onChange={(e) =>
									setNewDelegation({ ...newDelegation, email: e.target.value })
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
							ser desfeita e removerá todas as filiais associadas.
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
