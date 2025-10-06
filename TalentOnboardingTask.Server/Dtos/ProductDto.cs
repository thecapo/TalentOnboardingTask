using System.ComponentModel.DataAnnotations;

namespace TalentOnboardingTask.Server.Dtos
{
    public class ProductDto
    {
        public int Id { get; set; }

        [StringLength(50, MinimumLength = 2)]
        [Required(ErrorMessage = "Name is required")]
        public string? Name { get; set; }

        [Range(1, 9999, ErrorMessage = "Price must be between 0.00 and 99999999.99")]
        [Required(ErrorMessage = "Price is required")]
        public decimal? Price { get; set; }
    }
}
