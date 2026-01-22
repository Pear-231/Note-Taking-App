using Backend.Data.Entities;

namespace Backend.Data
{
    public class DummyDb
    {   
        public static void Initialize(AppDbContext context)
        {
            context.Folders.AddRange(
                new Folder
                {
                    Id = Guid.Parse("976f792d-b0dd-444a-8ef2-6e764bdb0162"),
                    Name = "Folder 1"
                },
                new Folder
                {
                    Id = Guid.Parse("976f792d-b0dd-444a-8ef2-6e764bdb0163"),
                    Name = "Folder 2"
                },
                new Folder
                {
                    Id = Guid.Parse("976f792d-b0dd-444a-8ef2-6e764bdb0164"),
                    Name = "Child Folder of Folder 2",
                    ParentId = Guid.Parse("976f792d-b0dd-444a-8ef2-6e764bdb0163")
                }
            );

            context.Notes.AddRange(
                new Note
                {
                    Name = "First Note",
                    Content = "This is the first note. This is a good note.",
                    CreatedAt = new DateTime(2024, 1, 1, 10, 0, 0),
                    UpdatedAt = new DateTime(2024, 1, 1, 10, 0, 0),
                    ParentId = Guid.Parse("976f792d-b0dd-444a-8ef2-6e764bdb0162")
                },
                new Note
                {
                    Name = "Second Note",
                    Content = "This is the second note. It's a really great note.",
                    CreatedAt = new DateTime(2024, 1, 2, 14, 30, 0),
                    UpdatedAt = new DateTime(2024, 1, 1, 10, 0, 0),
                    ParentId = Guid.Parse("976f792d-b0dd-444a-8ef2-6e764bdb0163")
                },
                new Note
                {
                    Name = "Third Note",
                    Content = "This is the third note. Not bad.",
                    CreatedAt = new DateTime(2024, 1, 3, 9, 15, 0),
                    UpdatedAt = new DateTime(2024, 1, 1, 10, 0, 0),
                    ParentId = Guid.Parse("976f792d-b0dd-444a-8ef2-6e764bdb0164")
                }
            );

            context.SaveChanges();
        }
    }
}