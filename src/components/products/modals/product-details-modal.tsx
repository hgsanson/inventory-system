"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { categoryMap, statusMap } from "../../data/mappings";
import type { Product } from "../../types/product.types";

interface ProductDetailsModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product: Product | null;
}

export function ProductDetailsModal({
	open,
	onOpenChange,
	product,
}: ProductDetailsModalProps) {
	if (!product) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="overflow-y-auto max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Detalhes do Produto</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<h3 className="text-sm font-medium text-gray-500">Modelo</h3>
							<p className="mt-1 text-sm">{product.model}</p>
						</div>
						<div>
							<h3 className="text-sm font-medium text-gray-500">Marca</h3>
							<p className="mt-1 text-sm">{product.brand}</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<h3 className="text-sm font-medium text-gray-500">Status</h3>
							<p
								className={cn(
									"mt-1 text-sm font-medium",
									statusMap[product.status].color,
								)}
							>
								{statusMap[product.status].label}
							</p>
						</div>
						<div>
							<h3 className="text-sm font-medium text-gray-500">Categoria</h3>
							<p className="mt-1 text-sm">{categoryMap[product.category]}</p>
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
								<p className="mt-1 text-sm font-mono">{product.partNumber}</p>
							</div>
							<div>
								<h4 className="text-xs font-medium text-gray-500">
									Serial Number
								</h4>
								<p className="mt-1 text-sm font-mono">{product.serialNumber}</p>
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
								<p className="mt-1 text-sm">{product.location}</p>
							</div>
							<div>
								<h4 className="text-xs font-medium text-gray-500">
									Responsável
								</h4>
								<p className="mt-1 text-sm">{product.responsible}</p>
							</div>
						</div>
					</div>

					<div className="border-t pt-4">
						<h3 className="text-sm font-medium text-gray-500 mb-2">Datas</h3>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h4 className="text-xs font-medium text-gray-500">
									Data de Aquisição
								</h4>
								<p className="mt-1 text-sm">
									{format(product.acquisitionDate, "dd/MM/yyyy")}
								</p>
							</div>
							<div>
								<h4 className="text-xs font-medium text-gray-500">
									Garantia até
								</h4>
								<p className="mt-1 text-sm">
									{format(product.warrantyLimit, "dd/MM/yyyy")}
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
								{product.interventions.length} registros
							</span>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Fechar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
