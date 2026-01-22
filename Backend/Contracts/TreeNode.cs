namespace Backend.Contracts
{
    public class TreeNode
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool IsFolder { get; set; }
        public bool HasChildren { get; set; }
    }
}
