using System;
using System.Collections.Generic;
using TalentOnboardingTask.Server.Dtos;

namespace TalentOnboardingTask.Server.Models;

public partial class Sale : SaleDto
{
    public virtual Customer? Customer { get; set; }

    public virtual Product? Product { get; set; }

    public virtual Store? Store { get; set; }
}
