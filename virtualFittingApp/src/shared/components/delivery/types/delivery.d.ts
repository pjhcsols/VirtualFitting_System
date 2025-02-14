export interface DeliveryInfo {
    defaultDeliveryAddress: string;
    firstDeliveryAddress: string;
    secondDeliveryAddress: string;
}

export interface UserData {
    deliveryInfo: DeliveryInfo;
}
