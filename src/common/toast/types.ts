import { Bounce, ToastOptions } from "react-toastify";

export const toastConfig: ToastOptions = {
    position: "top-right",
    autoClose: 6500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
}