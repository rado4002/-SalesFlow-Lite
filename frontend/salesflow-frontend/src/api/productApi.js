import http from "./http";

export const getProducts = async () => {
  const response = await http.get("/products");
  return response.data;
};
