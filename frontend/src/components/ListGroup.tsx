import type { Note } from "../models/note";
import ListGroupItem from "./ListGroupItem";

export interface Properties {
	notes: Note[];
	onSelect: (item: Note) => void;
}

function ListGroup({ notes, onSelect }: Properties) {
	return (
		<ul className="list-group">
			{notes.map((note) => (
				<ListGroupItem
					key={note.id}
					note={note}
					onSelect={onSelect}
				/>
			))}
		</ul>
	);
}

export default ListGroup;
