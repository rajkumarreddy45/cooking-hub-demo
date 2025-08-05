using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Dto;

namespace dotnetapp.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly ApplicationDbContext _context;

        public FeedbackService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all feedbacks
        public async Task<IEnumerable<FeedbackDto>> GetAllFeedbacks()
{
    return await _context.Feedbacks
        .Include(f => f.User)
        .Select(f => new FeedbackDto
        {
            FeedbackId = f.FeedbackId,
            UserId = f.UserId,
            Username = f.User.Username, // Ensures safe access
            FeedbackText = f.FeedbackText,
            Date = f.Date
        })
        .ToListAsync();
}


        // Get feedbacks by User ID
        public async Task<IEnumerable<Feedback>> GetFeedbacksByUserId(int userId)
        {
            return await _context.Feedbacks.Where(f => f.UserId == userId).ToListAsync();
        }

        // Add feedback
        public async Task<bool> AddFeedback(Feedback feedback)
        {
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
            return true;
        }

        // Delete feedback
        public async Task<bool> DeleteFeedback(int feedbackId)
        {
            var feedback = await _context.Feedbacks.FindAsync(feedbackId);
            if (feedback == null)
                return false;

            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
