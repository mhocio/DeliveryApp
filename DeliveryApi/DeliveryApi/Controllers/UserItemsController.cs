using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DeliveryApi.Models;

namespace DeliveryApi.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UserItemsController : ControllerBase
    {
        private readonly UserContext _context;

        public UserItemsController(UserContext context)
        {
            _context = context;
        }

        // GET: api/UserItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserItem>>> GetUserItems()
        {
            return await _context.UserItems.ToListAsync();
        }

        // GET: api/UserItems/5
        [HttpGet("byId/{id}")]
        public async Task<ActionResult<UserItem>> GetUserItem(long id)
        {
            var userItem = await _context.UserItems.FindAsync(id);

            if (userItem == null)
            {
                return NotFound();
            }

            return userItem;
        }

        [HttpGet("byUser/{user}/{pw}")]
        public async Task<ActionResult<UserItem>> GetUserItem(string user, string pw)
        {
            var userItem = await _context.UserItems.Where(x => x.Username == user).FirstAsync();

            if (pw != userItem.Password)
                return NotFound();
                //return BadRequest();

            if (userItem == null)
            {
                return NotFound();
            }

            return userItem;
        }

        // PUT: api/UserItems/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserItem(long id, UserItem userItem)
        {
            if (id != userItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(userItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        public string SessionUser { get; private set; }

        // POST: api/UserItems
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<UserItem>> PostUserItem(UserItem userItem)
        {
            var checkUser = await _context.UserItems.Where(x => x.Username == userItem.Username).AnyAsync();

            if (checkUser == true)
                return BadRequest();

            _context.UserItems.Add(userItem);

            // HttpContext.Session.SetString(SessionUser, userItem.Username);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserItem), new { id = userItem.Id }, userItem);
        }

        // DELETE: api/UserItems/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserItem>> DeleteUserItem(long id)
        {
            var userItem = await _context.UserItems.FindAsync(id);
            if (userItem == null)
            {
                return NotFound();
            }

            _context.UserItems.Remove(userItem);
            await _context.SaveChangesAsync();

            return userItem;
        }

        private bool UserItemExists(long id)
        {
            return _context.UserItems.Any(e => e.Id == id);
        }
    }
}
