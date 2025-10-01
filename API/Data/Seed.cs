using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedData(AppDbContext context)
    {
        if (await context.Users.AnyAsync()) return;

        var data = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var members = JsonSerializer.Deserialize<List<SeedDto>>(data);

        if (members == null)
        {
            Console.WriteLine("No data found in SeedData.json");
            return;
        }

        foreach (var member in members)
        {
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                DisplayName = member.DisplayName,
                Email = member.Email,
                ImageUrl = member.ImageUrl,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("P@ssw0rd")),
                PasswordSalt = hmac.Key,
                Member = new Member
                {
                    Id = member.Id,
                    DateOfBirth = member.DateOfBirth,
                    ImageUrl = member.ImageUrl,
                    DisplayName = member.DisplayName,
                    Created = member.Created,
                    LastActive = member.LastActive,
                    Gender = member.Gender,
                    Description = member.Description,
                    City = member.City,
                    Country = member.Country,
                }
            };

            user.Member.Photos.Add(new Photo
            {
                Url = member.ImageUrl!,
                MemberId = user.Member.Id
            });

            context.Users.Add(user);
        }
        await context.SaveChangesAsync();
    }
}
