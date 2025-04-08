export const monthDisplay: Record<string, string> = {
	"01": "Janeiro",
	"02": "Fevereiro",
	"03": "Março",
	"04": "Abril",
	"05": "Maio",
	"06": "Junho",
	"07": "Julho",
	"08": "Agosto",
	"09": "Setembro",
	"10": "Outubro",
	"11": "Novembro",
	"12": "Dezembro",
};

export const statusMap = {
	available: { label: "Disponível", color: "text-green-600" },
	in_use: { label: "Em uso", color: "text-blue-600" },
	maintenance: { label: "Manutenção", color: "text-yellow-600" },
	lost: { label: "Extraviado", color: "text-red-600" },
};

export const statusColors: Record<string, string> = {
	available: "text-green-500",
	in_use: "text-blue-500",
	maintenance: "text-yellow-500",
	lost: "text-red-500",
};

export const categoryMap = {
	computing: "Informática",
	network: "Rede",
	peripherals: "Periféricos",
	printing: "Impressão",
	monitoring: "Monitoramento",
	audio_video: "Áudio e Vídeo",
};

/* export const regionToDelegationMap: Record<string, string[]> = {
  Sudeste: ["1", "2", "3"], // IDs das delegações do Sudeste
  Sul: ["4"], // IDs das delegações do Sul
  Nordeste: ["5"], // IDs das delegações do Nordeste
  "Centro-Oeste": ["6"], // IDs das delegações do Centro-Oeste
  Norte: ["7"], // IDs das delegações do Norte
} */
