"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import type { Intervention } from "../types/product.types";

interface InterventionListProps {
	interventions: Intervention[];
	onAddIntervention: () => void;
	onEditIntervention: (intervention: Intervention) => void;
	onDeleteIntervention: (interventionId: string) => void;
}

export function InterventionList({
	interventions,
	onAddIntervention,
	onEditIntervention,
	onDeleteIntervention,
}: InterventionListProps) {
	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h4 className="text-sm font-semibold">Histórico de Intervenções</h4>
				<Button size="sm" onClick={onAddIntervention}>
					<Plus className="mr-2 h-4 w-4" /> Nova Intervenção
				</Button>
			</div>
			{interventions.length === 0 ? (
				<p className="text-sm text-gray-500">Nenhuma intervenção registrada</p>
			) : (
				<div className="space-y-2">
					{interventions.map((intervention) => (
						<div
							key={intervention.id}
							className="bg-white p-3 rounded-md border text-sm"
						>
							<div className="flex justify-between">
								<span className="font-medium">
									{format(intervention.date, "dd/MM/yyyy")}
								</span>
								<div className="flex gap-2">
									<Button
										variant="ghost"
										size="sm"
										className="h-8 px-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
										onClick={() => onEditIntervention(intervention)}
									>
										Editar
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
										onClick={() => onDeleteIntervention(intervention.id)}
									>
										Excluir
									</Button>
								</div>
							</div>
							<div className="mt-1 flex items-center gap-2">
								<span className="font-medium">Tipo:</span>
								<span
									className={
										intervention.maintenanceType === "preventive"
											? "text-blue-500"
											: "text-amber-500"
									}
								>
									{intervention.maintenanceType === "preventive"
										? "Preventiva"
										: "Corretiva"}
								</span>
							</div>
							<p className="mt-1">
								<span className="font-medium">Descrição:</span>{" "}
								{intervention.description}
							</p>
							<p className="mt-1">
								<span className="font-medium">Observações:</span>{" "}
								{intervention.observations}
							</p>
							<p className="mt-1 text-gray-500">
								Status: {intervention.status}
							</p>
							<p className="mt-1 text-gray-500">
								Técnico: {intervention.technician}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
