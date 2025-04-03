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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Edit, Eye, EyeOff, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

// Tipos
interface User {
	id: string;
	name: string;
	email: string;
	role: "guest" | "moderator" | "admin";
	lastLogin?: Date;
}

// Mapeamento de papéis
const roleMap = {
	guest: {
		label: "Convidado",
		color: "bg-gray-500",
		description: "Somente leitura",
	},
	moderator: {
		label: "Moderador",
		color: "bg-blue-500",
		description: "Pode inserir novos dados",
	},
	admin: {
		label: "Administrador",
		color: "bg-green-500",
		description: "Acesso completo",
	},
};

// Usuários de exemplo
const initialUsers: User[] = [
	{
		id: "1",
		name: "Admin Principal",
		email: "admin@exemplo.com",
		role: "admin",
		lastLogin: new Date(2023, 11, 15, 10, 30),
	},
	{
		id: "2",
		name: "João Moderador",
		email: "joao@exemplo.com",
		role: "moderator",
		lastLogin: new Date(2023, 11, 10, 14, 45),
	},
	{
		id: "3",
		name: "Maria Convidada",
		email: "maria@exemplo.com",
		role: "guest",
		lastLogin: new Date(2023, 11, 5, 9, 15),
	},
];

export default function UserManagement() {
	const [users, setUsers] = useState<User[]>(initialUsers);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [userToEdit, setUserToEdit] = useState<User | null>(null);
	const [userToDelete, setUserToDelete] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	// Formulário para adicionar/editar usuário
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "guest" as "guest" | "moderator" | "admin",
	});

	// Filtrar usuários
	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleAddUser = () => {
		const newUser: User = {
			id: Date.now().toString(),
			name: formData.name,
			email: formData.email,
			role: formData.role,
		};

		setUsers([...users, newUser]);
		setIsAddDialogOpen(false);
		resetForm();
	};

	const handleEditUser = () => {
		if (userToEdit) {
			const updatedUsers = users.map((user) => {
				if (user.id === userToEdit.id) {
					return {
						...user,
						name: formData.name,
						email: formData.email,
						role: formData.role,
					};
				}
				return user;
			});

			setUsers(updatedUsers);
			setIsEditDialogOpen(false);
			setUserToEdit(null);
			resetForm();
		}
	};

	const handleDeleteUser = (id: string) => {
		setUserToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = () => {
		if (userToDelete) {
			setUsers(users.filter((user) => user.id !== userToDelete));
			setIsDeleteDialogOpen(false);
			setUserToDelete(null);
		}
	};

	const openEditDialog = (user: User) => {
		setUserToEdit(user);
		setFormData({
			name: user.name,
			email: user.email,
			password: "", // Não preenchemos a senha ao editar
			role: user.role,
		});
		setIsEditDialogOpen(true);
	};

	const resetForm = () => {
		setFormData({
			name: "",
			email: "",
			password: "",
			role: "guest",
		});
		setShowPassword(false);
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
					<Input
						type="text"
						placeholder="Pesquisar usuários..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<Button
					onClick={() => {
						resetForm();
						setIsAddDialogOpen(true);
					}}
				>
					<Plus className="mr-2 h-4 w-4" /> Adicionar Usuário
				</Button>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[250px]">Nome</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Nível de Acesso</TableHead>
							<TableHead>Último Acesso</TableHead>
							<TableHead className="text-right">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredUsers.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="h-24 text-center">
									Nenhum usuário encontrado
								</TableCell>
							</TableRow>
						) : (
							filteredUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell className="font-medium">{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										<Badge
											className={`${roleMap[user.role].color} hover:${roleMap[user.role].color}`}
										>
											{roleMap[user.role].label}
										</Badge>
										<div className="text-xs text-gray-500 mt-1">
											{roleMap[user.role].description}
										</div>
									</TableCell>
									<TableCell>
										{user.lastLogin ? (
											<div className="text-sm">
												{user.lastLogin.toLocaleDateString("pt-BR")} às{" "}
												{user.lastLogin.toLocaleTimeString("pt-BR", {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</div>
										) : (
											<div className="text-sm text-gray-500">Nunca acessou</div>
										)}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												variant="ghost"
												size="icon"
												className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
												onClick={() => openEditDialog(user)}
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-red-500 hover:text-red-700 hover:bg-red-50"
												onClick={() => handleDeleteUser(user.id)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Dialog para adicionar usuário */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="overflow-y-auto max-h-[90vh]">
					<DialogHeader>
						<DialogTitle>Adicionar Novo Usuário</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Nome Completo</Label>
							<Input
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Email</Label>
							<Input
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Senha</Label>
							<div className="relative">
								<Input
									type={showPassword ? "text" : "password"}
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-0 top-0 h-full"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>
						<div className="space-y-2">
							<Label>Nível de Acesso</Label>
							<Select
								value={formData.role}
								onValueChange={(value: "guest" | "moderator" | "admin") =>
									setFormData({ ...formData, role: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione o nível de acesso" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="guest">
										<div className="flex items-center gap-2">
											<Badge className="bg-gray-500">Convidado</Badge>
											<span className="text-xs text-gray-500">
												Somente leitura
											</span>
										</div>
									</SelectItem>
									<SelectItem value="moderator">
										<div className="flex items-center gap-2">
											<Badge className="bg-blue-500">Moderador</Badge>
											<span className="text-xs text-gray-500">
												Pode inserir novos dados
											</span>
										</div>
									</SelectItem>
									<SelectItem value="admin">
										<div className="flex items-center gap-2">
											<Badge className="bg-green-500">Administrador</Badge>
											<span className="text-xs text-gray-500">
												Acesso completo
											</span>
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
							Cancelar
						</Button>
						<Button onClick={handleAddUser}>Adicionar</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Dialog para editar usuário */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="overflow-y-auto max-h-[90vh]">
					<DialogHeader>
						<DialogTitle>Editar Usuário</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Nome Completo</Label>
							<Input
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Email</Label>
							<Input
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Nova Senha (deixe em branco para manter a atual)</Label>
							<div className="relative">
								<Input
									type={showPassword ? "text" : "password"}
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
									placeholder="••••••••"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-0 top-0 h-full"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>
						<div className="space-y-2">
							<Label>Nível de Acesso</Label>
							<Select
								value={formData.role}
								onValueChange={(value: "guest" | "moderator" | "admin") =>
									setFormData({ ...formData, role: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione o nível de acesso" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="guest">
										<div className="flex items-center gap-2">
											<Badge className="bg-gray-500">Convidado</Badge>
											<span className="text-xs text-gray-500">
												Somente leitura
											</span>
										</div>
									</SelectItem>
									<SelectItem value="moderator">
										<div className="flex items-center gap-2">
											<Badge className="bg-blue-500">Moderador</Badge>
											<span className="text-xs text-gray-500">
												Pode inserir novos dados
											</span>
										</div>
									</SelectItem>
									<SelectItem value="admin">
										<div className="flex items-center gap-2">
											<Badge className="bg-green-500">Administrador</Badge>
											<span className="text-xs text-gray-500">
												Acesso completo
											</span>
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsEditDialogOpen(false)}
						>
							Cancelar
						</Button>
						<Button onClick={handleEditUser}>Salvar Alterações</Button>
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
							Tem certeza que deseja excluir este usuário? Esta ação não pode
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
