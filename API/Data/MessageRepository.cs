using System;
using API.DTOs;
using API.Entities;
using API.Extentions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MessageRepository(AppDbContext context) : IMessageRepository
{
    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessage(string messageId)
    {
        return await context.Messages.FindAsync(messageId);
    }

    public async Task<PaginatedResult<MessageDTO>> GetMessagesForMember(MessagePrams messagePrams)
    {
        var query = context.Messages
        .OrderByDescending(x => x.MessageSent)
        .AsQueryable();

        query = messagePrams.Container switch

        {
            "Outbox" => query.Where(x => x.Sender.Id == messagePrams.MemerbId
            && x.SenderDeleted == false),
            _ => query.Where(x => x.Recipient.Id == messagePrams.MemerbId && x.RecipientDelete == false)
        };

        var messageQuery = query.Select(MessageExtentions.ToDtoProjection());

        return await
        PaginaitonHelper.CreateAsync(messageQuery, messagePrams.PageNumber, messagePrams.PageSize);
    }

    public async Task<IReadOnlyList<MessageDTO>> GetMessageThread(string currentMemberId, string recipientId)
    {
        await context.Messages
        .Where(x => x.RecipientId == currentMemberId && x.SenderId == recipientId && x.DateRead == null)
        .ExecuteUpdateAsync(setters => setters
        .SetProperty(x => x.DateRead, DateTime.UtcNow));

        return await context.Messages
        .Where(x => (x.RecipientId == currentMemberId && x.RecipientDelete == false
         && x.SenderId == recipientId) ||
        (x.SenderId == currentMemberId && x.SenderDeleted == false
        && x.RecipientId == recipientId))
        .OrderBy(x => x.MessageSent)
        .Select(MessageExtentions.ToDtoProjection())
        .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
