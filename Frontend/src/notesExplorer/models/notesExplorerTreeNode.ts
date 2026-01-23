export enum TreeNodeType {
	Unknown = "Unknown",
	Folder = "Folder",
	Note = "Note",
}

export class NotesExplorerTreeNode {
	public constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly treeNodeType: TreeNodeType,
		public readonly hasChildren: boolean,
	) {}

	public static create(id: string, name: string, treeNodeType: TreeNodeType, hasChildren: boolean): NotesExplorerTreeNode {
		return new NotesExplorerTreeNode(id, name, treeNodeType, hasChildren);
	}

	public isFolder(): boolean {
		return this.treeNodeType === TreeNodeType.Folder;
	}
}
