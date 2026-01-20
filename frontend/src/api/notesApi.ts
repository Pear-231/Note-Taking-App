import type { Note } from "../models/note";

export class NotesApi {
	public static async getNotesAsync(): Promise<Note[]> {
		const response = await fetch("/api/notes", {
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to load notes: ${response.status}.`);
		}

		return (await response.json()) as Note[];
	}
}
