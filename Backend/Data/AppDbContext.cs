using Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Folder> Folders { get; set; }
        public DbSet<Note> Notes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Folder>()
                .HasMany(folder => folder.Folders)
                .WithOne(folder => folder.Parent)
                .HasForeignKey(folder => folder.ParentId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascading deletes for subfolders

            modelBuilder.Entity<Folder>()
                .HasMany(folder => folder.Notes)
                .WithOne(note => note.Parent)
                .HasForeignKey(note => note.ParentId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete notes when a folder is deleted

            base.OnModelCreating(modelBuilder);
        }
    }
}