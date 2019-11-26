﻿using System;
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
        public List<PointItem> GetDeliveryRoute()
        {
            //var bases = new BaseDeliveriesController(BaseContext).GetBases();
            var bases = new BaseDeliveriesController(BaseContext).GetBasesEnumerable();

            var items = _context.DeliveryItems;

            List<PointItem> ret = new List<PointItem>();

            foreach (var item in items)
            {
                PointItem point = new PointItem();
                point.Latitude = item.Latitude;
                point.Longitude = item.Longitude;
                ret.Add(point);
            }

            //var tmpTask = bases.Result.Value;
            var tmpTask = bases;

            foreach (var item in tmpTask)
            {
                PointItem point = new PointItem();
                point.Latitude = item.Latitude;
                point.Longitude = item.Longitude;
                ret.Add(point);
            }

            return ret;

            //return await packages;
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
    }
}
