import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import {
  addAngajatDocument,
  getAngajatDocuments,
  getAngajatDocument,
  deleteAngajatDocument,
} from "../services/angajatDocument.service";

export const listDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const docs = await getAngajatDocuments(id);
    res.json(docs);
  } catch (err) {
    next(err);
  }
};

export const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const uploadErr = (req as any).multerError as Error | undefined;
    if (uploadErr) {
      res.status(400).json({ message: uploadErr.message });
      return;
    }
    const validationErr = (req as any).fileValidationError as
      | string
      | undefined;
    const file = req.file;
    if (!file || validationErr) {
      res.status(400).json({ message: validationErr || "Fișier lipsă" });
      return;
    }

    const user = (req as any).user;
    const uploadedBy = user ? `${user.nume} ${user.prenume}` : undefined;

    const doc = await addAngajatDocument(
      id,
      file.originalname,
      `/angajat-documents/${file.filename}`,
      file.mimetype,
      file.size,
      uploadedBy
    );
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

export const downloadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { docId } = req.params as { docId: string };
    const doc = await getAngajatDocument(docId);
    if (!doc) {
      res.status(404).json({ message: "Document negăsit" });
      return;
    }
    const filePath = path.join(__dirname, "../../public", doc.path);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: "Fișier negăsit" });
      return;
    }
    res.download(filePath, doc.name);
  } catch (err) {
    next(err);
  }
};

export const deleteDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, docId } = req.params as { id: string; docId: string };
    const doc = await getAngajatDocument(docId);
    if (!doc || doc.angajatId !== id) {
      res.status(404).json({ message: "Document negăsit" });
      return;
    }
    const filePath = path.join(__dirname, "../../public", doc.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await deleteAngajatDocument(docId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
