import type { NotesExplorerTreeNode } from "../components/NotesExplorer/NotesExplorerTreeNode";
import { fetchJson } from "./apiClient";

export class NotesExplorerApi {
	public getTreeItem(treeItemId: string): Promise<NotesExplorerTreeNode> {
		return fetchJson<NotesExplorerTreeNode>(`/api/tree/items/${treeItemId}`);
	}

	public getTreeItemChildren(treeItemId: string): Promise<string[]> {
		return fetchJson<string[]>(`/api/tree/items/${treeItemId}/children`);
	}
}
