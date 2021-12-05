import { UpdateOptions } from "react-toastify";

export interface ToastPromiseParams {
    pending: string | UpdateOptions;
    success: string | UpdateOptions;
    error: string | UpdateOptions;
}
