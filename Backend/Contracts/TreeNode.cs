using Backend.Data.Entities;

namespace Backend.Contracts
{
    public enum TreeNodeType
    {
        Unknown,
        Folder,
        Note
    }

    public class TreeNode
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public TreeNodeType TreeNodeType { get; set; }
        public bool HasChildren { get; set; }

        public static TreeNode Create(Guid folderId, string? folderName, bool hasChildren)
        {
            return new TreeNode
            {
                Id = folderId.ToString(),
                Name = folderName ?? string.Empty,
                TreeNodeType = TreeNodeType.Folder,
                HasChildren = hasChildren
            };
        }

        public static TreeNode Create(Guid noteId, string? noteName)
        {
            return new TreeNode
            {
                Id = noteId.ToString(),
                Name = noteName ?? string.Empty,
                TreeNodeType = TreeNodeType.Note,
                HasChildren = false
            };
        }
    }
}
