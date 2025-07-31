import puppeteer from "puppeteer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";

const templatePath = path.join(__dirname, "../../templates/procesVerbal.hbs");
const partialsDir = path.join(__dirname, "../../templates/partials");
const headerImagePath = path.join(__dirname, "../../public/assets/header.png");
const footerImagePath = path.join(__dirname, "../../public/assets/footer.png");

const registerPartials = () => {
  const partials = ["header.hbs", "footer.hbs", "equipmentTable.hbs"];
  partials.forEach((p) => {
    const name = path.basename(p, ".hbs");
    const content = fs.readFileSync(path.join(partialsDir, p), "utf-8");
    handlebars.registerPartial(name, content);
  });
};

const imgToBase64 = (imgPath: string): string => {
  const image = fs.readFileSync(imgPath);
  return `data:image/png;base64,${image.toString("base64")}`;
};

export const genereazaPDFProcesVerbal = async (data: any): Promise<Buffer> => {
  const templateHtml = fs.readFileSync(templatePath, "utf-8");
  handlebars.registerHelper("eq", (a, b) => a === b);
  registerPartials();
  const compiledTemplate = handlebars.compile(templateHtml);

  let signatureBase64: string | undefined;
  if (data.digitalSignature) {
    if (data.digitalSignature.startsWith("data:")) {
      signatureBase64 = data.digitalSignature;
    } else {
      signatureBase64 = `data:image/png;base64,${Buffer.from(data.digitalSignature).toString("base64")}`;
    }
  }

  const html = compiledTemplate({
    ...data,
    digitalSignature: signatureBase64,
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
