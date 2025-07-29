import { useContext } from "react"
import { ToastContext, genId } from "./context"
import type { ToasterToast } from "./toastTypes"

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  const { dispatch, state } = context

  const toast = (props: Omit<ToasterToast, "id">) => {
    const id = genId()
    dispatch({ type: "ADD_TOAST", toast: { ...props, id } })
    return id
  }

  const update = (toastId: string, props: Partial<ToasterToast>) => {
    dispatch({ type: "UPDATE_TOAST", toast: { ...props, id: toastId } })
  }

  const dismiss = (toastId?: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId })
  }

  return { toast, update, dismiss, toasts: state.toasts }
}