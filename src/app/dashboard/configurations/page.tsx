"use client";

import DashboardLayout from "@/components/dashboard-layout";
import PasswordChange from "@/components/password-change";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/user-management";
import { Key, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
	const router = useRouter();
	const [userRole, setUserRole] = useState<string>("admin"); // Simulando o papel do usuário atual

	useEffect(() => {
		// Verificar autenticação
		const isAuthenticated = localStorage.getItem("isAuthenticated");
		if (!isAuthenticated) {
			router.push("/");
		}

		// Em um sistema real, você buscaria o papel do usuário de uma API ou do localStorage
		// Aqui estamos apenas simulando
	}, [router]);

	return (
		<DashboardLayout>
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-6">Configurações</h1>

				<Tabs defaultValue="account" className="w-full">
					<TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none">
						<TabsTrigger value="account" className="flex items-center gap-2">
							<Key className="h-4 w-4" />
							<span>Minha Conta</span>
						</TabsTrigger>
						{userRole === "admin" && (
							<TabsTrigger value="users" className="flex items-center gap-2">
								<Users className="h-4 w-4" />
								<span>Usuários</span>
							</TabsTrigger>
						)}
					</TabsList>

					<TabsContent value="account" className="mt-6">
						<Card className="py-6">
							<CardHeader>
								<CardTitle>Alterar Senha</CardTitle>
								<CardDescription>
									Altere sua senha de acesso ao sistema.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<PasswordChange />
							</CardContent>
						</Card>
					</TabsContent>

					{userRole === "admin" && (
						<TabsContent value="users" className="mt-6">
							<Card>
								<CardHeader>
									<CardTitle>Gerenciamento de Usuários</CardTitle>
									<CardDescription>
										Adicione, edite ou remova usuários do sistema.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<UserManagement />
								</CardContent>
							</Card>
						</TabsContent>
					)}
				</Tabs>
			</div>
		</DashboardLayout>
	);
}
