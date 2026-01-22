export async function fetchJson<TResponse>(url: string): Promise<TResponse> {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Request failed: ${response.status} ${response.statusText}`);
	}

	return (await response.json()) as TResponse;
}
