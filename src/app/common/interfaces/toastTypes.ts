export interface ToastState {
   open: boolean,
   toastType: ToastTypes
   message: string
}

export enum ToastTypes {
Success = 'success',
Info = 'info',
Warning = 'warning',
Error = 'error'
}