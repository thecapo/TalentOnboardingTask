using System.ComponentModel.DataAnnotations;

namespace TalentOnboardingTask.Server.Dtos
{
    public class SaleDto
    {
        public int Id { get; set; }

        public int? ProductId { get; set; }

        public int? CustomerId { get; set; }

        public int? StoreId { get; set; }

        [DataType(DataType.Date)]
        public DateOnly DateSold { get; set; }
    }
}
