using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApi.Models
{
    public class BaseDeliveriesContext : DbContext
    {
        public BaseDeliveriesContext(DbContextOptions<BaseDeliveriesContext> options)
            : base(options)
        {
        }

        public DbSet<BaseDeliveryItem> BaseDeliveriesItems { get; set; }
    }
}

