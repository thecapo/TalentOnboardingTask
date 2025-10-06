using TalentOnboardingTask.Server.Dtos;
using TalentOnboardingTask.Server.Models;

namespace TalentOnboardingTask.Server.Mappers
{
    public static class SaleMapper
    {
        public static Sale DtoToEntity(SaleDto saleDto)
        {
            var entity = new Sale
            {
                Id = saleDto.Id,
                DateSold = saleDto.DateSold,
                ProductId = saleDto.ProductId,
                CustomerId = saleDto.CustomerId,
                StoreId = saleDto.StoreId
            };

            return entity;
        }

        public static SaleDto EntityToDto(Sale sale)
        {
            var dto = new SaleDto
            {
                Id = sale.Id,
                DateSold = sale.DateSold,
                ProductId = sale.ProductId,
                CustomerId = sale.CustomerId,
                StoreId = sale.StoreId
            };

            return dto;
        }
    }
}
