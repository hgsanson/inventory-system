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
import { useEffect, useState } from "react";
import type { Intervention, MaintenanceType } from "../../types/product.types";

interface EditInterventionModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	intervention: Intervention | null;
	onSaveIntervention: (intervention: Intervention) => void;
}

export function EditInterventionModal({
	open,
	onOpenChange,
	intervention,
	onSaveIntervention,
}: EditInterventionModalProps) {
	const [editedIntervention, setEditedIntervention] =
		useState<Intervention | null>(null);

	useEffect(() => {
		if (intervention) {
			setEditedIntervention({ ...intervention });
		}
	}, [intervention]);

	const handleSaveIntervention = () => {
		if (editedIntervention) {
			onSaveIntervention(editedIntervention);
			onOpenChange(false);
		}
	};

	if (!editedIntervention) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="overflow-y-auto max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Editar Intervenção</DialogTitle>
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
										!editedIntervention.date && "text-muted-foreground",
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{editedIntervention.date ? (
										format(editedIntervention.date, "dd/MM/yyyy")
									) : (
										<span>Selecione a data</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={editedIntervention.date}
									onSelect={(date) =>
										setEditedIntervention({
											...editedIntervention,
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
							value={editedIntervention.maintenanceType}
							onValueChange={(value: MaintenanceType) =>
								setEditedIntervention({
									...editedIntervention,
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
							value={editedIntervention.description}
							onChange={(e) =>
								setEditedIntervention({
									...editedIntervention,
									description: e.target.value,
								})
							}
						/>
					</div>
					<div className="space-y-2">
						<Label>Observações</Label>
						<Input
							value={editedIntervention.observations}
							onChange={(e) =>
								setEditedIntervention({
									...editedIntervention,
									observations: e.target.value,
								})
							}
						/>
					</div>
					<div className="space-y-2">
						<Label>Técnico Responsável</Label>
						<Input
							value={editedIntervention.technician}
							onChange={(e) =>
								setEditedIntervention({
									...editedIntervention,
									technician: e.target.value,
								})
							}
						/>
					</div>
					<div className="space-y-2">
						<Label>Status</Label>
						<Input
							value={editedIntervention.status}
							onChange={(e) =>
								setEditedIntervention({
									...editedIntervention,
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
					<Button onClick={handleSaveIntervention}>Salvar</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
