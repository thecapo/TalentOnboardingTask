using Microsoft.EntityFrameworkCore;
using TalentOnboardingTask.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<OnboardingTaskDBContext>(option =>
    option.UseSqlServer(builder.Configuration.GetConnectionString("ConnectionDatabase")));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseAuthorization();

//
app.UseMiddleware<ExceptionHandlingMiddleware>();
//

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
