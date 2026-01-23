import { NotesExplorerApi } from "../api/notesExplorerApi";
import { NotesExplorerTreeNode, TreeNodeType } from "./models/notesExplorerTreeNode";

export class NotesExplorerTreeBuilder {
	private readonly notesExplorerApi: NotesExplorerApi;

	public static readonly rootNodeId = "root";
	public static readonly loadingNodeName = "Loading...";
	public static readonly rootNode = NotesExplorerTreeNode.create(NotesExplorerTreeBuilder.rootNodeId, "", TreeNodeType.Unknown, true);

	public constructor() {
		this.notesExplorerApi = new NotesExplorerApi();
	}

	public createLoadingItemData(): NotesExplorerTreeNode {
		return NotesExplorerTreeNode.create("", NotesExplorerTreeBuilder.loadingNodeName, TreeNodeType.Unknown, false);
	}

	public async getNode(nodeId: string): Promise<NotesExplorerTreeNode> {
		if (nodeId === NotesExplorerTreeBuilder.rootNodeId) {
			return NotesExplorerTreeBuilder.rootNode;
		}
		return await this.notesExplorerApi.getNode(nodeId);
	}

	public async getChildren(treeItemId: string): Promise<string[]> {
		const parentId = treeItemId === NotesExplorerTreeBuilder.rootNodeId ? undefined : treeItemId;
		const childNodes = await this.notesExplorerApi.getChildrenNodes(parentId);
		return childNodes.map((childNode) => childNode.id);
	}
}
