"use client";

import DashboardLayout from "@/components/dashboard-layout";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Activity,
	Building2,
	GitBranch,
	Network,
	Package,
	PieChart,
	TrendingUp,
	Users,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart as RechartsPieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

// Dados simulados para os gráficos
const equipmentStatusData = [
	{ name: "Disponível", value: 45, color: "#10b981" },
	{ name: "Em uso", value: 120, color: "#3b82f6" },
	{ name: "Manutenção", value: 15, color: "#f59e0b" },
	{ name: "Extraviado", value: 5, color: "#ef4444" },
];

const equipmentCategoryData = [
	{ name: "Computação", value: 85, color: "#3b82f6" },
	{ name: "Rede", value: 35, color: "#8b5cf6" },
	{ name: "Periféricos", value: 28, color: "#ec4899" },
	{ name: "Impressão", value: 17, color: "#f97316" },
	{ name: "Monitoramento", value: 12, color: "#14b8a6" },
	{ name: "Áudio e Vídeo", value: 8, color: "#6366f1" },
];

const collaboratorsByDelegationData = [
	{ name: "Company 01", value: 450 },
	{ name: "Company 02", value: 280 },
	{ name: "Company 03", value: 180 },
	{ name: "Company 04", value: 120 },
	{ name: "Company 05", value: 90 },
	{ name: "Company 06", value: 90 },
];

// Modificar os dados de aquisição para incluir o código do mês
const equipmentAcquisitionData = [
	{ month: "Jan", count: 12, monthCode: "01" },
	{ month: "Fev", count: 19, monthCode: "02" },
	{ month: "Mar", count: 15, monthCode: "03" },
	{ month: "Abr", count: 8, monthCode: "04" },
	{ month: "Mai", count: 22, monthCode: "05" },
	{ month: "Jun", count: 14, monthCode: "06" },
	{ month: "Jul", count: 18, monthCode: "07" },
	{ month: "Ago", count: 25, monthCode: "08" },
	{ month: "Set", count: 13, monthCode: "09" },
	{ month: "Out", count: 17, monthCode: "10" },
	{ month: "Nov", count: 21, monthCode: "11" },
	{ month: "Dez", count: 16, monthCode: "12" },
];

const maintenanceHistoryData = [
	{ month: "Jan", preventive: 8, corrective: 3 },
	{ month: "Fev", preventive: 5, corrective: 7 },
	{ month: "Mar", preventive: 10, corrective: 4 },
	{ month: "Abr", preventive: 12, corrective: 2 },
	{ month: "Mai", preventive: 7, corrective: 5 },
	{ month: "Jun", preventive: 9, corrective: 6 },
	{ month: "Jul", preventive: 11, corrective: 3 },
	{ month: "Ago", preventive: 6, corrective: 8 },
	{ month: "Set", preventive: 14, corrective: 2 },
	{ month: "Out", preventive: 8, corrective: 4 },
	{ month: "Nov", preventive: 10, corrective: 5 },
	{ month: "Dez", preventive: 7, corrective: 3 },
];

const equipmentAgeData = [
	{ name: "< 1 ano", value: 65 },
	{ name: "1-2 anos", value: 85 },
	{ name: "2-3 anos", value: 45 },
	{ name: "3-4 anos", value: 30 },
	{ name: "4-5 anos", value: 15 },
	{ name: "> 5 anos", value: 10 },
];

// Componente para o card de estatísticas
interface StatCardProps {
	title: string;
	value: number;
	description: string;
	icon: React.ReactNode;
	trend?: number;
	trendLabel?: string;
}

function StatCard({
	title,
	value,
	description,
	icon,
	trend,
	trendLabel,
}: StatCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
					{icon}
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value.toLocaleString()}</div>
				<p className="text-xs text-muted-foreground">{description}</p>
				{trend !== undefined && (
					<div
						className={`flex items-center mt-2 text-xs ${trend >= 0 ? "text-green-500" : "text-red-500"}`}
					>
						{trend >= 0 ? (
							<TrendingUp className="h-3 w-3 mr-1" />
						) : (
							<TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
						)}
						<span>
							{Math.abs(trend)}% {trendLabel}
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-card p-2 rounded shadow-md">
				<p className="font-medium">{label}</p>
				{payload.map((entry: any, index: number) => (
					<p key={`item-${index}`} style={{ color: entry.color || entry.fill }}>
						{entry.name}: {entry.value}
					</p>
				))}
			</div>
		);
	}
	return null;
};

export default function DashboardPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [activeTab, setActiveTab] = useState("overview");
	const [mounted, setMounted] = useState(false);
	const tabParam = searchParams.get("tab");
	const companyId = searchParams.get("companyId");

	useEffect(() => {
		// Verificar autenticação de forma mais eficiente
		const checkAuth = () => {
			const isAuthenticated = localStorage.getItem("isAuthenticated");
			if (!isAuthenticated) {
				router.replace("/");
			}
		};

		// Executar apenas no cliente
		if (typeof window !== "undefined") {
			checkAuth();
		}

		setMounted(true);

		// Definir a tab ativa com base no parâmetro da URL
		if (
			tabParam &&
			["overview", "equipment", "people", "organization"].includes(tabParam)
		) {
			setActiveTab(tabParam);
		}
	}, [router, tabParam]);

	if (!mounted) {
		return null;
	}

	// Adicionar função para lidar com clique no gráfico de categorias
	const handleCategoryClick = (data: any) => {
		if (data && data.name) {
			const category = data.name.toLowerCase();
			let categoryParam = "";

			// Mapear os nomes de categorias para os valores usados na URL
			if (category === "computação") {
				categoryParam = "computing";
			} else if (category === "rede") {
				categoryParam = "network";
			} else if (category === "periféricos") {
				categoryParam = "peripherals";
			} else if (category === "impressão") {
				categoryParam = "printing";
			} else if (category === "monitoramento") {
				categoryParam = "monitoring";
			} else if (category === "áudio e vídeo") {
				categoryParam = "audio_video";
			}

			if (categoryParam) {
				router.push(`/dashboard/products?category=${categoryParam}`);
			}
		}
	};

	// Adicionar função para lidar com clique no gráfico de idade dos equipamentos
	const handleAgeClick = (data: any) => {
		if (data && data.name) {
			router.push(`/dashboard/products?age=${encodeURIComponent(data.name)}`);
		}
	};

	// Adicionar função para lidar com clique no gráfico de colaboradores por delegação
	const handleCollaboratorsByDelegationClick = (data: any) => {
		if (data && data.name) {
			// Encontrar o ID da delegação com base no nome
			const delegationId = getDelegationIdByName(data.name);
			if (delegationId) {
				router.push(`/dashboard/collaborators?delegationId=${delegationId}`);
			}
		}
	};

	// Função auxiliar para obter o ID da delegação pelo nome
	const getDelegationIdByName = (name: string): string | null => {
		const delegationMap: Record<string, string> = {
			"São Paulo Capital": "1",
			"Rio de Janeiro": "2",
			"Belo Horizonte": "3",
			"Porto Alegre": "4",
			Recife: "5",
		};
		return delegationMap[name] || null;
	};

	// Adicionar função para lidar com clique no gráfico de filiais por delegação
	const handleBranchesByDelegationClick = (data: any) => {
		if (data && data.name) {
			const delegationId = getDelegationIdByName(data.name);
			if (delegationId) {
				router.push(`/dashboard/branches?delegationId=${delegationId}`);
			}
		}
	};

	// Adicionar função para lidar com clique no gráfico de equipamentos por região
	const handleEquipmentsByRegionClick = (data: any) => {
		if (data && data.name) {
			router.push(
				`/dashboard/products?region=${encodeURIComponent(data.name)}`,
			);
		}
	};

	const handleStatusClick = (data: any) => {
		if (data && data.name) {
			const status = data.name.toLowerCase();
			let route = "/dashboard/products";

			if (status === "disponível") {
				route += "?status=available";
			} else if (status === "em uso") {
				route += "?status=in_use";
			} else if (status === "manutenção") {
				route += "?status=maintenance";
			} else if (status === "extraviado") {
				route += "?status=lost";
			}

			router.push(route);
		}
	};

	return (
		<DashboardLayout>
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-6">Dashboard</h1>

				<Tabs
					defaultValue={activeTab}
					value={activeTab}
					onValueChange={setActiveTab}
					className="space-y-6"
				>
					<TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none">
						<TabsTrigger value="overview" className="flex items-center gap-2">
							<Activity className="h-4 w-4" />
							<span>Visão Geral</span>
						</TabsTrigger>
						<TabsTrigger value="equipment" className="flex items-center gap-2">
							<Package className="h-4 w-4" />
							<span>Equipamentos</span>
						</TabsTrigger>
						<TabsTrigger value="people" className="flex items-center gap-2">
							<Users className="h-4 w-4" />
							<span>Pessoas</span>
						</TabsTrigger>
						<TabsTrigger
							value="organization"
							className="flex items-center gap-2"
						>
							<Building2 className="h-4 w-4" />
							<span>Organização</span>
						</TabsTrigger>
					</TabsList>

					{/* Visão Geral */}
					<TabsContent value="overview" className="space-y-6">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<StatCard
								title="Total de Colaboradores"
								value={1120}
								description="Colaboradores ativos no sistema"
								icon={<Users className="h-5 w-5" />}
								trend={5}
								trendLabel="em relação ao mês anterior"
							/>
							<StatCard
								title="Total de Equipamentos"
								value={1850}
								description="Equipamentos registados"
								icon={<Package className="h-5 w-5" />}
								trend={3.1}
								trendLabel="em relação ao mês anterior"
							/>
							<StatCard
								title="Empresas"
								value={12}
								description="Empresas cadastradas"
								icon={<Building2 className="h-4 w-4" />}
							/>
							<StatCard
								title="Delegações"
								value={28}
								description="Delegações ativas"
								icon={<GitBranch className="h-4 w-4" />}
							/>
						</div>

						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							<Card className="col-span-1">
								<CardHeader>
									<CardTitle>Status dos Equipamentos</CardTitle>
									<CardDescription>
										Distribuição por status atual
									</CardDescription>
								</CardHeader>
								<CardContent className="h-80">
									<ResponsiveContainer width="100%" height="100%">
										<RechartsPieChart>
											<Pie
												data={equipmentStatusData}
												cx="50%"
												cy="50%"
												innerRadius={60}
												outerRadius={90}
												paddingAngle={2}
												dataKey="value"
												label={({ name, percent }) =>
													`${name} ${(percent * 100).toFixed(0)}%`
												}
												labelLine={false}
												onClick={handleStatusClick}
											>
												{equipmentStatusData.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={entry.color}
														style={{ cursor: "pointer" }}
														className="hover:opacity-80 transition-opacity"
													/>
												))}
											</Pie>
											<Tooltip content={<CustomTooltip />} />
											<Legend />
										</RechartsPieChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							<Card className="lg:col-span-2">
								<CardHeader>
									<CardTitle>Manutenções Realizadas</CardTitle>
									<CardDescription>Preventiva vs. Corretiva</CardDescription>
								</CardHeader>
								<CardContent className="h-80">
									<ResponsiveContainer>
										<BarChart
											data={maintenanceHistoryData}
											onClick={(data) => {
												if (data?.activePayload?.[0]) {
													const month = data.activePayload[0].payload.month;
													const monthIndex = [
														"Jan",
														"Fev",
														"Mar",
														"Abr",
														"Mai",
														"Jun",
														"Jul",
														"Ago",
														"Set",
														"Out",
														"Nov",
														"Dez",
													].indexOf(month);
													if (monthIndex !== -1) {
														const monthCode = String(monthIndex + 1).padStart(
															2,
															"0",
														);
														router.push(
															`/dashboard/products?maintenanceMonth=${monthCode}`,
														);
													}
												}
											}}
										>
											<CartesianGrid strokeDasharray="3 3" vertical={false} />
											<XAxis dataKey="month" />
											<YAxis />
											<Tooltip content={<CustomTooltip />} />
											<Legend />
											<Bar
												dataKey="preventive"
												name="Preventivas"
												stackId="a"
												fill="#3b82f6"
												style={{ cursor: "pointer" }}
												className="hover:opacity-80 transition-opacity"
											/>
											<Bar
												dataKey="corrective"
												name="Corretivas"
												stackId="a"
												fill="#f59e0b"
												style={{ cursor: "pointer" }}
												className="hover:opacity-80 transition-opacity"
											/>
										</BarChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Equipamentos */}
					<TabsContent value="equipment" className="space-y-6">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<StatCard
								title="Total de Equipamentos"
								value={1850}
								description="Equipamentos registrados"
								icon={<Package className="h-4 w-4" />}
							/>
							<StatCard
								title="Em Uso"
								value={1200}
								description="Equipamentos atualmente em uso"
								icon={<Package className="h-4 w-4" />}
							/>
							<StatCard
								title="Em Manutenção"
								value={85}
								description="Equipamentos em manutenção"
								icon={<Package className="h-4 w-4" />}
							/>
							<StatCard
								title="Disponíveis"
								value={565}
								description="Equipamentos disponíveis"
								icon={<Package className="h-4 w-4" />}
							/>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Equipamentos por Categoria</CardTitle>
									<CardDescription>
										Distribuição por tipo de equipamento
									</CardDescription>
								</CardHeader>
								<CardContent className="h-80">
									<ResponsiveContainer width="100%" height="100%">
										<RechartsPieChart>
											<Pie
												data={equipmentCategoryData}
												cx="50%"
												cy="50%"
												outerRadius={90}
												dataKey="value"
												label={({ name, percent }) =>
													`${name} ${(percent * 100).toFixed(0)}%`
												}
												onClick={handleCategoryClick}
											>
												{equipmentCategoryData.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={entry.color}
														style={{ cursor: "pointer" }}
														className="hover:opacity-80 transition-opacity"
													/>
												))}
											</Pie>
											<Tooltip content={<CustomTooltip />} />
											<Legend onClick={handleCategoryClick} />
										</RechartsPieChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Idade dos Equipamentos</CardTitle>
									<CardDescription>
										Distribuição por tempo de uso
									</CardDescription>
								</CardHeader>
								<CardContent className="h-80">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={equipmentAgeData}>
											<CartesianGrid strokeDasharray="3 3" vertical={false} />
											<XAxis dataKey="name" />
											<YAxis />
											<Tooltip content={<CustomTooltip />} />
											<Bar
												dataKey="value"
												name="Equipamentos"
												fill="#6366f1"
												radius={[4, 4, 0, 0]}
												onClick={handleAgeClick}
												style={{ cursor: "pointer" }}
												className="hover:opacity-80 transition-opacity"
											/>
										</BarChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Pessoas */}
					<TabsContent value="people" className="space-y-6">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<StatCard
								title="Total de Colaboradores"
								value={1120}
								description="Colaboradores ativos no sistema"
								icon={<Users className="h-4 w-4" />}
							/>
							<StatCard
								title="Administradores"
								value={15}
								description="Usuários com acesso administrativo"
								icon={<Users className="h-4 w-4" />}
							/>
							<StatCard
								title="Moderadores"
								value={48}
								description="Usuários com acesso moderado"
								icon={<Users className="h-4 w-4" />}
							/>
							<StatCard
								title="Convidados"
								value={1057}
								description="Usuários com acesso básico"
								icon={<Users className="h-4 w-4" />}
							/>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<Card>
								<CardHeader className="mb-2">
									<CardTitle>Colaboradores por Empresa</CardTitle>
									<CardDescription>Distribuição por delegação</CardDescription>
								</CardHeader>
								<CardContent className="h-80">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={collaboratorsByDelegationData}
											layout="vertical"
										>
											<CartesianGrid strokeDasharray="3 3" horizontal={false} />
											<XAxis type="number" />
											<YAxis dataKey="name" type="category" width={100} />
											<Tooltip content={<CustomTooltip />} />
											<Bar
												dataKey="value"
												name="Colaboradores"
												fill="#8b5cf6"
												radius={[0, 4, 4, 0]}
												onClick={handleCollaboratorsByDelegationClick}
												style={{ cursor: "pointer" }}
												className="hover:opacity-80 transition-opacity"
											/>
										</BarChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Equipamentos por Colaborador</CardTitle>
									<CardDescription>
										Média de equipamentos por colaborador
									</CardDescription>
								</CardHeader>
								<CardContent className="h-80 flex flex-col items-center justify-center">
									<div className="relative w-48 h-48 flex items-center justify-center">
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="text-5xl font-bold text-primary">
												1.65
											</div>
										</div>
										<svg className="w-full h-full" viewBox="0 0 100 100">
											<title>Equipamentos por Colaborador</title>
											<circle
												cx="50"
												cy="50"
												r="45"
												fill="none"
												stroke="#e2e8f0"
												strokeWidth="10"
											/>
											<circle
												cx="50"
												cy="50"
												r="45"
												fill="none"
												stroke="#3b82f6"
												strokeWidth="10"
												strokeDasharray="283"
												strokeDashoffset="99"
												transform="rotate(-90 50 50)"
											/>
										</svg>
									</div>
									<div className="text-center mt-4">
										<p className="text-sm text-muted-foreground">
											Total de 1850 equipamentos para 1120 colaboradores
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Organização */}
					<TabsContent value="organization" className="space-y-6">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<StatCard
								title="Empresas"
								value={12}
								description="Empresas cadastradas"
								icon={<Building2 className="h-4 w-4" />}
							/>
							<StatCard
								title="Delegações"
								value={28}
								description="Delegações ativas"
								icon={<GitBranch className="h-4 w-4" />}
							/>
							<StatCard
								title="Filiais"
								value={85}
								description="Filiais em operação"
								icon={<Network className="h-4 w-4" />}
							/>
							<StatCard
								title="Regiões"
								value={5}
								description="Regiões atendidas"
								icon={<PieChart className="h-4 w-4" />}
							/>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Filiais por Delegação</CardTitle>
									<CardDescription>
										Número de filiais por delegação
									</CardDescription>
								</CardHeader>
								<CardContent className="h-80">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={[
												{ name: "São Paulo Capital", value: 32 },
												{ name: "Rio de Janeiro", value: 18 },
												{ name: "Belo Horizonte", value: 12 },
												{ name: "Porto Alegre", value: 8 },
												{ name: "Recife", value: 15 },
											]}
										>
											<CartesianGrid strokeDasharray="3 3" vertical={false} />
											<XAxis dataKey="name" />
											<YAxis />
											<Tooltip content={<CustomTooltip />} />
											<Bar
												dataKey="value"
												name="Filiais"
												fill="#14b8a6"
												radius={[4, 4, 0, 0]}
												onClick={handleBranchesByDelegationClick}
												style={{ cursor: "pointer" }}
												className="hover:opacity-80 transition-opacity"
											/>
										</BarChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Equipamentos por Região</CardTitle>
									<CardDescription>
										Distribuição de equipamentos por região
									</CardDescription>
								</CardHeader>
								<CardContent className="h-80">
									<ResponsiveContainer width="100%" height="100%">
										{/* Modificar o gráfico de Equipamentos por Região para ser interativo */}
										<RechartsPieChart>
											<Pie
												data={[
													{ name: "Sudeste", value: 850, color: "#3b82f6" },
													{ name: "Sul", value: 350, color: "#10b981" },
													{ name: "Nordeste", value: 420, color: "#f59e0b" },
													{
														name: "Centro-Oeste",
														value: 180,
														color: "#8b5cf6",
													},
													{ name: "Norte", value: 50, color: "#ef4444" },
												]}
												cx="50%"
												cy="50%"
												innerRadius={60}
												outerRadius={90}
												paddingAngle={2}
												dataKey="value"
												label={({ name, percent }) =>
													`${name} ${(percent * 100).toFixed(0)}%`
												}
												labelLine={false}
												onClick={handleEquipmentsByRegionClick}
											>
												{[
													{ name: "Sudeste", value: 850, color: "#3b82f6" },
													{ name: "Sul", value: 350, color: "#10b981" },
													{ name: "Nordeste", value: 420, color: "#f59e0b" },
													{
														name: "Centro-Oeste",
														value: 180,
														color: "#8b5cf6",
													},
													{ name: "Norte", value: 50, color: "#ef4444" },
												].map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={entry.color}
														style={{ cursor: "pointer" }}
														className="hover:opacity-80 transition-opacity"
													/>
												))}
											</Pie>
											<Tooltip content={<CustomTooltip />} />
											<Legend onClick={handleEquipmentsByRegionClick} />
										</RechartsPieChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</DashboardLayout>
	);
}
