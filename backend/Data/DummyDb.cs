using backend.Models;

namespace backend.Data
{
    public class DummyDb
    {
        public static void Initialize(AppDbContext context)
        {
            context.Notes.AddRange(
                new Note { Title = "First Note", Content = "This is the first note. This is a pretty good note too I can't lie.", CreatedAt = new DateTime(2024, 1, 1, 10, 0, 0) },
                new Note { Title = "Second Note", Content = "This is the second note. It's a really great note.", CreatedAt = new DateTime(2024, 1, 2, 14, 30, 0) },
                new Note { Title = "Third Note", Content = "This is the third note.", CreatedAt = new DateTime(2024, 1, 3, 9, 15, 0) }
            );
            context.SaveChanges();
        }
    }
}
