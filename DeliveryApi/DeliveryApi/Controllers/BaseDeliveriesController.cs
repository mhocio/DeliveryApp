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
    [Route("api/Base")]
    [ApiController]
    public class BaseDeliveriesController : ControllerBase
    {
        private readonly BaseDeliveriesContext _context;

        public BaseDeliveriesController(BaseDeliveriesContext context)
        {
            _context = context;
        }

        // GET: api/base
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BaseDeliveryItem>>> GetBases()
        {
            return await _context.BaseDeliveriesItems.ToListAsync();
        }

        // GET: api/base/1
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseDeliveryItem>> GetBaseItem(long id)
        {
            var item = await _context.BaseDeliveriesItems.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }


        // GET: api/base
        [HttpGet("Route")]
        public IEnumerable<BaseDeliveryItem> GetBasesEnumerable()
        {
            return _context.BaseDeliveriesItems.ToList();
        }

        // POST: api/base
        [HttpPost]
        public async Task<ActionResult<BaseDeliveryItem>> PostBase(BaseDeliveryItem baseItem)
        {
            foreach (var id in _context.BaseDeliveriesItems.Select(e => e.Id))
            {
                var entity = new BaseDeliveryItem { Id = id };
                _context.BaseDeliveriesItems.Attach(entity);
                _context.BaseDeliveriesItems.Remove(entity);
            }
            await _context.SaveChangesAsync();

            _context.BaseDeliveriesItems.Add(baseItem);
            await _context.SaveChangesAsync();

            //return CreatedAtAction("GetDeliveryItem", new { id = deliveryItem.Id }, deliveryItem);
            return CreatedAtAction(nameof(GetBaseItem), new { id = baseItem.Id }, baseItem);
        }
    }
}
