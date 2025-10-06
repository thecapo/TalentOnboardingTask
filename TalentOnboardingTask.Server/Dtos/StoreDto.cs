using System.ComponentModel.DataAnnotations;

namespace TalentOnboardingTask.Server.Dtos
{
    public class StoreDto
    {
        public int Id { get; set; }

        [StringLength(50, MinimumLength = 2)]
        [Required(ErrorMessage = "Name is required")]
        public string? Name { get; set; }

        [StringLength(300, MinimumLength = 2)]
        [Required(ErrorMessage = "Address is required")]
        public string? Address { get; set; }
    }
}
