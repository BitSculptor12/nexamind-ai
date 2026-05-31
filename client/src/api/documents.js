import api from "./axios";

export const getDocumentsAPI = async () => {
  const response = await api.get("/api/documents");
  return response.data;
};

export const uploadDocumentAPI = async (formData) => {
  const response = await api.post("/api/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

export const deleteDocumentAPI = async (documentId) => {
  const response = await api.delete(`/api/documents/${documentId}`);
  return response.data;
};