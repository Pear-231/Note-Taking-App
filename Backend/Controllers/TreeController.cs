using Backend.Contracts;
using Backend.Data;
using Backend.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TreeController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        private const string RootTreeId = "root";

        private static string GetFolderTreeId(Guid folderId) => $"folder:{folderId}";

        private static string GetNoteTreeId(Guid noteId) => $"note:{noteId}";

        private static bool TryParseFolderTreeId(string treeItemId, out Guid folderId)
        {
            folderId = default;

            if (!treeItemId.StartsWith("folder:", StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            var guidString = treeItemId["folder:".Length..];
            return Guid.TryParse(guidString, out folderId);
        }

        private static bool TryParseNoteTreeId(string treeItemId, out Guid noteId)
        {
            noteId = default;

            if (!treeItemId.StartsWith("note:", StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            var guidString = treeItemId["note:".Length..];
            return Guid.TryParse(guidString, out noteId);
        }

        [HttpGet("items/{treeItemId}")]
        public async Task<ActionResult<TreeNode>> GetItem(string treeItemId)
        {
            if (string.Equals(treeItemId, RootTreeId, StringComparison.OrdinalIgnoreCase))
            {
                var rootHasChildren =
                    await _context.Folders.AsNoTracking().AnyAsync(folder => folder.ParentId == null) ||
                    await _context.Notes.AsNoTracking().AnyAsync(note => note.ParentId == null);

                return Ok(new TreeNode
                {
                    Id = RootTreeId,
                    Name = "Notes",
                    IsFolder = true,
                    HasChildren = rootHasChildren
                });
            }

            if (TryParseFolderTreeId(treeItemId, out var folderId))
            {
                var folder = await _context.Folders
                    .AsNoTracking()
                    .Where(folderItem => folderItem.Id == folderId)
                    .Select(folderItem => new
                    {
                        folderItem.Id,
                        folderItem.Name
                    })
                    .SingleOrDefaultAsync();

                if (folder == null)
                {
                    return NotFound();
                }

                var hasChildren =
                    await _context.Folders.AsNoTracking().AnyAsync(childFolder => childFolder.ParentId == folderId) ||
                    await _context.Notes.AsNoTracking().AnyAsync(childNote => childNote.ParentId == folderId);

                return Ok(new TreeNode
                {
                    Id = GetFolderTreeId(folder.Id),
                    Name = folder.Name ?? string.Empty,
                    IsFolder = true,
                    HasChildren = hasChildren
                });
            }

            if (TryParseNoteTreeId(treeItemId, out var noteId))
            {
                var note = await _context.Notes
                    .AsNoTracking()
                    .Where(noteItem => noteItem.Id == noteId)
                    .Select(noteItem => new
                    {
                        noteItem.Id,
                        noteItem.Name
                    })
                    .SingleOrDefaultAsync();

                if (note == null)
                {
                    return NotFound();
                }

                return Ok(new TreeNode
                {
                    Id = GetNoteTreeId(note.Id),
                    Name = note.Name ?? string.Empty,
                    IsFolder = false,
                    HasChildren = false
                });
            }

            return BadRequest($"Unknown tree item id: {treeItemId}");
        }

        [HttpGet("items/{treeItemId}/children")]
        public async Task<ActionResult<string[]>> GetChildren(string treeItemId)
        {
            if (string.Equals(treeItemId, RootTreeId, StringComparison.OrdinalIgnoreCase))
            {
                var topLevelFolderIds = await _context.Folders
                    .AsNoTracking()
                    .Where(folder => folder.ParentId == null)
                    .OrderBy(folder => folder.Name)
                    .Select(folder => GetFolderTreeId(folder.Id))
                    .ToListAsync();

                var topLevelNoteIds = await _context.Notes
                    .AsNoTracking()
                    .Where(note => note.ParentId == null)
                    .OrderBy(note => note.Name)
                    .Select(note => GetNoteTreeId(note.Id))
                    .ToListAsync();

                return Ok(topLevelFolderIds.Concat(topLevelNoteIds).ToArray());
            }

            if (TryParseFolderTreeId(treeItemId, out var folderId))
            {
                var childFolderIds = await _context.Folders
                    .AsNoTracking()
                    .Where(childFolder => childFolder.ParentId == folderId)
                    .OrderBy(childFolder => childFolder.Name)
                    .Select(childFolder => GetFolderTreeId(childFolder.Id))
                    .ToListAsync();

                var childNoteIds = await _context.Notes
                    .AsNoTracking()
                    .Where(childNote => childNote.ParentId == folderId)
                    .OrderBy(childNote => childNote.Name)
                    .Select(childNote => GetNoteTreeId(childNote.Id))
                    .ToListAsync();

                return Ok(childFolderIds.Concat(childNoteIds).ToArray());
            }

            if (TryParseNoteTreeId(treeItemId, out _))
            {
                return Ok(Array.Empty<string>());
            }

            return BadRequest($"Unknown tree item id: {treeItemId}");
        }
    }
}
