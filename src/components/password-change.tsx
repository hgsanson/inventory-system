"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
/* import { useToast } from "@/components/ui/use-toast"; */
import { Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function PasswordChange() {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	/* 	const { toast } = useToast(); */

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validações básicas
		/* 		if (!currentPassword) {
			toast({
				title: "Erro",
				description: "A senha atual é obrigatória",
				variant: "destructive",
			});
			return;
		}

		if (newPassword.length < 6) {
			toast({
				title: "Erro",
				description: "A nova senha deve ter pelo menos 6 caracteres",
				variant: "destructive",
			});
			return;
		}

		if (newPassword !== confirmPassword) {
			toast({
				title: "Erro",
				description: "As senhas não coincidem",
				variant: "destructive",
			});
			return;
		}

		// Simulação de alteração de senha
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
			toast({
				title: "Sucesso",
				description: "Sua senha foi alterada com sucesso",
				action: (
					<div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
						<Check className="h-5 w-5 text-white" />
					</div>
				),
			});

			// Limpar formulário
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		}, 1500); */
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="current-password">Senha Atual</Label>
					<div className="relative">
						<Input
							id="current-password"
							type={showCurrentPassword ? "text" : "password"}
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							className="pr-10"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute right-0 top-0 h-full"
							onClick={() => setShowCurrentPassword(!showCurrentPassword)}
						>
							{showCurrentPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="new-password">Nova Senha</Label>
					<div className="relative">
						<Input
							id="new-password"
							type={showNewPassword ? "text" : "password"}
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="pr-10"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute right-0 top-0 h-full"
							onClick={() => setShowNewPassword(!showNewPassword)}
						>
							{showNewPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</div>
					{newPassword && newPassword.length < 6 && (
						<p className="text-sm text-red-500">
							A senha deve ter pelo menos 6 caracteres
						</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
					<div className="relative">
						<Input
							id="confirm-password"
							type={showConfirmPassword ? "text" : "password"}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="pr-10"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute right-0 top-0 h-full"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						>
							{showConfirmPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</div>
					{confirmPassword && newPassword !== confirmPassword && (
						<p className="text-sm text-red-500">As senhas não coincidem</p>
					)}
				</div>
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? "Alterando..." : "Alterar Senha"}
			</Button>
		</form>
	);
}
