import { NotesExplorerTreeNode, TreeNodeType } from "../notesExplorer/models/notesExplorerTreeNode";
import { HttpClient } from "./httpClient";

export type NotesExplorerTreeNodeContract = {
	id: string;
	name: string;
	hasChildren: boolean;
	treeNodeType: TreeNodeType;
};

export class NotesExplorerApi {
	private readonly httpClient: HttpClient;

	public constructor() {
		this.httpClient = new HttpClient();
	}

	public async getNode(nodeId: string): Promise<NotesExplorerTreeNode> {
		const response = await this.httpClient.getJson<NotesExplorerTreeNodeContract>(`/api/tree/nodes/${nodeId}`);
		return NotesExplorerTreeNode.create(response.id, response.name, response.treeNodeType, response.hasChildren);
	}

	public async getChildrenNodes(parentId?: string): Promise<NotesExplorerTreeNode[]> {
		const url = parentId ? `/api/tree/nodes/children?parentId=${parentId}` : `/api/tree/nodes/children`;
		const response = await this.httpClient.getJson<NotesExplorerTreeNodeContract[]>(url);
		return response.map((treeNode) => NotesExplorerTreeNode.create(treeNode.id, treeNode.name, treeNode.treeNodeType, treeNode.hasChildren));
	}
}
