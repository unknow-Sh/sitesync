import puppeteer from 'puppeteer';

export const generateReportPdf = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // In a real scenario, you'd render some HTML using a template engine like EJS
    // or run a headless browser to capture a specific client-side route.
    // For this boilerplate, we'll generate a simple placeholder PDF via puppeteer.
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Inter, sans-serif; padding: 40px; color: #fff; background: #0f172a; }
            h1 { color: #f59e0b; }
          </style>
        </head>
        <body>
          <h1>SiteSync Project Report</h1>
          <p>Project ID: ${projectId}</p>
          <p>Generated at: ${new Date().toLocaleString()}</p>
          <p>This is a pixel-perfect rendered document from Puppeteer.</p>
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=SiteSync_Report_${projectId}.pdf`);
    res.send(pdfBuffer);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
