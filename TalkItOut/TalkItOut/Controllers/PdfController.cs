
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalkItOut.Common;
using TalkItOut.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.IO;
using Microsoft.IdentityModel.Tokens;

namespace TalkItOut.Controllers;

[ApiController]
[Route("/pdfs")]
public class PDFController : ControllerBase
{
    private readonly DataContext _dataContext;

    public PDFController(DataContext dataContext)
    {
        _dataContext = dataContext;

    }
    
    [HttpGet("{id}")]
    [Produces("application/pdf")]
    [ProducesResponseType(200, Type = typeof(FileContentResult))]
    public IActionResult GeneratePdf(int id, [FromQuery] String startDate, String endDate)
    {
        var document = CreateDocument(id, startDate, endDate);
        var pdf = document.GeneratePdf();
        Response.Headers.Add("Content-Disposition", "attachment; filename=progress-report.pdf");
        Response.ContentType = "application/octet-stream";
        return File(pdf, "application/pdf", "progress-report.pdf");
    }

    QuestPDF.Infrastructure.IDocument CreateDocument(int id, [FromQuery] String startDate, String endDate)
    {
        DateTime parsedStartDate = DateTime.Parse(startDate);
        DateTime parsedEndDate = DateTime.Parse(endDate);
        var client = _dataContext.Set<Client>().Include(x=>x.Sessions).FirstOrDefault(x => x.Id == id);
        var sessions = _dataContext.Set<Session>()
            .Where(x => x.StartTime > parsedStartDate && x.EndTime < parsedEndDate && (x.ClientId == id || x.GroupId == client.GroupId)).ToList();
        var totalTime = sessions.Sum(x => x.EndTime.Subtract(x.StartTime).TotalMinutes);
        var length = sessions.Count();
        var goal = _dataContext.Set<Goal>().Where(x=>x.ClientId == id).ToList();
        var count = 0;
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(18));

                page.Header()
                    .Text("Client Progress Report")
                    .SemiBold().FontSize(36).FontColor(Colors.Indigo.Darken2);

                page.Content()
                    .PaddingVertical(1, Unit.Centimetre)
                    .Column(x =>
                    {
                        x.Spacing(20);

                        x.Item().Text("Client Name: " + client.FirstName + " " + client.LastName);
                        x.Spacing(10);
                        x.Item().Text(parsedStartDate.Date.ToString("MM/dd/yyyy") + " - " + parsedEndDate.Date.ToString("MM/dd/yyyy"));
                        x.Spacing(10);
                        x.Item().Text("Total Minutes: " + totalTime.ToString() + " minutes");
                        x.Spacing(10);
                        x.Item().Text("Total Sessions: " + length.ToString());
                        foreach(var info in goal){
                            count = count + 1; 
                            x.Spacing(10);
                            x.Item().Text("Goal " + count + " : " + info.Information);
                        }
                        foreach(var session in sessions){
                            if (!session.Notes.IsNullOrEmpty())
                            {
                                count = count + 1;
                                x.Spacing(10);
                                x.Item().Text("Note (" +session.StartTime.Date.ToString("MM/dd/yyyy") + ") : " + session.Notes);
                            }
                        }
                    });

                page.Footer()
                    .AlignCenter()
                    .Text(x =>
                    {
                        x.Span("Page ");
                        x.CurrentPageNumber();
                    });
            });
        });
    }
}