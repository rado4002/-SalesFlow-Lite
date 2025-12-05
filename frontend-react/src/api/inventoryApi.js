// src/api/inventoryApi.js
import api from "./http";

// GET all inventory items
export const fetchInventory = () => api.get("/inventory");

// GET single item by ID
export const fetchInventoryById = (id) => api.get(`/inventory/${id}`);

// CREATE new item
export const createInventory = (data) => api.post("/inventory", data);

// UPDATE item
export const updateInventory = (id, data) => api.put(`/inventory/${id}`, data);

// DELETE item
export const deleteInventory = (id) => api.delete(`/inventory/${id}`);