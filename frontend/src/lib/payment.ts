const API_BASE_URL = import.meta.env.VITE_API_URL;

interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  userId: string;
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

interface CreateOrderResponse {
  paymentSessionId: string;
  orderId: string;
}

declare global {
  interface Window {
    Cashfree: {
      (config: {
        paymentSessionId: string;
        returnUrl?: string;
        notifyUrl?: string;
        onSuccess: (orderId: string) => void;
        onFailure: (error: any) => void;
      }): void;
      checkout: (options: any) => void;
    };
  }
}

export const createPaymentOrder = async (
  data: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/payment/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Failed to create payment order',
    }));
    throw new Error(errorData.message || 'Failed to create payment order');
  }

  const result = await response.json();

  return {
    paymentSessionId: result.paymentSessionId,
    orderId: result.orderId,
  };
};

export const getPaymentStatus = async (orderId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/payment/status/${orderId}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch payment status');
  }

  return response.json();
};

export const loadCashfreeSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error('Failed to load Cashfree SDK'));
    };
    document.head.appendChild(script);
  });
};

export const initiateCashfreeCheckout = async ({
  paymentSessionId,
  onSuccess,
  onFailure,
}: {
  paymentSessionId: string;
  onSuccess: (orderId: string) => void;
  onFailure: (error: any) => void;
}) => {
  try {
    await loadCashfreeSDK();

    const checkoutOptions = {
      paymentSessionId,
      returnUrl: `${window.location.origin}/payment-success?order_id={order_id}`,
      onSuccess,
      onFailure,
    };

    window.Cashfree(checkoutOptions);
  } catch (error) {
    onFailure(error);
  }
};
