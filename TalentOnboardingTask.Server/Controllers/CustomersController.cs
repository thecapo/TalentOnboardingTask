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
    public class CustomersController : ControllerBase
    {
        private readonly OnboardingTaskDBContext _context;
        private readonly ILogger<CustomersController> _logger;

        public CustomersController(OnboardingTaskDBContext context, ILogger<CustomersController> logger)
        {
            _context = context;
            _logger = logger;
            _context.Database.EnsureCreated();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAllCustomers([FromQuery] QueryParameters queryParameters)
        {
            try
            {
                IQueryable<CustomerDto> customerDto = _context.Customers;

                customerDto = customerDto
                    .Skip(queryParameters.Size * (queryParameters.Page - 1))
                    .Take(queryParameters.Size);

                var customers = await _context.Customers.Select(s => CustomerMapper.EntityToDto(s)).ToListAsync();

                if (customers == null || !customers.Any())
                {
                    _logger.LogInformation("No customers found in the database.");
                    return NotFound("No customers available.");
                }

                return Ok(new
                {
                    Message = "All customer/s found successfully.",
                    customers
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving customers.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDto>> GetCustomer(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid customer ID.");
            }

            try
            {
                var customer = await _context.Customers.FindAsync(id);

                if (customer == null)
                {
                    _logger.LogWarning("Customer with ID {CustomerId} not found.", id);
                    return NotFound($"Customer with ID {id} not found.");
                }

                return Ok(new
                {
                    Message = "Customer found successfully.",
                    GetCustomer = CustomerMapper.EntityToDto(customer)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving customer with ID {CustomerId}", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPost]
        public async Task<ActionResult<CustomerDto>> PostCustomer(CustomerDto customer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (customer == null)
            {
                return BadRequest("Customer data cannot be null.");
            }

            try
            {
                var customerEntity = CustomerMapper.DtoToEntity(customer);

                _context.Customers.Add(customerEntity);
                await _context.SaveChangesAsync();

                CreatedAtAction(nameof(GetCustomer), new { id = customerEntity.Id }, CustomerMapper.EntityToDto(customerEntity));

                return Ok(new
                {
                    Message = "Customer created successfully.",
                    customerEntity
                });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating a new customer.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutCustomer(int id, CustomerDto customer)
        {
            if (id != customer.Id)
            {
                return BadRequest("ID in the path does not match the customer's ID.");
            }

            if (customer == null)
            {
                return BadRequest("Customer data cannot be null.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var customerEntity = CustomerMapper.DtoToEntity(customer);
                _context.Entry(customerEntity).State = EntityState.Modified;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Customer updated successfully.",
                    customerEntity
                });

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Customers.Any(c => c.Id == id))
                {
                    _logger.LogWarning("Customer with ID {CustomerId} not found for update.", id);
                    return NotFound($"Customer with ID {id} not found.");
                }

                _logger.LogError("Concurrency exception while updating customer with ID {CustomerId}.", id);
                return StatusCode(500, "A concurrency error occurred.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating customer with ID {CustomerId}.", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCustomer(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid customer ID.");
            }

            try
            {
                var customer = await _context.Customers.FindAsync(id);

                if (customer == null)
                {
                    _logger.LogWarning("Customer with ID {CustomerId} not found for deletion.", id);
                    return NotFound($"Customer with ID {id} not found.");
                }

                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Customer deleted successfully.",
                    DeletedCustomer = CustomerMapper.EntityToDto(customer)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting customer with ID {CustomerId}.", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
    }
}