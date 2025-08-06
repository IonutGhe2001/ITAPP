import { Request, Response, NextFunction } from "express";
import { addEquipmentImage, getEquipmentImages } from "../services/equipmentImage.service";

export const listImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "Fișier lipsă" });
      return;
    }
    const image = await addEquipmentImage(
      id,
      `/equipment-images/${file.filename}`,
    );
    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
};