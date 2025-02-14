interface IMPRequestPayParams {
    pg: string;
    pay_method: string;
    merchant_uid: string;
    name: string;
    amount: number;
    buyer_email: string;
    buyer_name: string;
    buyer_tel: string;
    buyer_addr: string;
    buyer_postcode: string;
    escrow: boolean;
    vbank_due: string;
    bypass: {
      acceptmethod: string;
      P_RESERVED: string;
    };
    period: {
      from: string;
      to: string;
    };
  }
  
  interface IMPResponse {
    success: boolean;
    imp_uid: string;
    error_msg?: string;
    paid_amount?: number;
    [key: string]: string | number | boolean | undefined;
  }
  
  interface IMP {
    init: (impKey: string) => void;
    request_pay: (params: IMPRequestPayParams, callback: (response: IMPResponse) => void) => void;
  }
  
  interface Window {
    IMP: IMP;
  }