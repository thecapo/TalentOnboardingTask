using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalentOnboardingTask.Server.Models;
using TalentOnboardingTask.Server.Dtos;
using TalentOnboardingTask.Server.Mappers;

namespace TalentOnboardingTask.Server.Controllers
{
    [EnableCors("AllowSpecificOrigins")]
    [Route("api/[controller]")]
    [ApiController]
    public class StoresController : ControllerBase
    {
        private readonly OnboardingTaskDBContext _context;
        private readonly ILogger<StoresController> _logger;

        public StoresController(OnboardingTaskDBContext context, ILogger<StoresController> logger)
        {
            _context = context;
            _logger = logger;
            _context.Database.EnsureCreated();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreDto>>> GetAllStores([FromQuery] QueryParameters queryParameters)
        {
            try
            {
                IQueryable<StoreDto> storeDto = _context.Stores;

                storeDto = storeDto
                    .Skip(queryParameters.Size * (queryParameters.Page - 1))
                    .Take(queryParameters.Size);

                var stores = await _context.Stores.Select(s => StoreMapper.EntityToDto(s)).ToListAsync();

                if (stores == null || !stores.Any())
                {
                    _logger.LogInformation("No stores found in the database.");
                    return NotFound("No stores available.");
                }

                return Ok(new
                {
                    Message = "All store/s found successfully.",
                    stores
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving stores.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StoreDto>> GetStore(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid store ID.");
            }

            try
            {
                var store = await _context.Stores.FindAsync(id);

                if (store == null)
                {
                    _logger.LogWarning("Store with ID {StoreId} not found.", id);
                    return NotFound($"Store with ID {id} not found.");
                }

                return Ok(new
                {
                    Message = "Store found successfully.",
                    GetStore = StoreMapper.EntityToDto(store)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving store with ID {StoreId}", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPost]
        public async Task<ActionResult<StoreDto>> PostStore(StoreDto store)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (store == null)
            {
                return BadRequest("Store data cannot be null.");
            }

            try
            {
                var storeEntity = StoreMapper.DtoToEntity(store);

                _context.Stores.Add(storeEntity);
                await _context.SaveChangesAsync();

                CreatedAtAction(nameof(GetStore), new { id = storeEntity.Id }, StoreMapper.EntityToDto(storeEntity));

                return Ok(new
                {
                    Message = "Store created successfully.",
                    storeEntity
                });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating a new store.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutStore(int id, StoreDto store)
        {
            if (id != store.Id)
            {
                return BadRequest("ID in the path does not match the store's ID.");
            }

            if (store == null)
            {
                return BadRequest("Store data cannot be null.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var storeEntity = StoreMapper.DtoToEntity(store);
                _context.Entry(storeEntity).State = EntityState.Modified;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Store updated successfully.",
                    storeEntity
                });

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Stores.Any(c => c.Id == id))
                {
                    _logger.LogWarning("Store with ID {StoreId} not found for update.", id);
                    return NotFound($"Store with ID {id} not found.");
                }

                _logger.LogError("Concurrency exception while updating store with ID {StoreId}.", id);
                return StatusCode(500, "A concurrency error occurred.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating store with ID {StoreId}.", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteStore(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid store ID.");
            }

            try
            {
                var store = await _context.Stores.FindAsync(id);

                if (store == null)
                {
                    _logger.LogWarning("Store with ID {StoreId} not found for deletion.", id);
                    return NotFound($"Store with ID {id} not found.");
                }

                _context.Stores.Remove(store);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Store deleted successfully.",
                    DeletedStore = StoreMapper.EntityToDto(store)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting store with ID {StoreId}.", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
    }
}