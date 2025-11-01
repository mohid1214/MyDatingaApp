using System;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMessageRepository
{
    void AddMessage(Message message);
    void DeleteMessage(Message message);
    Task<Message?> GetMessage(string messageId);
    Task<PaginatedResult<MessageDTO>> GetMessagesForMember(MessagePrams messagePrams);
    Task<IReadOnlyList<MessageDTO>> GetMessageThread(string currentMemberId, string recipientId);
    Task<bool> SaveAllAsync();
}
