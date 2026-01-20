import { useNotes } from "../hooks/useNotes";

function ListGroup() {
	const notes = useNotes();
	const listItems = notes.map((note) => (
		<li
			className="list-group-item"
			key={note.id}>
			{note.title}
		</li>
	));
	const list = <ul className="list-group">{listItems}</ul>;
	return list;
}

export default ListGroup;
