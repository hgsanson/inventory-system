import LoginForm from "@/components/login-form";

export default function Home() {
	return (
		<div className="flex h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Sistema de Inventário</h1>
					<p className="mt-2 text-gray-600 font-heading">
						Faça login para acessar o sistema
					</p>
				</div>
				<LoginForm />
			</div>
		</div>
	);
}
