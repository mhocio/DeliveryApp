using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DeliveryApi.Models;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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

        // GET: api/DeliveryItems/Route2
        [HttpGet("Route2")]
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

        // GET: api/DeliveryItems/Route
        // Reurns full json from OSRM Trip
        [HttpGet("Route")]
        public ActionResult<string> GetDeliveryRoutePolyline()
        {
            var deliveriesItems = _context.DeliveryItems;

            string pointsString = "";

            // Now we have just one base
            var bases = _context.BaseItems;

            foreach (var item in bases)
            {
                pointsString += item.Longitude;
                pointsString += ",";
                pointsString += item.Latitude;
                pointsString += ";";
            }

            int i = 0;
            int totalCount = deliveriesItems.Count();

            foreach (var item in deliveriesItems)
            {
                i++;
                pointsString += item.Longitude;
                pointsString += ",";
                pointsString += item.Latitude;
                if (i < totalCount)
                    pointsString += ";";
            }

            string reqUrl = "http://127.0.0.1:5000/trip/v1/driving/" + pointsString + "?steps=true";

            var httpWebRequestQR = (HttpWebRequest)WebRequest.Create(reqUrl);
            httpWebRequestQR.ContentType = "application/json";
            httpWebRequestQR.Method = "GET";

            var httpResponseQR = (HttpWebResponse)httpWebRequestQR.GetResponse();

            string jsonStringsign;
            using (var streamReader = new StreamReader(httpResponseQR.GetResponseStream()))
            {
                var resultQR = streamReader.ReadToEnd();
                jsonStringsign = resultQR;

                //dynamic data = JObject.Parse(jsonStringsign);
                //ret = data.trips[0].geometry.ToString();

                // https://app.quicktype.io/#l=cs&r=json2csharp
                // solution did not work
                //OSRM_return = JsonConvert.DeserializeObject<OSRMTripReturnItem>(jsonStringsign);
            }

            return jsonStringsign;
        }

        [HttpGet("Route/{ids}")]
        public ActionResult<string> GetDeliveryRoutePolyline(string ids)
        {
            string[] valus = ids.Split(",");
            List<long> values = new List<long>();
            for (int j = 0; j < valus.Length - 1; j++)
                values.Add(Int64.Parse(valus[j]));

            string pointsString = "";

            var bases = _context.BaseItems;

            foreach (var item in bases)
            {
                pointsString += item.Longitude;
                pointsString += ",";
                pointsString += item.Latitude;
                pointsString += ";";
            }

            int i = 0;
            int totalCount = values.Count();

            foreach (var v in values)
            {
                var item = _context.DeliveryItems.Find(v);
                i++;
                pointsString += item.Longitude;
                pointsString += ",";
                pointsString += item.Latitude;
                if (i < totalCount)
                    pointsString += ";";
            }

            return null;
            /*
            string reqUrl = "http://127.0.0.1:5000/trip/v1/driving/" + pointsString + "?steps=true";

            var httpWebRequestQR = (HttpWebRequest)WebRequest.Create(reqUrl);
            httpWebRequestQR.ContentType = "application/json";
            httpWebRequestQR.Method = "GET";

            var httpResponseQR = (HttpWebResponse)httpWebRequestQR.GetResponse();

            string jsonStringsign;
            using (var streamReader = new StreamReader(httpResponseQR.GetResponseStream()))
            {
                var resultQR = streamReader.ReadToEnd();
                jsonStringsign = resultQR;

                //dynamic data = JObject.Parse(jsonStringsign);
                //ret = data.trips[0].geometry.ToString();

                // https://app.quicktype.io/#l=cs&r=json2csharp
                // solution did not work
                //OSRM_return = JsonConvert.DeserializeObject<OSRMTripReturnItem>(jsonStringsign);
            }

            return jsonStringsign;*/
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
