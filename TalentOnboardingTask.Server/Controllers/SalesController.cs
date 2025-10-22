using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalentOnboardingTask.Server.Models;
using TalentOnboardingTask.Server.Dtos;
using TalentOnboardingTask.Server.Mappers;

namespace TalentOnboardingTask.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly OnboardingTaskDBContext _context;
        private readonly ILogger<SalesController> _logger;

        public SalesController(OnboardingTaskDBContext context, ILogger<SalesController> logger)
        {
            _context = context;
            _logger = logger;
            _context.Database.EnsureCreated();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetAllSales([FromQuery] QueryParameters queryParameters)
        {
            try
            {
                IQueryable<SaleDto> saleDto = _context.Sales;

                saleDto = saleDto
                    .Skip(queryParameters.Size * (queryParameters.Page - 1))
                    .Take(queryParameters.Size);

                var pagedSales = await _context.Sales.Select(s => SaleMapper.EntityToDto(s)).ToListAsync();

                if (pagedSales == null || !pagedSales.Any())
                {
                    _logger.LogInformation("No sales found in the database.");
                    return NotFound("No sales available.");
                }

                var sales = await _context.Sales
                    .Include(s => s.Customer)
                    .Include(s => s.Product)
                    .Include(s => s.Store)
                    .Select(sale => new
                    {
                        Id = sale.Id,
                        CustomerId = sale.Customer != null ? sale.CustomerId : (int?)null, // ids are called so no duplicates if have similar names
                        ProductId = sale.Product != null ? sale.ProductId : (int?)null,
                        StoreId = sale.Store != null ? sale.StoreId : (int?)null,

                        Customer = sale.Customer != null ? sale.Customer.Name : "[Deleted Customer]",
                        Product = sale.Product != null ? sale.Product.Name : "[Deleted Product]",
                        Store = sale.Store != null ? sale.Store.Name : "[Deleted Store]",
                        DateSold = sale.DateSold
                    })
                .ToListAsync();

                return Ok(new
                {
                    Message = "All sale/s found successfully.",
                    sales
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving sales.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SaleDto>> GetSale(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid sale ID.");
            }

            try
            {
                var sale = await _context.Sales.FindAsync(id);

                if (sale == null)
                {
                    _logger.LogWarning("Sale with ID {SaleId} not found.", id);
                    return NotFound($"Sale with ID {id} not found.");
                }

                return Ok(new
                {
                    Message = "Sale found successfully.",
                    GetSale = SaleMapper.EntityToDto(sale)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving sale with ID {SaleId}", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPost]
        public async Task<ActionResult<SaleDto>> PostSale(SaleDto sale)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (sale == null)
            {
                return BadRequest("Sale data cannot be null.");
            }

            if (sale.CustomerId == 0)
                return BadRequest("CustomerId needs to be set to null or correct id.");
            if (sale.ProductId == 0)
                return BadRequest("ProductId needs to be set to null or correct id.");
            if (sale.StoreId == 0)
                return BadRequest("StoreId needs to be set to null or correct id.");

            try
            {
                var saleEntity = SaleMapper.DtoToEntity(sale);

                _context.Sales.Add(saleEntity);
                await _context.SaveChangesAsync();

                CreatedAtAction(nameof(GetSale), new { id = saleEntity.Id }, SaleMapper.EntityToDto(saleEntity));

                return Ok(new
                {
                    Message = "Sale created successfully.",
                    saleEntity
                });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating a new sale.");
                return StatusCode(500, "A concurrency error occurred check if correct id or set to null.");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutSale(int id, SaleDto sale)
        {
            if (id != sale.Id)
            {
                return BadRequest("ID in the path does not match the sale's ID.");
            }

            if (sale == null)
            {
                return BadRequest("Sale data cannot be null.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (sale.CustomerId == 0)
                return BadRequest("CustomerId needs to be set to null or correct id.");
            if (sale.ProductId == 0)
                return BadRequest("ProductId needs to be set to null or correct id.");
            if (sale.StoreId == 0)
                return BadRequest("StoreId needs to be set to null or correct id.");

            try
            {
                var saleEntity = SaleMapper.DtoToEntity(sale);
                _context.Entry(saleEntity).State = EntityState.Modified;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Sale updated successfully.",
                    saleEntity
                });

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Sales.Any(c => c.Id == id))
                {
                    _logger.LogWarning("Sale with ID {SaleId} not found for update.", id);
                    return NotFound($"Sale with ID {id} not found.");
                }

                _logger.LogError("Concurrency exception while updating sale with ID {SaleId}.", id);
                return StatusCode(500, "A concurrency error occurred.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating sale with ID {SaleId}.", id);
                return StatusCode(500, "A concurrency error occurred check if correct id or set to null.");

            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSale(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid sale ID.");
            }

            try
            {
                var sale = await _context.Sales.FindAsync(id);

                if (sale == null)
                {
                    _logger.LogWarning("Sale with ID {SaleId} not found for deletion.", id);
                    return NotFound($"Sale with ID {id} not found.");
                }

                _context.Sales.Remove(sale);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Sale deleted successfully.",
                    DeletedSale = SaleMapper.EntityToDto(sale)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting sale with ID {SaleId}.", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
    }
}
