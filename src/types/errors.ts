export interface ErrorType{
    status: number | null,
    message: string | null,
}

export interface ErrorInterface extends ErrorType{
    visible: boolean,
    sendDataToParent: () => void,
}