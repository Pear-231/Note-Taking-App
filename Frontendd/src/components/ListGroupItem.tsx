import type { Note } from "../models/note";

export interface Properties {
	note: Note;
	onSelect: (item: Note) => void;
}

const formatCreatedAt = (createdAt: string): string => new Date(createdAt).toLocaleDateString();

function ListGroupItem({ note, onSelect }: Properties) {
	return (
		<li
			className="list-group-item"
			onClick={() => {
				onSelect(note);
			}}>
			<div className="fw-semibold">{note.title}</div>
			<small className="text-body-secondary">{formatCreatedAt(note.createdAt)}</small>
			<p
				className="text-body-secondary text-truncate"
				style={{ maxWidth: "20rem" }}>
				{note.content}
			</p>
		</li>
	);
}

export default ListGroupItem;
