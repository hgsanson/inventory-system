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

interface DeleteInterventionModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirmDelete: () => void;
}

export function DeleteInterventionModal({
	open,
	onOpenChange,
	onConfirmDelete,
}: DeleteInterventionModalProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirmar exclusão de intervenção</AlertDialogTitle>
					<AlertDialogDescription>
						Tem certeza que deseja excluir esta intervenção? Esta ação não pode
						ser desfeita.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirmDelete}
						className="bg-red-500 hover:bg-red-600"
					>
						Excluir
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
