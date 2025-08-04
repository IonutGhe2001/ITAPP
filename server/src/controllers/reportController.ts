import { Request, Response, NextFunction } from "express";
import * as reportService from "../services/report.service";
import XLSX from "xlsx";
import puppeteer from "puppeteer";

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
      .map(
        (row) =>
          `<tr>${headers.map((h) => `<td>${(row as any)[h]}</td>`).join("")}</tr>`
      )
      .join("");
    const html = `<html><body><table><tr>${headers
      .map((h) => `<th>${h}</th>`)
      .join("")}</tr>${rows}</table></body></html>`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html);
    const buffer = await page.pdf({ format: "A4" });
    await browser.close();
    res.header("Content-Type", "application/pdf");
    res.attachment(`${filename}.pdf`);
    return res.send(buffer);
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
