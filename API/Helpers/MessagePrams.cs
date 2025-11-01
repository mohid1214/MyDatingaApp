using System;

namespace API.Helpers;

public class MessagePrams : PagingParams
{
    public string? MemerbId { get; set; }
    public string Container { get; set; } = "Inbox";
}
