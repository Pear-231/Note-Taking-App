using Backend.Contracts;
using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/tree")]
    public class TreeController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        [HttpGet("nodes/{nodeId:guid}")]
        public async Task<ActionResult<TreeNode>> GetNode(Guid nodeId)
        {
            var folder = await _context.Folders
                .AsNoTracking()
                .Select(folderItem => new
                {
                    folderItem.Id,
                    folderItem.Name
                })
                .SingleOrDefaultAsync(folderItem => folderItem.Id == nodeId);

            if (folder != null)
            {
                var hasChildFolders = await _context.Folders
                    .AsNoTracking()
                    .AnyAsync(childFolder => childFolder.ParentId == nodeId);

                var hasChildNotes = await _context.Notes
                    .AsNoTracking()
                    .AnyAsync(childNote => childNote.ParentId == nodeId);

                var hasChildren = hasChildFolders || hasChildNotes;

                return Ok(TreeNode.Create(folder.Id, folder.Name, hasChildren));
            }

            var note = await _context.Notes
                .AsNoTracking()
                .Select(noteItem => new
                {
                    noteItem.Id,
                    noteItem.Name
                })
                .SingleOrDefaultAsync(noteItem => noteItem.Id == nodeId);

            if (note != null)
                return Ok(TreeNode.Create(note.Id, note.Name));

            return NotFound();
        }

        [HttpGet("nodes/children")]
        public async Task<ActionResult<TreeNode[]>> GetChildren([FromQuery] Guid? parentId)
        {
            var childFolders = await _context.Folders
                .AsNoTracking()
                .Where(folderItem => folderItem.ParentId == parentId)
                .OrderBy(folderItem => folderItem.Name)
                .Select(folderItem => new
                {
                    folderItem.Id,
                    folderItem.Name
                })
                .ToListAsync();

            var childNotes = await _context.Notes
                .AsNoTracking()
                .Where(noteItem => noteItem.ParentId == parentId)
                .OrderBy(noteItem => noteItem.Name)
                .Select(noteItem => new
                {
                    noteItem.Id,
                    noteItem.Name
                })
                .ToListAsync();

            var childFolderIds = childFolders
                .Select(folderItem => folderItem.Id)
                .ToList();

            var parentIdsWithChildFolders = await _context.Folders
                .AsNoTracking()
                .Where(folderItem =>
                    folderItem.ParentId != null &&
                    childFolderIds.Contains(folderItem.ParentId.Value))
                .Select(folderItem => folderItem.ParentId!.Value)
                .Distinct()
                .ToListAsync();

            var parentIdsWithChildNotes = await _context.Notes
                .AsNoTracking()
                .Where(noteItem =>
                    noteItem.ParentId != null &&
                    childFolderIds.Contains(noteItem.ParentId.Value))
                .Select(noteItem => noteItem.ParentId!.Value)
                .Distinct()
                .ToListAsync();

            var parentIdsWithChildren = parentIdsWithChildFolders
                .Concat(parentIdsWithChildNotes)
                .ToHashSet();

            var folderNodes = childFolders
                .Select(folderItem => TreeNode.Create(
                    folderItem.Id,
                    folderItem.Name,
                    parentIdsWithChildren.Contains(folderItem.Id)))
                .ToList();

            var noteNodes = childNotes
                .Select(noteItem => TreeNode.Create(noteItem.Id, noteItem.Name))
                .ToList();

            return folderNodes
                .Concat(noteNodes)
                .ToArray();
        }
    }
}
