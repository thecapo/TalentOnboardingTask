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
    public class StoresController : ControllerBase
    {
        private readonly OnboardingTaskDBContext _context;

        public StoresController(OnboardingTaskDBContext context)
        {
            _context = context;
            _context.Database.EnsureCreated();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreDto>>> GetAllStores([FromQuery] QueryParameters queryParameters)
        {
            IQueryable<StoreDto> storeDto = _context.Stores;

            // set limit and size
            storeDto = storeDto
                .Skip(queryParameters.Size * (queryParameters.Page - 1))
                .Take(queryParameters.Size);

            var stores = await _context.Stores.Select(s => StoreMapper.EntityToDto(s)).ToListAsync();

            if (stores.Count > 0)
            {
                return Ok(await storeDto.ToArrayAsync());
            }
            else
            {
                return BadRequest("There are no stores available.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StoreDto>> GetStore(int id)
        {
            var stores = await _context.Stores.FindAsync(id);

            if (stores == null)
            {
                return NotFound();
            }

            return Ok(StoreMapper.EntityToDto(stores));
        }

        [HttpPost]
        public async Task<ActionResult<StoreDto>> PostStore(StoreDto storeDto)
        {
            var storeEntity = StoreMapper.DtoToEntity(storeDto);

            _context.Stores.Add(storeEntity);
            await _context.SaveChangesAsync(); // storeEntity.Id is now set by DB

            var resultDto = StoreMapper.EntityToDto(storeEntity);

            return CreatedAtAction(
                nameof(GetStore),
                new { id = storeEntity.Id }, 
                resultDto);
        }


        [HttpPut("{id}")]
        public async Task<ActionResult> PutStore(int id, StoreDto store)
        {
            if (id != store.Id)
            {
                return BadRequest();
            }

            _context.Entry(StoreMapper.DtoToEntity(store)).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Stores.Any(s => s.Id == id))
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
        public async Task<ActionResult> DeleteStore(int id)
        {
            var store = await _context.Stores.FindAsync(id);
            if (store == null)
            {
                return NotFound();
            }

            _context.Stores.Remove(store);
            await _context.SaveChangesAsync();

            return Ok(store);
        }
    }
}