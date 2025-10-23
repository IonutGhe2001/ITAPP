import { Request, Response, NextFunction } from "express";
import * as reportService from "../services/report.service";
import XLSX from "xlsx";
import type { Page } from "puppeteer";
import { withPdfPage } from "@lib/pdfRenderer";
import { logger } from "@lib/logger";

const exportData = async (
  res: Response,
  data: any[],
  filename: string,
  format?: string
) => {
  if (format === "csv") {
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    res.header("Content-Type", "text/csv");
    res.attachment(`${filename}.csv`);
    return res.send(csv);
  }
  if (format === "pdf") {
    const headers = Object.keys(data[0] || {});
    const rows = data
      .map((row) => {
        const record = row as Record<string, unknown>;
        const cells = headers
          .map((h) => {
            const value = record[h];
            const text =
              value === undefined || value === null ? "" : String(value);
            return `<td>${text}</td>`;
          })
          .join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");
    const tableHeader = headers.map((h) => `<th>${h}</th>`).join("");
    const tableBody =
      rows ||
      `<tr><td colspan="${Math.max(headers.length, 1)}">No data available</td></tr>`;
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
            thead { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>${tableHeader}</tr>
            </thead>
            <tbody>${tableBody}</tbody>
          </table>
        </body>
      </html>
    `;
    try {
      const buffer = await withPdfPage(async (page: Page) => {
        await page.setContent(html, { waitUntil: "domcontentloaded" });
        return page.pdf({ format: "A4" });
      });
      res.header("Content-Type", "application/pdf");
      res.attachment(`${filename}.pdf`);
      return res.send(buffer);
    } catch (error) {
      logger.error("Failed to generate report PDF; returning JSON instead", {
        error,
      });
      res.setHeader("X-Export-Fallback", "json");
      return res.json(data);
    }
  }
  return res.json(data);
};

export const equipmentReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await reportService.getEquipmentReport({
      department: req.query.department as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      status: req.query.status as string,
    });
    await exportData(res, data, "equipment-report", req.query.format as string);
  } catch (err) {
    next(err);
  }
};

export const onboardingReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await reportService.getOnboardingReport({
      department: req.query.department as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      status: req.query.status as string,
    });
    await exportData(
      res,
      data,
      "onboarding-report",
      req.query.format as string
    );
  } catch (err) {
    next(err);
  }
};
