"use client";

import { createContext, useReducer, useContext } from "react";
import type { ReactNode } from "react";
import { reducer, setDispatchRef } from "./toastReducer";
import type { Action, State, ToasterToast } from "./toastTypes";

const initialState: State = { toasts: [] };

function genId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substr(2, 9);
}

const ToastContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  setDispatchRef(dispatch);

  return (
    <ToastContext.Provider value={{ state, dispatch }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const { dispatch, state } = context;

  const toast = (props: Omit<ToasterToast, "id">) => {
    const id = genId();
    dispatch({ type: "ADD_TOAST", toast: { ...props, id } });
    return id;
  };

  const update = (toastId: string, props: Partial<ToasterToast>) => {
    dispatch({ type: "UPDATE_TOAST", toast: { ...props, id: toastId } });
  };

  const dismiss = (toastId?: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId });
  };

  return { toast, update, dismiss, toasts: state.toasts };
};


export { ToastContext };