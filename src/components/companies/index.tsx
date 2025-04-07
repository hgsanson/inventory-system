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
import { useState } from "react";

// Tipo para a empresa
interface Company {
	id: string;
	name: string;
	cnpj: string;
	address: string;
	city: string;
	state: string;
	phone: string;
	email: string;
	website: string;
	delegationCount: number;
	branchCount: number;
	employeeCount: number;
	equipmentCount: number;
}

// Empresas de exemplo
const initialCompanies: Company[] = [
	{
		id: "1",
		name: "Empresa 1",
		cnpj: "",
		address: "Av. Paulista, 1000",
		city: "São Paulo",
		state: "SP",
		phone: "(11) 3333-4444",
		email: "contato@techsolutions.com",
		website: "www.techsolutions.com",
		delegationCount: 5,
		branchCount: 12,
		employeeCount: 450,
		equipmentCount: 850,
	},
	{
		id: "2",
		name: "Empresa XZ",
		cnpj: "",
		address: "Rua da Consolação, 500",
		city: "São Paulo",
		state: "SP",
		phone: "(11) 2222-3333",
		email: "contato@webdevinc.com",
		website: "www.webdevinc.com",
		delegationCount: 3,
		branchCount: 8,
		employeeCount: 280,
		equipmentCount: 520,
	},
	{
		id: "3",
		name: "Empresa X",
		cnpj: "",
		address: "Av. Rio Branco, 100",
		city: "Rio de Janeiro",
		state: "RJ",
		phone: "(21) 3333-4444",
		email: "contato@marketingpro.com",
		website: "www.marketingpro.com",
		delegationCount: 2,
		branchCount: 5,
		employeeCount: 180,
		equipmentCount: 340,
	},
];

export default function CompanyList() {
	const router = useRouter();
	const [companies, setCompanies] = useState<Company[]>(initialCompanies);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	// Formulário para adicionar empresa
	const [newCompany, setNewCompany] = useState<
		Omit<
			Company,
			| "id"
			| "delegationCount"
			| "branchCount"
			| "employeeCount"
			| "equipmentCount"
		>
	>({
		name: "",
		cnpj: "",
		address: "",
		city: "",
		state: "",
		phone: "",
		email: "",
		website: "",
	});

	// Filtrar empresas com base na pesquisa
	const filteredCompanies = companies.filter(
		(company) =>
			company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			company.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
			company.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
			company.state.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleAddCompany = () => {
		const company: Company = {
			id: Date.now().toString(),
			...newCompany,
			delegationCount: 0,
			branchCount: 0,
			employeeCount: 0,
			equipmentCount: 0,
		};
		setCompanies([...companies, company]);
		setIsAddDialogOpen(false);
		// Resetar o formulário
		setNewCompany({
			name: "",
			cnpj: "",
			address: "",
			city: "",
			state: "",
			phone: "",
			email: "",
			website: "",
		});
	};

	const handleDeleteCompany = (id: string) => {
		setCompanyToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = () => {
		if (companyToDelete) {
			setCompanies(
				companies.filter((company) => company.id !== companyToDelete),
			);
			setIsDeleteDialogOpen(false);
			setCompanyToDelete(null);
		}
	};

	// Otimizar as funções de navegação para usar shallow routing quando possível
	const handleViewDelegations = (companyId: string) => {
		router.push(`/dashboard/companies/${companyId}`, undefined, {
			shallow: false,
		});
	};

	const handleViewCompanyDelegations = (companyId: string) => {
		router.push(`/dashboard/companies/${companyId}`, undefined, {
			shallow: false,
		});
	};

	const handleViewCompanyBranches = (companyId: string) => {
		router.push(`/dashboard/branches?companyId=${companyId}`, undefined, {
			shallow: true,
		});
	};

	const handleViewCompanyCollaborators = (companyId: string) => {
		router.push(`/dashboard/collaborators?companyId=${companyId}`, undefined, {
			shallow: true,
		});
	};

	const handleViewCompanyEquipment = (companyId: string) => {
		router.push(`/dashboard/products?companyId=${companyId}`, undefined, {
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
						placeholder="Pesquisar empresas..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<Button onClick={() => setIsAddDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" /> Adicionar Empresa
				</Button>
			</div>

			<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				{filteredCompanies.length === 0 ? (
					<div className="col-span-full text-center py-10">
						<Building2 className="mx-auto h-10 w-10 text-gray-400" />
						<h3 className="mt-2 text-sm font-semibold">
							Nenhuma empresa encontrada
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							Comece adicionando uma nova empresa ao sistema.
						</p>
					</div>
				) : (
					filteredCompanies.map((company) => (
						<Card key={company.id} className="overflow-hidden">
							<div className="p-4">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="text-lg font-semibold">{company.name}</h3>
										<p className="text-xs text-muted-foreground">
											{company.cnpj}
										</p>
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="text-red-500 hover:text-red-700 hover:bg-red-50"
										onClick={() => handleDeleteCompany(company.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>

								<div className="mt-3 grid grid-cols-2 gap-1 text-xs">
									<Button
										variant="ghost"
										size="sm"
										className="h-auto p-1 justify-start hover:bg-blue-50"
										onClick={() => handleViewCompanyDelegations(company.id)}
									>
										<GitBranch className="h-3.5 w-3.5 text-blue-500 mr-1" />
										<span>{company.delegationCount} delegações</span>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="h-auto p-1 justify-start hover:bg-green-50"
										onClick={() => handleViewCompanyBranches(company.id)}
									>
										<Building2 className="h-3.5 w-3.5 text-green-500 mr-1" />
										<span>{company.branchCount} filiais</span>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="h-auto p-1 justify-start hover:bg-purple-50"
										onClick={() => handleViewCompanyCollaborators(company.id)}
									>
										<Users className="h-3.5 w-3.5 text-purple-500 mr-1" />
										<span>{company.employeeCount} colaboradores</span>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="h-auto p-1 justify-start hover:bg-amber-50"
										onClick={() => handleViewCompanyEquipment(company.id)}
									>
										<Package className="h-3.5 w-3.5 text-amber-500 mr-1" />
										<span>{company.equipmentCount} equipamentos</span>
									</Button>
								</div>
							</div>

							<div className="border-t p-2 bg-muted/30">
								<Button
									variant="ghost"
									size="sm"
									className="w-full justify-between text-sm"
									onClick={() => handleViewDelegations(company.id)}
								>
									<span>Ver delegações</span>
									<ChevronRight className="h-3.5 w-3.5" />
								</Button>
							</div>
						</Card>
					))
				)}
			</div>

			{/* Dialog para adicionar empresa */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="overflow-y-auto max-h-[90vh]">
					<DialogHeader>
						<DialogTitle>Adicionar Nova Empresa</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="name">Nome da Empresa</Label>
							<Input
								id="name"
								value={newCompany.name}
								onChange={(e) =>
									setNewCompany({ ...newCompany, name: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="cnpj">CNPJ</Label>
							<Input
								id="cnpj"
								value={newCompany.cnpj}
								onChange={(e) =>
									setNewCompany({ ...newCompany, cnpj: e.target.value })
								}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="address">Endereço</Label>
								<Input
									id="address"
									value={newCompany.address}
									onChange={(e) =>
										setNewCompany({ ...newCompany, address: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="city">Cidade</Label>
								<Input
									id="city"
									value={newCompany.city}
									onChange={(e) =>
										setNewCompany({ ...newCompany, city: e.target.value })
									}
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="state">Estado</Label>
								<Input
									id="state"
									value={newCompany.state}
									onChange={(e) =>
										setNewCompany({ ...newCompany, state: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">Telefone</Label>
								<Input
									id="phone"
									value={newCompany.phone}
									onChange={(e) =>
										setNewCompany({ ...newCompany, phone: e.target.value })
									}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={newCompany.email}
								onChange={(e) =>
									setNewCompany({ ...newCompany, email: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="website">Website</Label>
							<Input
								id="website"
								value={newCompany.website}
								onChange={(e) =>
									setNewCompany({ ...newCompany, website: e.target.value })
								}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
							Cancelar
						</Button>
						<Button onClick={handleAddCompany}>Adicionar</Button>
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
							Tem certeza que deseja excluir esta empresa? Esta ação não pode
							ser desfeita e removerá todas as delegações e filiais associadas.
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
