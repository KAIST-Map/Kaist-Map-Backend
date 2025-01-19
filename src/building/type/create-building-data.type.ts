export type CreateBuildingData = {
  name: string;
  latitude: number;
  longitude: number;
  imageUrls: string[];
  importance: number;
  alias: string[];
  categoryIds: number[];
};
