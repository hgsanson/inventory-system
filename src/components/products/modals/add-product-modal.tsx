"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { categoryMap, statusMap } from "../../data/mappings";
import type {
	NewProduct,
	ProductCategory,
	ProductStatus,
} from "../../types/product.types";

interface AddProductModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAddProduct: (product: NewProduct) => void;
	initialCompanyFilter?: string | null;
	initialDelegationFilter?: string | null;
	initialBranchFilter?: string | null;
}

export function AddProductModal({
	open,
	onOpenChange,
	onAddProduct,
	initialCompanyFilter,
	initialDelegationFilter,
	initialBranchFilter,
}: AddProductModalProps) {
	const [newProduct, setNewProduct] = useState<NewProduct>({
		status: "available",
		category: "computing",
		model: "",
		brand: "",
		partNumber: "",
		serialNumber: "",
		location: "",
		responsible: "",
		acquisitionDate: new Date(),
		warrantyLimit: new Date(),
		department: "",
		companyName: "",
		delegationName: "",
		branchName: "",
	});

	const resetNewProduct = () => {
		setNewProduct({
			status: "available",
			category: "computing",
			model: "",
			brand: "",
			partNumber: "",
			serialNumber: "",
			location: "",
			responsible: "",
			acquisitionDate: new Date(),
			warrantyLimit: new Date(),
			department: "",
			companyName: "",
			delegationName: "",
			branchName: "",
		});
	};

	const handleAddProduct = () => {
		const product: NewProduct = {
			...newProduct,
		};
		onAddProduct(product);
		onOpenChange(false);
		resetNewProduct();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="overflow-y-auto max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Adicionar Novo Produto</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Status</Label>
							<Select
								value={newProduct.status}
								onValueChange={(value: ProductStatus) =>
									setNewProduct({ ...newProduct, status: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione o status" />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(statusMap).map(([value, { label }]) => (
										<SelectItem key={value} value={value}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Categoria</Label>
							<Select
								value={newProduct.category}
								onValueChange={(value: ProductCategory) =>
									setNewProduct({ ...newProduct, category: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione a categoria" />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(categoryMap).map(([value, label]) => (
										<SelectItem key={value} value={value}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Modelo</Label>
							<Input
								value={newProduct.model}
								onChange={(e) =>
									setNewProduct({ ...newProduct, model: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Marca</Label>
							<Input
								value={newProduct.brand}
								onChange={(e) =>
									setNewProduct({ ...newProduct, brand: e.target.value })
								}
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Part Number</Label>
							<Input
								value={newProduct.partNumber}
								onChange={(e) =>
									setNewProduct({ ...newProduct, partNumber: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Serial Number</Label>
							<Input
								value={newProduct.serialNumber}
								onChange={(e) =>
									setNewProduct({ ...newProduct, serialNumber: e.target.value })
								}
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label>Localização</Label>
						<Input
							value={newProduct.location}
							onChange={(e) =>
								setNewProduct({ ...newProduct, location: e.target.value })
							}
						/>
					</div>
					<div className="space-y-2">
						<Label>Responsável</Label>
						<Input
							value={newProduct.responsible}
							onChange={(e) =>
								setNewProduct({ ...newProduct, responsible: e.target.value })
							}
						/>
					</div>
					<div className="space-y-2">
						<Label>Departamento</Label>
						<Input
							value={newProduct.department}
							onChange={(e) =>
								setNewProduct({ ...newProduct, department: e.target.value })
							}
						/>
					</div>
					<div className="grid grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label>Empresa</Label>
							<Input
								value={newProduct.companyName}
								onChange={(e) =>
									setNewProduct({ ...newProduct, companyName: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Delegação</Label>
							<Input
								value={newProduct.delegationName}
								onChange={(e) =>
									setNewProduct({
										...newProduct,
										delegationName: e.target.value,
									})
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Filial</Label>
							<Input
								value={newProduct.branchName}
								onChange={(e) =>
									setNewProduct({ ...newProduct, branchName: e.target.value })
								}
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Data de Aquisição</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={"outline"}
										className={cn(
											"w-full justify-start text-left font-normal",
											!newProduct.acquisitionDate && "text-muted-foreground",
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{newProduct.acquisitionDate ? (
											format(newProduct.acquisitionDate, "dd/MM/yyyy")
										) : (
											<span>Selecione a data</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={newProduct.acquisitionDate}
										onSelect={(date) =>
											setNewProduct({
												...newProduct,
												acquisitionDate: date || new Date(),
											})
										}
										initialFocus
										locale={ptBR}
									/>
								</PopoverContent>
							</Popover>
						</div>
						<div className="space-y-2">
							<Label>Limite da Garantia</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={"outline"}
										className={cn(
											"w-full justify-start text-left font-normal",
											!newProduct.warrantyLimit && "text-muted-foreground",
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{newProduct.warrantyLimit ? (
											format(newProduct.warrantyLimit, "dd/MM/yyyy")
										) : (
											<span>Selecione a data</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={newProduct.warrantyLimit}
										onSelect={(date) =>
											setNewProduct({
												...newProduct,
												warrantyLimit: date || new Date(),
											})
										}
										initialFocus
										locale={ptBR}
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button onClick={handleAddProduct}>Adicionar</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
