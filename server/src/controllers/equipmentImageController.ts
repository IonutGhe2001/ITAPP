import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import {
  addEquipmentImage,
  getEquipmentImages,
  getEquipmentImage,
  deleteEquipmentImage,
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

export const deleteImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, imageId } = req.params as { id: string; imageId: string };
    const image = await getEquipmentImage(imageId);
    if (!image || image.echipamentId !== id) {
      res.status(404).json({ message: "Imagine negăsită" });
      return;
    }
    const filePath = path.join(__dirname, "../../public", image.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await deleteEquipmentImage(imageId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};