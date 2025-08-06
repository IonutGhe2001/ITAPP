import { Request, Response, NextFunction } from "express";
import {
  addEquipmentImage,
  getEquipmentImages,
} from "../services/equipmentImage.service";

export const listImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const images = await getEquipmentImages(id);
    res.json(images);
  } catch (err) {
    next(err);
  }
};

export const uploadImage = async (
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
    const image = await addEquipmentImage(
      id,
      `/equipment-images/${file.filename}`
    );
    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
};