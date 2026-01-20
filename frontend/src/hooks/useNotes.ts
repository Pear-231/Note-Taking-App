import { useEffect, useState } from "react";
import { NotesApi } from "../api/notesApi";
import type { Note } from "../models/note";

export function useNotes() {
	// Declare React state:
	// - notes is the current list of notes stored by React
	// - setNotes is the function React provides to replace that list
	const [notes, setNotes] = useState<Note[]>([]);

	// After the first render:
	// - get the notes
	// - pass the returned list into setNotes to update the state
	useEffect(() => {
		NotesApi.getNotesAsync().then(setNotes);
	}, []);

	return notes;
}
