import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import {
  addAngajatDocument,
  getAngajatDocuments,
  getAngajatDocument,
  deleteAngajatDocument,
  logDocumentAccess,
  searchDocuments,
  getDocumentAccessLogs,
} from "../services/angajatDocument.service";
import type { DocumentType } from "@prisma/client";

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
    
    const documentType = (req.body.documentType as DocumentType) || "OTHER";
    const uploadYear = req.body.uploadYear 
      ? parseInt(req.body.uploadYear, 10) 
      : new Date().getFullYear();

    const doc = await addAngajatDocument(
      id,
      file.originalname,
      `/angajat-documents/${file.filename}`,
      file.mimetype,
      file.size,
      uploadedBy,
      documentType,
      uploadYear
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
    
    // Log document access
    const user = (req as any).user;
    if (user) {
      await logDocumentAccess(
        docId,
        user.id,
        user.email,
        `${user.nume} ${user.prenume}`,
        "DOWNLOAD",
        req.ip
      );
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

export const searchArchiveDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      employeeName,
      documentType,
      uploadYear,
      includeInactive,
      page,
      pageSize,
    } = req.query;

    const result = await searchDocuments({
      employeeName: employeeName as string | undefined,
      documentType: documentType as DocumentType | undefined,
      uploadYear: uploadYear ? parseInt(uploadYear as string, 10) : undefined,
      includeInactive: includeInactive === "true",
      page: page ? parseInt(page as string, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string, 10) : undefined,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getAccessLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { docId } = req.params;
    const logs = await getDocumentAccessLogs(docId);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};
