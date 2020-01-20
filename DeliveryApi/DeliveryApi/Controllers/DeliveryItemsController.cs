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
using System.Collections;

namespace DeliveryApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeliveryItemsController : ControllerBase
    {
        private readonly DeliveryContext _context;

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

        // GET: api/DeliveryItems/User/{User}
        [HttpGet("User/{User}")]
        public ActionResult<IEnumerable<DeliveryItem>> GetDeliveryItems(string User)
        {
            List<DeliveryItem> deliveryItemsList = new List<DeliveryItem>();

            foreach (var item in _context.DeliveryItems)
            {
                if (item.Username == User)
                    deliveryItemsList.Add(item);
            }

            return deliveryItemsList;
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

        public string CreatePointsString_toUrl(List<PointItem> pointItems)
        {
            string pointsString = "";

            int i = 0;
            foreach(var item in pointItems)
            {
                i++;
                pointsString += item.Longitude;
                pointsString += ",";
                pointsString += item.Latitude;
                if (i < pointItems.Count())
                    pointsString += ";";
            }

            return pointsString;
        }

        // GET: api/DeliveryItems/Route
        // Reurns full json from OSRM Trip
        [HttpGet("Route")]
        public ActionResult<string> GetDeliveryRoutePolyline()
        {
            List<PointItem> pointItems = new List<PointItem>();

            foreach (var item in _context.BaseItems)
            {
                pointItems.Add(new PointItem(item.Latitude, item.Longitude));
            }

            foreach (var item in _context.DeliveryItems)
            {
                pointItems.Add(new PointItem(item.Latitude, item.Longitude));
            }

            string pointsString = CreatePointsString_toUrl(pointItems);
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

                //System.Diagnostics.Debug.WriteLine(ret);
            }

            return jsonStringsign;
        }

        // GET: api/DeliveryItems/Route/{User}
        // Reurns full json from OSRM Trip
        [HttpGet("Route/{User}")]
        public ActionResult<string> GetDeliveryRoutePolylineForUser(string User)
        {
            List<PointItem> pointItems = new List<PointItem>();

            foreach (var item in _context.BaseItems)
            {
                if (item.Username == User)
                    pointItems.Add(new PointItem(item.Latitude, item.Longitude));
            }

            // if no base found...
            if (pointItems.Count() == 0)
                return NotFound();

            foreach (var item in _context.DeliveryItems)
            {
                if (item.Username == User)
                    pointItems.Add(new PointItem(item.Latitude, item.Longitude));
            }

            string pointsString = CreatePointsString_toUrl(pointItems);
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
            }

            return jsonStringsign;
        }

        List<List<List<int>>> generateStirlingUnorderedPermutations(int n, int k)
        // All possible ways of splitting a set of elements n into k sets
        // Assumtion n >= k
        {
            List<List<List<int>>> result = new List<List<List<int>>>();

            for (int i = 0; i < k; i++)
            {
                result.Add(new List<List<int>>());
                result[0].Add(new List<int>());
                result[0][i].Add(i);
            }

            System.Diagnostics.Debug.WriteLine(result);

            int remaining = n - k;

            // insert all missing values from k, k+1, ..., n
            for (int i = 0; i < remaining; i++)
            {
                List<List<List<int>>> tmp = new List<List<List<int>>>();

                // insert into each array
                foreach(var _arr in result)
                {
                    // insert into each index of array
                    for (int ii = 0; ii < _arr.Count(); ii++)
                    {
                        List<List<int>> newArr = new List<List<int>>();
                        for (int copy_i = 0; copy_i < _arr.Count(); copy_i++)
                        {
                            newArr.Add(new List<int>());
                            for (int j = 0; j < _arr[copy_i].Count(); j++)
                                newArr[copy_i].Add(_arr[copy_i][j]);
                        }

                        newArr[ii].Add(i + k);
                        tmp.Add(newArr);

                        // debug
                        /*
                        System.Diagnostics.Debug.Write("(");
                        foreach (var index in newArr)
                        {
                            foreach (var elem in index)
                                System.Diagnostics.Debug.Write(elem + " ");
                            System.Diagnostics.Debug.Write(";");
                        }
                        System.Diagnostics.Debug.Write("), ");
                        */
                        // debug
                    }

                }

                System.Diagnostics.Debug.WriteLine("");
                result = tmp;
            }

            return result;
        }

        List<string> getShortestKPathsStrings(List<PointItem> pointItems, List<PointItem> pointBases, int K)
        {
            List<string> result = new List<string>();
            double minimumPathLength = double.MaxValue;

            int itemsDeliveriesCount = pointItems.Count();

            List<List<List<int>>> generatedPermutations = generateStirlingUnorderedPermutations(itemsDeliveriesCount, K);

            foreach(var permuatation in generatedPermutations)
            {
                // debug
                System.Diagnostics.Debug.Write("(");
                foreach (var index in permuatation)
                {
                    foreach (var elem in index)
                        System.Diagnostics.Debug.Write(elem + " ");
                    System.Diagnostics.Debug.Write(";");
                }
                System.Diagnostics.Debug.Write("), ");
                // debug

                double currentLength = 0;
                List<string> currentResult = new List<string>();

                foreach(var index in permuatation)
                {
                    List<PointItem> requestItems = new List<PointItem>();

                    // one Base
                    requestItems.Add(pointBases[0]);
                    for (int elem_i = 0; elem_i < index.Count(); elem_i++)
                        requestItems.Add(pointItems[index[elem_i]]);

                    string pointsString = CreatePointsString_toUrl(requestItems);
                    string reqUrl = "http://127.0.0.1:5000/trip/v1/driving/" + pointsString + "?steps=true";
                    var httpWebRequestQR = (HttpWebRequest)WebRequest.Create(reqUrl);
                    httpWebRequestQR.ContentType = "application/json";
                    httpWebRequestQR.Method = "GET";

                    var httpResponseQR = (HttpWebResponse)httpWebRequestQR.GetResponse();
                    using (var streamReader = new StreamReader(httpResponseQR.GetResponseStream()))
                    {
                        var resultQR = streamReader.ReadToEnd();
                        string jsonStringsign = resultQR;

                        dynamic data = JObject.Parse(jsonStringsign);
                        string geometry = data.trips[0].geometry.ToString();
                        string triplengthString = data.trips[0].distance.ToString();
                        System.Diagnostics.Debug.WriteLine(triplengthString);
                        double triplength = Convert.ToDouble(triplengthString);

                        currentResult.Add(geometry);
                        currentLength += triplength;

                        //System.Diagnostics.Debug.WriteLine(geometry);
                    }
                }

                if (currentLength < minimumPathLength)
                {
                    minimumPathLength = currentLength;
                    result.Clear();
                    foreach (var currentResultItem in currentResult)
                        result.Add(currentResultItem);
                }
            }

            return result;
        }

        // GET: api/DeliveryItems/Route/Several/0
        // Reurns array of K full jsons from OSRM Trip
        [HttpGet("Route/Several/{K}")]
        public ActionResult<IEnumerable<string>> GetN_RoutesPolylines(int K)
        {
            List<PointItem> pointItems = new List<PointItem>();
            List<PointItem> pointbases = new List<PointItem>();

            foreach (var item in _context.BaseItems)
            {
                pointbases.Add(new PointItem(item.Latitude, item.Longitude));
            }

            foreach (var item in _context.DeliveryItems)
            {
                pointItems.Add(new PointItem(item.Latitude, item.Longitude));
            }

            List<string> lstring = getShortestKPathsStrings(pointItems, pointbases, K);

            return lstring;
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


        // --------------------------- BASE ---------------------------

        public string SessionUser { get; private set; }

        // GET: api/DeliveryItems/base/{User}
        [HttpGet("Base/User/{User}")]
        public ActionResult<BaseDeliveryItem> GetBasesForUser(string User)
        {
            var item = _context.BaseItems.FirstOrDefault(elem => elem.Username == User);

            if (item != null)
            {
                return item;
            }

            //var user = HttpContext.Session.GetString(SessionUser);
            //System.Diagnostics.Debug.Write("SESSION: " + SessionUser);

            return NotFound();
        }

        // GET: api/DeliveryItems/base
        [HttpGet("Base")]
        public async Task<ActionResult<IEnumerable<BaseDeliveryItem>>> GetBases()
        {
            return await _context.BaseItems.ToListAsync();
        }

        // GET: api/DeliveryItems/base/1
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

        // POST: api/DeliveryItems/base
        [HttpPost("Base")]
        public async Task<ActionResult<BaseDeliveryItem>> PostBase(BaseDeliveryItem baseItem)
        {
            foreach (var id in _context.BaseItems.Select(elem => elem.Id))
            {
                var entity = new BaseDeliveryItem { Id = id };
                _context.BaseItems.Attach(entity);
                _context.BaseItems.Remove(entity);
            }
            await _context.SaveChangesAsync();

            _context.BaseItems.Add(baseItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBaseItem), new { id = baseItem.Id }, baseItem);
        }

        // POST: api/DeliveryItems/base/User
        [HttpPost("Base/{User}")]
        public async Task<ActionResult<BaseDeliveryItem>> PostBaseForUser(string User, BaseDeliveryItem baseItem)
        {
            var item = _context.BaseItems.FirstOrDefault(elem => elem.Username == User);

            if (item != null)
            {
                _context.BaseItems.Remove(_context.BaseItems.Single(a => a.Username == User));
                _context.SaveChanges();
            }

            _context.BaseItems.Add(baseItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBaseItem), new { id = baseItem.Id }, baseItem);
        }
    }
}
