using Backend.Data.Entities;

namespace Backend.Data
{
    public static class DummyDb
    {
        public static void Initialise(AppDbContext context)
        {
            if (context.Folders.Any() || context.Notes.Any())
                return;

            var folder1Id = Guid.Parse("976f792d-b0dd-444a-8ef2-6e764bdb0162");
            var folder2Id = Guid.Parse("976f792d-b0dd-444a-8ef2-6e764bdb0163");
            var childFolderOfFolder2Id = Guid.Parse("976f792d-b0dd-444a-8ef2-6e764bdb0164");

            var folder1 = new Folder
            {
                Id = folder1Id,
                Name = "Folder 1",
                Notes =
                [
                    new Note
                    {
                        Name = "First Note",
                        Content = "This is the first note. This is a good note.",
                        CreatedAt = new DateTime(2024, 1, 1, 10, 0, 0),
                        UpdatedAt = new DateTime(2024, 1, 1, 10, 0, 0)
                    }
                ]
            };

            var childFolderOfFolder2 = new Folder
            {
                Id = childFolderOfFolder2Id,
                Name = "Child Folder of Folder 2",
                Notes =
                [
                    new Note
                    {
                        Name = "Third Note",
                        Content = "This is the third note. Not bad.",
                        CreatedAt = new DateTime(2024, 1, 3, 9, 15, 0),
                        UpdatedAt = new DateTime(2024, 1, 3, 9, 15, 0)
                    }
                ]
            };

            var folder2 = new Folder
            {
                Id = folder2Id,
                Name = "Folder 2",
                Folders = [childFolderOfFolder2],
                Notes =
                [
                    new Note
                    {
                        Name = "Second Note",
                        Content = "This is the second note. It's a really great note.",
                        CreatedAt = new DateTime(2024, 1, 2, 14, 30, 0),
                        UpdatedAt = new DateTime(2024, 1, 2, 14, 30, 0)
                    }
                ]
            };

            context.Folders.AddRange(folder1, folder2);
            context.SaveChanges();
        }
    }
}
