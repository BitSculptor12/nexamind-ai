
import axiosInstance
from "./axios";


// =========================
// PAYMENT API
// =========================

const paymentAPI = {

  // =====================
  // CREATE ORDER
  // =====================

  createOrder:
  async () => {

    const response =
    await axiosInstance.post(

      "/payment/create-order"
    );

    return response.data;
  },


  // =====================
  // VERIFY PAYMENT
  // =====================

  verifyPayment:
  async (paymentData) => {

    const response =
    await axiosInstance.post(

      "/payment/verify",

      paymentData
    );

    return response.data;
  },


  // =====================
  // GET PLAN
  // =====================

  getCurrentPlan:
  async () => {

    const response =
    await axiosInstance.get(

      "/payment/plan"
    );

    return response.data;
  }
};

export default paymentAPI;

