import { prisma } from "../lib/prisma";

export const getConfigs = () => {
  return prisma.departmentConfig.findMany();
};

export const createConfig = (data: {
  name: string;
  defaultLicenses?: string[];
  defaultRequirements?: string[];
}) => {
  return prisma.departmentConfig.create({ data });
};

export const updateConfig = (
  id: string,
  data: {
    name?: string;
    defaultLicenses?: string[];
    defaultRequirements?: string[];
  }
) => {
  return prisma.departmentConfig.update({ where: { id }, data });
};
