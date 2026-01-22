namespace Backend.Data.Entities
{
    public class Folder
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public Guid? ParentId { get; set; }
        public Folder? Parent { get; set; }
        public ICollection<Folder> Folders { get; set; } = [];
        public ICollection<Note> Notes { get; set; } = [];
    }
}