"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CheckCircle2Icon, InfoIcon, Trash2, WrenchIcon } from "lucide-react";
import React from "react";
import { categoryMap, statusMap } from "../../app/data/mappings";
import type { Intervention, Product } from "../types/product.types";
import { InterventionList } from "./intervention-list";

interface ProductTableProps {
	products: Product[];
	expandedRows: Set<string>;
	onToggleRow: (productId: string) => void;
	onViewDetails: (product: Product) => void;
	onDeleteProduct: (productId: string) => void;
	onAddIntervention: (productId: string) => void;
	onEditIntervention: (productId: string, intervention: Intervention) => void;
	onDeleteIntervention: (productId: string, interventionId: string) => void;
}

export function ProductTable({
	products,
	expandedRows,
	onToggleRow,
	onViewDetails,
	onDeleteProduct,
	onAddIntervention,
	onEditIntervention,
	onDeleteIntervention,
}: ProductTableProps) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Status</TableHead>
						<TableHead>Categoria</TableHead>
						<TableHead>Modelo</TableHead>
						<TableHead>Marca</TableHead>
						<TableHead>Localização</TableHead>
						<TableHead>Departamento</TableHead>
						<TableHead>Responsável</TableHead>
						<TableHead>Aquisição</TableHead>
						<TableHead>Intervenções</TableHead>
						<TableHead>Detalhes</TableHead>
						<TableHead className="text-right">Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{products.map((product) => (
						<React.Fragment key={product.id}>
							<TableRow className="cursor-pointer hover:bg-gray-50">
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
								<TableCell>
									<div className="flex flex-col">
										<span className="font-medium">
											{product.companyName || "N/A"}
										</span>
										<span className="text-sm text-muted-foreground">
											{product.delegationName || "N/A"}
										</span>
										<span className="text-xs text-muted-foreground">
											{product.branchName || "N/A"}
										</span>
									</div>
								</TableCell>
								<TableCell>{product.department || "N/A"}</TableCell>
								<TableCell>{product.responsible}</TableCell>
								<TableCell>
									{format(product.acquisitionDate, "dd/MM/yyyy")}
								</TableCell>
								<TableCell>
									<Collapsible>
										<CollapsibleTrigger
											onClick={(e) => {
												e.stopPropagation();
												onToggleRow(product.id);
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
											onViewDetails(product);
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
											onDeleteProduct(product.id);
										}}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
							{expandedRows.has(product.id) && (
								<TableRow>
									<TableCell colSpan={11} className="bg-gray-50 p-4">
										<InterventionList
											interventions={product.interventions}
											onAddIntervention={() => onAddIntervention(product.id)}
											onEditIntervention={(intervention) =>
												onEditIntervention(product.id, intervention)
											}
											onDeleteIntervention={(interventionId) =>
												onDeleteIntervention(product.id, interventionId)
											}
										/>
									</TableCell>
								</TableRow>
							)}
						</React.Fragment>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
