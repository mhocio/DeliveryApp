using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApi.Models
{
    public class DeliveryContext : DbContext
    {
        public DeliveryContext(DbContextOptions<DeliveryContext> options)
            : base(options)
        {
        }

        public DbSet<DeliveryItem> DeliveryItems { get; set; }
    }
}
