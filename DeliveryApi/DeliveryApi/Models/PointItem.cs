using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DeliveryApi.Models
{
    public class PointItem
    {
        public string Latitude { get; set; }
        public string Longitude { get; set; }

        public PointItem(string Latitude, string Longitude)
        {
            this.Latitude = Latitude;
            this.Longitude = Longitude;
        }

        public PointItem()
        {
        }
    }
}
