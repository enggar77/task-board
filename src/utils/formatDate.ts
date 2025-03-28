export function formatDate(date: Date | string): string {
	return new Date(date)
		.toLocaleString("id", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		})
		.replace(",", " -");
}
