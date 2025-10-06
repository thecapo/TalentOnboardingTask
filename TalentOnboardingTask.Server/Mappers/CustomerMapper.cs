using TalentOnboardingTask.Server.Dtos;
using TalentOnboardingTask.Server.Models;

namespace TalentOnboardingTask.Server.Mappers
{
    public static class CustomerMapper
    {
        public static Customer DtoToEntity(CustomerDto customerDto)
        {
            var entity = new Customer
            {
                Id = customerDto.Id,
                Name = customerDto.Name,
                Address = customerDto.Address
            };

            return entity;
        }

        public static CustomerDto EntityToDto(Customer customer)
        {
            var dto = new CustomerDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Address = customer.Address
            };

            return dto;
        }
    }
}
