import ListGroup from "./components/ListGroup";
import { useNotes } from "./hooks/useNotes";
import type { Note } from "./models/note";

function App() {
	const notes = useNotes();
	const handleSelectNote = (note: Note) => {
		console.log(note);
	};

	return (
		<div>
			<ListGroup
				notes={notes}
				onSelect={handleSelectNote}
			/>
		</div>
	);
}

export default App;
