
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
    
    [HttpGet(Name = "GeneratePdf")]
    [Produces("application/pdf")]
    [ProducesResponseType(200, Type = typeof(FileContentResult))]
    public IActionResult GeneratePdf()
    {
        // use any method to create a document, e.g.: injected service
        var document = CreateDocument();
        
        // generate PDF file and return it as a response
        var pdf = document.GeneratePdf();
        Response.Headers.Add("Content-Disposition", "attachment; filename=hello-world.pdf");
        Response.ContentType = "application/octet-stream";
        return File(pdf, "application/pdf", "hello-world.pdf");
    }

    QuestPDF.Infrastructure.IDocument CreateDocument()
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(20));

                page.Header()
                    .Text("Hello PDF!")
                    .SemiBold().FontSize(36).FontColor(Colors.Blue.Medium);

                page.Content()
                    .PaddingVertical(1, Unit.Centimetre)
                    .Column(x =>
                    {
                        x.Spacing(20);

                        x.Item().Text(Placeholders.LoremIpsum());
                        x.Item().Image(Placeholders.Image(200, 100));
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