export enum ButtonActionType {
    ValidateAndShowMessage = 1,
    ValidateAndRedirectToHomePage
}

export interface ComponentStateModel {
    connectionName: string;
    connectionUrl: string;
    testButtonLoading: boolean;
    connectButtonLoading: boolean;
}