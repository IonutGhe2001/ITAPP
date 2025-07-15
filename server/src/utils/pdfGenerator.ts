import puppeteer from "puppeteer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";

const templatePath = path.join(__dirname, "../../templates/procesVerbal.hbs");
const headerImagePath = path.join(__dirname, "../../public/assets/header.png");
const footerImagePath = path.join(__dirname, "../../public/assets/footer.png");

const imgToBase64 = (imgPath: string): string => {
  const image = fs.readFileSync(imgPath);
  return `data:image/png;base64,${image.toString("base64")}`;
};

export const genereazaPDFProcesVerbal = async (data: any): Promise<Buffer> => {
  const templateHtml = fs.readFileSync(templatePath, "utf-8");
  const compiledTemplate = handlebars.compile(templateHtml);

  const html = compiledTemplate({
    ...data,
    headerImg: imgToBase64(headerImagePath),
    footerImg: imgToBase64(footerImagePath)
  });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true
  });

  await browser.close();

  return Buffer.from(pdfBuffer);
};
