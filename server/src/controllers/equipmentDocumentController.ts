import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import {
  addEquipmentDocument,
  getEquipmentDocuments,
  getEquipmentDocument,
  deleteEquipmentDocument,
} from "../services/equipmentDocument.service";

export const listDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const docs = await getEquipmentDocuments(id);
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
    const doc = await addEquipmentDocument(
      id,
      file.originalname,
      `/equipment-documents/${file.filename}`
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
    const doc = await getEquipmentDocument(docId);
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
    const doc = await getEquipmentDocument(docId);
    if (!doc || doc.echipamentId !== id) {
      res.status(404).json({ message: "Document negăsit" });
      return;
    }
    const filePath = path.join(__dirname, "../../public", doc.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await deleteEquipmentDocument(docId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
