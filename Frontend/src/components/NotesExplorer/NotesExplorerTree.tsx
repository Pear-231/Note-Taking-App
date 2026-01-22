import { asyncDataLoaderFeature, hotkeysCoreFeature, selectionFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import cn from "classnames";
import { useMemo, useState } from "react";
import { NotesExplorerApi } from "../../api/notesExplorerApi";
import "./NotesExplorerTree.css";
import type { NotesExplorerTreeNode } from "./NotesExplorerTreeNode";

export function NotesExplorerTree() {
	const [loadingItemName] = useState("Loading...");

	const notesExplorerApi = useMemo(() => new NotesExplorerApi(), []);

	const rootNode = useMemo<NotesExplorerTreeNode>(() => {
		return {
			id: "root",
			name: "Notes",
			isFolder: true,
			hasChildren: true,
		};
	}, []);

	const tree = useTree<NotesExplorerTreeNode>({
		initialState: { expandedItems: ["root"] },
		rootItemId: "root",
		getItemName: (item) => item.getItemData().name,
		isItemFolder: (item) => item.getItemData().isFolder,
		createLoadingItemData: () => ({
			id: "",
			name: loadingItemName,
			isFolder: false,
			hasChildren: false,
		}),
		dataLoader: {
			getItem: (treeItemId) => {
				if (treeItemId === "root") {
					return Promise.resolve(rootNode);
				}

				return notesExplorerApi.getTreeItem(treeItemId);
			},
			getChildren: (treeItemId) => {
				return notesExplorerApi.getTreeItemChildren(treeItemId);
			},
		},
		indent: 20,
		features: [asyncDataLoaderFeature, selectionFeature, hotkeysCoreFeature],
	});

	return (
		<div
			{...tree.getContainerProps()}
			className="tree">
			{tree.getItems().map((item) => (
				<button
					{...item.getProps()}
					key={item.getId()}
					style={{ paddingLeft: `${item.getItemMeta().level * 20}px` }}>
					<div
						className={cn("treeitem", {
							focused: item.isFocused(),
							expanded: item.isExpanded(),
							selected: item.isSelected(),
							folder: item.isFolder(),
						})}>
						{item.getItemName()}
						{item.isLoading() && " (loading...)"}
					</div>
				</button>
			))}
		</div>
	);
}
