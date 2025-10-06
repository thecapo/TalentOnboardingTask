using System;
using System.Collections.Generic;
using TalentOnboardingTask.Server.Dtos;

namespace TalentOnboardingTask.Server.Models;

public partial class Product : ProductDto
{
    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
}
