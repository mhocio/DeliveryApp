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
    [Route("api/[controller]")]
    [ApiController]
    public class DeliveryItemsController : ControllerBase
    {
        private readonly DeliveryContext _context;
        private readonly BaseDeliveriesContext BaseContext;

        public DeliveryItemsController(DeliveryContext context)
        {
            _context = context;
        }

        // GET: api/DeliveryItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeliveryItem>>> GetDeliveryItems()
        {
            return await _context.DeliveryItems.ToListAsync();
        }

        // GET: api/DeliveryItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DeliveryItem>> GetDeliveryItem(long id)
        {
            var deliveryItem = await _context.DeliveryItems.FindAsync(id);

            if (deliveryItem == null)
            {
                return NotFound();
            }

            return deliveryItem;
        }

        // GET: api/DeliveryItems/Route
        [HttpGet("Route")]
        public ActionResult<List<PointItem>> GetDeliveryRoute()
        {
            var deliveriesItems = _context.DeliveryItems;

            List<PointItem> ret = new List<PointItem>();

            foreach (var item in deliveriesItems)
            {
                PointItem point = new PointItem
                {
                    Latitude = item.Latitude,
                    Longitude = item.Longitude
                };
                ret.Add(point);
            }

            var shuffled = ret.OrderBy(a => Guid.NewGuid()).ToList();

            // Now we have just one base
            var bases = _context.BaseItems;

            foreach (var item in bases)
            {
                PointItem point = new PointItem
                {
                    Latitude = item.Latitude,
                    Longitude = item.Longitude
                };
                shuffled.Insert(0, point);  //Instert base as the beggining of route
            }
            
            return shuffled;
        }

        // PUT: api/DeliveryItems/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeliveryItem(long id, DeliveryItem deliveryItem)
        {
            if (id != deliveryItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(deliveryItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeliveryItemExists(id))
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

        // POST: api/DeliveryItems
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<DeliveryItem>> PostDeliveryItem(DeliveryItem deliveryItem)
        {
            _context.DeliveryItems.Add(deliveryItem);
            await _context.SaveChangesAsync();

            //return CreatedAtAction("GetDeliveryItem", new { id = deliveryItem.Id }, deliveryItem);
            return CreatedAtAction(nameof(GetDeliveryItem), new { id = deliveryItem.Id }, deliveryItem);
        }

        // DELETE: api/DeliveryItems/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<DeliveryItem>> DeleteDeliveryItem(long id)
        {
            var deliveryItem = await _context.DeliveryItems.FindAsync(id);
            if (deliveryItem == null)
            {
                return NotFound();
            }

            _context.DeliveryItems.Remove(deliveryItem);
            await _context.SaveChangesAsync();

            return deliveryItem;
        }



        private bool DeliveryItemExists(long id)
        {
            return _context.DeliveryItems.Any(e => e.Id == id);
        }

        // BASE


        // GET: api/base
        [HttpGet("Base")]
        public async Task<ActionResult<IEnumerable<BaseDeliveryItem>>> GetBases()
        {
            return await _context.BaseItems.ToListAsync();
        }

        // GET: api/base/1
        [HttpGet("Base/{id}")]
        public async Task<ActionResult<BaseDeliveryItem>> GetBaseItem(long id)
        {
            var item = await _context.BaseItems.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }

        // POST: api/base
        [HttpPost("Base")]
        public async Task<ActionResult<BaseDeliveryItem>> PostBase(BaseDeliveryItem baseItem)
        {
            foreach (var id in _context.BaseItems.Select(e => e.Id))
            {
                var entity = new BaseDeliveryItem { Id = id };
                _context.BaseItems.Attach(entity);
                _context.BaseItems.Remove(entity);
            }
            await _context.SaveChangesAsync();

            _context.BaseItems.Add(baseItem);
            await _context.SaveChangesAsync();

            //return CreatedAtAction("GetDeliveryItem", new { id = deliveryItem.Id }, deliveryItem);
            return CreatedAtAction(nameof(GetBaseItem), new { id = baseItem.Id }, baseItem);
        }
    }
}
