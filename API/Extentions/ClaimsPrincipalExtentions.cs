using System;
using System.Security.Claims;

namespace API.Extentions;

public static class ClaimsPrincipalExtentions
{
    public static string GetMemberId(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new Exception("Can't get member id from token");
    }
}
