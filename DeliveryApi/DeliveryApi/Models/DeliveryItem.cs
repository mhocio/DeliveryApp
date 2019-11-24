using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DeliveryApi.Models
{
    public class DeliveryItem
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string Size { get; set; }
    }
}
