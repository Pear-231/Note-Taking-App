import { NotesExplorerApi } from "../api/notesExplorerApi";
import { NotesExplorerTreeNode, TreeNodeType } from "./models/notesExplorerTreeNode";

export class NotesExplorerTreeBuilder {
	private readonly notesExplorerApi: NotesExplorerApi;

	private readonly nodeLookup = new Map<string, NotesExplorerTreeNode>();
	private readonly childrenByNodeId = new Map<string, string[] | Promise<string[]>>();
	private readonly maximumFoldersToPrefetchPerLoad = 10;

	public static readonly rootNodeId = "root";
	public static readonly loadingNodeName = "Loading...";
	public static readonly rootNode = NotesExplorerTreeNode.create(NotesExplorerTreeBuilder.rootNodeId, "", TreeNodeType.Unknown, true);

	public constructor() {
		this.notesExplorerApi = new NotesExplorerApi();
		this.nodeLookup.set(NotesExplorerTreeBuilder.rootNodeId, NotesExplorerTreeBuilder.rootNode);
	}

	public createLoadingNodeData(): NotesExplorerTreeNode {
		return NotesExplorerTreeNode.create("", NotesExplorerTreeBuilder.loadingNodeName, TreeNodeType.Unknown, false);
	}

	public async getNode(nodeId: string): Promise<NotesExplorerTreeNode> {
		const existingNode = this.nodeLookup.get(nodeId);
		if (existingNode) {
			return existingNode;
		}

		const node = await this.notesExplorerApi.getNode(nodeId);
		this.nodeLookup.set(nodeId, node);
		return node;
	}

	public getChildren(nodeId: string): string[] | Promise<string[]> {
		const cachedValue = this.childrenByNodeId.get(nodeId);
		if (cachedValue) {
			return cachedValue;
		}

		return this.ensureChildrenLoaded(nodeId);
	}

	private ensureChildrenLoaded(nodeId: string): Promise<string[]> {
		const cachedValue = this.childrenByNodeId.get(nodeId);

		if (cachedValue) {
			if (Array.isArray(cachedValue)) {
				return Promise.resolve(cachedValue);
			}

			return cachedValue;
		}

		const parentNodeId = nodeId === NotesExplorerTreeBuilder.rootNodeId ? undefined : nodeId;

		const loadPromise = this.loadChildren(nodeId, parentNodeId);
		this.childrenByNodeId.set(nodeId, loadPromise);

		return loadPromise;
	}

	private async loadChildren(nodeId: string, parentNodeId?: string): Promise<string[]> {
		try {
			const childNodes = await this.notesExplorerApi.getChildrenNodes(parentNodeId);

			for (const childNode of childNodes) {
				this.nodeLookup.set(childNode.id, childNode);
			}

			const childIds = childNodes.map((childNode) => childNode.id);

			this.childrenByNodeId.set(nodeId, childIds);

			this.prefetchNextLevel(childNodes);

			return childIds;
		} catch (error) {
			this.childrenByNodeId.delete(nodeId);
			throw error;
		}
	}

	private prefetchNextLevel(childNodes: NotesExplorerTreeNode[]): void {
		const folderNodesToPrefetch = childNodes
			.filter((childNode) => childNode.isFolder() && childNode.hasChildren)
			.slice(0, this.maximumFoldersToPrefetchPerLoad);

		for (const folderNode of folderNodesToPrefetch) {
			const cachedValue = this.childrenByNodeId.get(folderNode.id);

			if (cachedValue) {
				continue;
			}

			const loadPromise = this.ensureChildrenLoaded(folderNode.id);
			loadPromise.catch(() => {});
		}
	}
}
