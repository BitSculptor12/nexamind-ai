import api from "./axios";

export const sendMessageAPI =
  async (
    message,
    history = []
  ) => {
    const response =
      await api.post(
        "/api/chat",
        {
          question: message,
          history
        }
      );

    return response.data;
  };

export const getChatHistoryAPI =
  async () => {
    const response =
      await api.get(
        "/api/chat/history"
      );

    return response.data;
  };