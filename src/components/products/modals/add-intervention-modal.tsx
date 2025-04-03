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
import type { MaintenanceType, NewIntervention } from "../../types/product.types";

interface AddInterventionModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAddIntervention: (intervention: NewIntervention) => void;
}

export function AddInterventionModal({
	open,
	onOpenChange,
	onAddIntervention,
}: AddInterventionModalProps) {
	const [newIntervention, setNewIntervention] = useState<NewIntervention>({
		date: new Date(),
		description: "",
		technician: "",
		status: "",
		maintenanceType: "preventive",
		observations: "",
	});

	const resetNewIntervention = () => {
		setNewIntervention({
			date: new Date(),
			description: "",
			technician: "",
			status: "",
			maintenanceType: "preventive",
			observations: "",
		});
	};

	const handleAddIntervention = () => {
		onAddIntervention(newIntervention);
		onOpenChange(false);
		resetNewIntervention();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="overflow-y-auto max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Adicionar Nova Intervenção</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label>Data</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className={cn(
										"w-full justify-start text-left font-normal",
										!newIntervention.date && "text-muted-foreground",
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{newIntervention.date ? (
										format(newIntervention.date, "dd/MM/yyyy")
									) : (
										<span>Selecione a data</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={newIntervention.date}
									onSelect={(date) =>
										setNewIntervention({
											...newIntervention,
											date: date || new Date(),
										})
									}
									initialFocus
									locale={ptBR}
								/>
							</PopoverContent>
						</Popover>
					</div>
					<div className="space-y-2">
						<Label>Tipo de Manutenção</Label>
						<Select
							value={newIntervention.maintenanceType}
							onValueChange={(value: MaintenanceType) =>
								setNewIntervention({
									...newIntervention,
									maintenanceType: value,
								})
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Selecione o tipo de manutenção" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="preventive">
									Manutenção Preventiva
								</SelectItem>
								<SelectItem value="corrective">Manutenção Corretiva</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Descrição</Label>
						<Input
							value={newIntervention.description}
							onChange={(e) =>
								setNewIntervention({
									...newIntervention,
									description: e.target.value,
								})
							}
						/>
					</div>
					<div className="space-y-2">
						<Label>Observações</Label>
						<Input
							value={newIntervention.observations}
							onChange={(e) =>
								setNewIntervention({
									...newIntervention,
									observations: e.target.value,
								})
							}
						/>
					</div>
					<div className="space-y-2">
						<Label>Técnico Responsável</Label>
						<Input
							value={newIntervention.technician}
							onChange={(e) =>
								setNewIntervention({
									...newIntervention,
									technician: e.target.value,
								})
							}
						/>
					</div>
					<div className="space-y-2">
						<Label>Status</Label>
						<Input
							value={newIntervention.status}
							onChange={(e) =>
								setNewIntervention({
									...newIntervention,
									status: e.target.value,
								})
							}
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button onClick={handleAddIntervention}>Adicionar</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
