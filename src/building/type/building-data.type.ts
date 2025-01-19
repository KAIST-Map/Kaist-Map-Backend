import { CategoryData } from "src/category/type/category-data.type";

export type BuildingData = {
  id: number;
  name: string;
  imageUrls: string[];
  importance: number;
  latitude: number;
  longitude: number;
  buildingCategories: {
    buildingId: number;
    categoryId: number;
  }[];
  alias: string[];
};
