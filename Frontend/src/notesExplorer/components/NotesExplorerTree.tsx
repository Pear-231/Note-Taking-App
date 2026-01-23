import { asyncDataLoaderFeature, hotkeysCoreFeature, selectionFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import cn from "classnames";
import { useMemo } from "react";
import { NotesExplorerTreeNode } from "../models/notesExplorerTreeNode";
import { NotesExplorerTreeBuilder } from "../notesExplorerTreeBuilder";
import styles from "./NotesExplorerTree.module.css";

export function NotesExplorerTree() {
	const notesExplorerTreeBuilder = useMemo(() => new NotesExplorerTreeBuilder(), []);

	const tree = useTree<NotesExplorerTreeNode>({
		initialState: { expandedItems: [NotesExplorerTreeBuilder.rootNodeId] },
		rootItemId: NotesExplorerTreeBuilder.rootNodeId,
		getItemName: (item) => item.getItemData().name,
		isItemFolder: (item) => item.getId() === NotesExplorerTreeBuilder.rootNodeId || item.getItemData().isFolder(),
		createLoadingItemData: () => notesExplorerTreeBuilder.createLoadingItemData(),
		dataLoader: {
			getItem: (treeItemId) => notesExplorerTreeBuilder.getNode(treeItemId),
			getChildren: (treeItemId) => notesExplorerTreeBuilder.getChildren(treeItemId),
		},
		indent: 20,
		features: [asyncDataLoaderFeature, selectionFeature, hotkeysCoreFeature],
	});

	return (
		<div
			{...tree.getContainerProps()}
			className={styles.tree}>
			{tree.getItems().map((item) => (
				<button
					{...item.getProps()}
					key={item.getId()}
					className={styles.treeButton}
					style={{ paddingLeft: `${item.getItemMeta().level * 20}px` }}>
					<div
						className={cn(styles.treeItem, {
							[styles.focused]: item.isFocused(),
							[styles.expanded]: item.isExpanded(),
							[styles.selected]: item.isSelected(),
							[styles.folder]: item.isFolder(),
						})}>
						{item.getItemName()}
						{item.isLoading() && " (loading...)"}
					</div>
				</button>
			))}
		</div>
	);
}
