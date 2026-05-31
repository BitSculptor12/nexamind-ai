import api from "./axios";

export const getDocumentsAPI =
  async () => {
    const response =
      await api.get(
        "/api/documents"
      );

    return response.data;
  };

export const uploadDocumentAPI =
  async (formData) => {
    const response =
      await api.post(
        "/api/documents/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

    return response.data;
  };

export const uploadTextAPI =
  async (title, text) => {
    const response =
      await api.post(
        "/api/documents/upload-text",
        {
          title,
          text
        }
      );

    return response.data;
  };

export const uploadURLAPI =
  async (url) => {
    const response =
      await api.post(
        "/api/documents/upload-url",
        {
          url
        }
      );

    return response.data;
  };

export const uploadYoutubeAPI =
  async (url) => {
    const response =
      await api.post(
        "/api/documents/upload-youtube",
        {
          url
        }
      );

    return response.data;
  };

export const deleteDocumentAPI =
  async (documentId) => {
    const response =
      await api.delete(
        `/api/documents/${documentId}`
      );

    return response.data;
  };