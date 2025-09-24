using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

public class TokenService(IConfiguration config) : ITokenService
{
    public string CreateToken(AppUser user)
    {
        var TokenKey = config["TokenKey"] ?? throw new Exception("Token Key Not Found");
        if (TokenKey.Length < 64) throw new Exception("Token key >= 64 characters");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TokenKey));

        var Claims = new List<Claim>
        {
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id)
        };

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(Claims),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = creds
        };

        var TokenHandler = new JwtSecurityTokenHandler();
        var token = TokenHandler.CreateToken(tokenDescriptor);
        return TokenHandler.WriteToken(token);
    }
}
