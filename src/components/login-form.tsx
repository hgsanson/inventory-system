"use client";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		// Pré-caregamento da rota Dashboard
		router.prefetch("/dashboard");

		setTimeout(() => {
			if (email === "admin@admin.com" && password === "admin") {
				localStorage.setItem("isAuthenticated", "true");

				// Usar replace ao invés de push para evitar entradas desnecessárias no histórico
				router.replace("/dashboard");
			} else {
				setError("Email e/ senha inválido(s)");
				setLoading(false);
			}
		}, 500);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{error && (
				<Alert variant="destructive">
					<ExclamationTriangleIcon className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<div className="space-y-2">
				<Label htmlFor="email">E-mail</Label>
				<Input
					id="email"
					type="email"
					placeholder="joao@exemplo.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="email">Password</Label>
				<Input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			<Button type="submit" className="w-full" disabled={loading}>
				{loading ? "Carregando..." : "Entrar"}
			</Button>
		</form>
	);
}
