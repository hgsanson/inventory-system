"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import React, { useState } from "react";

// Interfaces
interface Intervention {
	id: string;
	date: Date;
	description: string;
	technician: string;
	status: string;
	maintenanceType: "preventive" | "corrective";
	observations: string;
}

interface InterventionFormProps {
	intervention?: Intervention;
	onSubmit: (intervention: Omit<Intervention, "id">) => void;
	onCancel: () => void;
}

const InterventionForm = React.memo(
	({ intervention, onSubmit, onCancel }: InterventionFormProps) => {
		const [formData, setFormData] = useState<Omit<Intervention, "id">>({
			date: intervention?.date || new Date(),
			description: intervention?.description || "",
			technician: intervention?.technician || "",
			status: intervention?.status || "",
			maintenanceType: intervention?.maintenanceType || "preventive",
			observations: intervention?.observations || "",
		});

		const updateField = (field: string, value: any) => {
			setFormData((prev) => ({ ...prev, [field]: value }));
		};

		const handleSubmit = () => {
			onSubmit(formData);
		};

		return (
			<div className="space-y-4 py-4">
				<div className="space-y-2">
					<Label>Data</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant={"outline"}
								className={cn(
									"w-full justify-start text-left font-normal",
									!formData.date && "text-muted-foreground",
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{formData.date ? (
									format(formData.date, "dd/MM/yyyy")
								) : (
									<span>Selecione a data</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={formData.date}
								onSelect={(date) => updateField("date", date || new Date())}
								initialFocus
								locale={ptBR}
							/>
						</PopoverContent>
					</Popover>
				</div>
				<div className="space-y-2">
					<Label>Tipo de Manutenção</Label>
					<Select
						value={formData.maintenanceType}
						onValueChange={(value: any) =>
							updateField("maintenanceType", value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Selecione o tipo de manutenção" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="preventive">Manutenção Preventiva</SelectItem>
							<SelectItem value="corrective">Manutenção Corretiva</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label>Descrição</Label>
					<Input
						value={formData.description}
						onChange={(e) => updateField("description", e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label>Observações</Label>
					<Input
						value={formData.observations}
						onChange={(e) => updateField("observations", e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label>Técnico Responsável</Label>
					<Input
						value={formData.technician}
						onChange={(e) => updateField("technician", e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label>Status</Label>
					<Input
						value={formData.status}
						onChange={(e) => updateField("status", e.target.value)}
					/>
				</div>
				<div className="flex justify-end gap-2 pt-4">
					<Button variant="outline" onClick={onCancel}>
						Cancelar
					</Button>
					<Button onClick={handleSubmit}>
						{intervention ? "Salvar" : "Adicionar"}
					</Button>
				</div>
			</div>
		);
	},
);

InterventionForm.displayName = "InterventionForm";

export default InterventionForm;
