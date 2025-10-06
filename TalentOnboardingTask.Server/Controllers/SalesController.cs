using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalentOnboardingTask.Server.Models;
using TalentOnboardingTask.Server.Dtos;
using TalentOnboardingTask.Server.Mappers;

namespace TalentOnboardingTask.Server.Controllers
{
    // CORS 
    [EnableCors("AllowSpecificOrigins")]
    // CORS END -----------------------------------------------------

    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly OnboardingTaskDBContext _context;

        public SalesController(OnboardingTaskDBContext context)
        {
            _context = context;
            _context.Database.EnsureCreated();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetAllSales()
        {
            var sales = await (
                from sale in _context.Sales

                    // LEFT JOIN on Customer
                join customer in _context.Customers
                    on sale.CustomerId equals customer.Id into customerGroup
                from customer in customerGroup.DefaultIfEmpty()

                    // LEFT JOIN on Product
                join product in _context.Products
                    on sale.ProductId equals product.Id into productGroup
                from product in productGroup.DefaultIfEmpty()

                    // LEFT JOIN on Store
                join store in _context.Stores
                    on sale.StoreId equals store.Id into storeGroup
                from store in storeGroup.DefaultIfEmpty()

                select new
                {
                    Id = sale.Id,

                    CustomerId = customer != null ? customer.Id : (int?)null, // ids are called so no duplicates if have similar names
                    ProductId = product != null ? product.Id : (int?)null,
                    StoreId = store != null ? store.Id : (int?)null,

                    Customer = customer != null ? customer.Name : "[Deleted Customer]",
                    Product = product != null ? product.Name : "[Deleted Product]",
                    Store = store != null ? store.Name : "[Deleted Store]",
                    DateSold = sale.DateSold
                }
            ).ToListAsync();

            if (sales.Count > 0)
            {
                return Ok(sales);
            }
            else
            {
                return BadRequest("There are no sales available.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SaleDto>> GetSale(int id)
        {
            var sale = await _context.Sales.FindAsync(id);

            if (sale == null)
            {
                return NotFound();
            }

            return Ok(SaleMapper.EntityToDto(sale));
        }

        [HttpPost]
        public async Task<ActionResult<SaleDto>> PostSale(SaleDto sale)
        {
            _context.Sales.Add(SaleMapper.DtoToEntity(sale));
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetSale),
                new { id = sale.Id },
                SaleMapper.DtoToEntity(sale));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutSale(int id, SaleDto sale)
        {
            if (id != sale.Id)
            {
                return BadRequest();
            }

            _context.Entry(SaleMapper.DtoToEntity(sale)).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Sales.Any(s => s.Id == id))
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

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSale(int id)
        {
            var sale = await _context.Sales.FindAsync(id);
            if (sale == null)
            {
                return NotFound();
            }

            _context.Sales.Remove(sale);
            await _context.SaveChangesAsync();

            return Ok(sale);
        }
    }
}
