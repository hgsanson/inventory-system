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

interface DeleteProductModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirmDelete: () => void;
}

export function DeleteProductModal({
	open,
	onOpenChange,
	onConfirmDelete,
}: DeleteProductModalProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
					<AlertDialogDescription>
						Tem certeza que deseja excluir este produto? Esta ação não pode ser
						desfeita.
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
