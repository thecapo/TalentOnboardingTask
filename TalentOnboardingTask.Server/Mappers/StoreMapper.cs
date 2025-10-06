using TalentOnboardingTask.Server.Dtos;
using TalentOnboardingTask.Server.Models;

namespace TalentOnboardingTask.Server.Mappers
{
    public static class StoreMapper
    {
        public static Store DtoToEntity(StoreDto storeDto)
        {
            var entity = new Store
            {
                Id = storeDto.Id,
                Name = storeDto.Name,
                Address = storeDto.Address
            };

            return entity;
        }

        public static StoreDto EntityToDto(Store store)
        {
            var dto = new Store
            {
                Id = store.Id,
                Name = store.Name,
                Address = store.Address
            };

            return dto;
        }
    }
}
