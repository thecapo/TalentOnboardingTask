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
    public class ProductsController : ControllerBase
    {
        private readonly OnboardingTaskDBContext _context;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(OnboardingTaskDBContext context, ILogger<ProductsController> logger)
        {
            _context = context;
            _logger = logger;
            _context.Database.EnsureCreated();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts([FromQuery] QueryParameters queryParameters)
        {
            try
            {
                IQueryable<ProductDto> productDto = _context.Products;

                productDto = productDto
                    .Skip(queryParameters.Size * (queryParameters.Page - 1))
                    .Take(queryParameters.Size);

                var products = await _context.Products.Select(s => ProductMapper.EntityToDto(s)).ToListAsync();

                if (products == null || !products.Any())
                {
                    _logger.LogInformation("No products found in the database.");
                    return NotFound("No products available.");
                }

                return Ok(new
                {
                    Message = "All product/s found successfully.",
                    products
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving products.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid product ID.");
            }

            try
            {
                var product = await _context.Products.FindAsync(id);

                if (product == null)
                {
                    _logger.LogWarning("Product with ID {ProductId} not found.", id);
                    return NotFound($"Product with ID {id} not found.");
                }

                return Ok(new
                {
                    Message = "Product found successfully.",
                    GetProduct = ProductMapper.EntityToDto(product)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving product with ID {ProductId}", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> PostProduct(ProductDto product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (product == null)
            {
                return BadRequest("Product data cannot be null.");
            }

            try
            {
                var productEntity = ProductMapper.DtoToEntity(product);

                _context.Products.Add(productEntity);
                await _context.SaveChangesAsync();

                CreatedAtAction(nameof(GetProduct), new { id = productEntity.Id }, ProductMapper.EntityToDto(productEntity));

                return Ok(new
                {
                    Message = "Product created successfully.",
                    productEntity
                });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating a new product.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutProduct(int id, ProductDto product)
        {
            if (id != product.Id)
            {
                return BadRequest("ID in the path does not match the product's ID.");
            }

            if (product == null)
            {
                return BadRequest("Product data cannot be null.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var productEntity = ProductMapper.DtoToEntity(product);
                _context.Entry(productEntity).State = EntityState.Modified;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Product updated successfully.",
                    productEntity
                });

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(c => c.Id == id))
                {
                    _logger.LogWarning("Product with ID {ProductId} not found for update.", id);
                    return NotFound($"Product with ID {id} not found.");
                }

                _logger.LogError("Concurrency exception while updating product with ID {ProductId}.", id);
                return StatusCode(500, "A concurrency error occurred.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating product with ID {ProductId}.", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid product ID.");
            }

            try
            {
                var product = await _context.Products.FindAsync(id);

                if (product == null)
                {
                    _logger.LogWarning("Product with ID {ProductId} not found for deletion.", id);
                    return NotFound($"Product with ID {id} not found.");
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Product deleted successfully.",
                    DeletedProduct = ProductMapper.EntityToDto(product)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting product with ID {ProductId}.", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
    }
}