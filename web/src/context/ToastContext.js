import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { playFeedbackSound } from "../services/interactionFeedback";

const ToastContext = createContext(null);

const TOAST_VARIANTS = {
  success: {
    background: "#ecfdf3",
    color: "#14532d",
    border: "#22c55e",
  },
  error: {
    background: "#fef2f2",
    color: "#991b1b",
    border: "#ef4444",
  },
  info: {
    background: "#eff6ff",
    color: "#1e3a8a",
    border: "#3b82f6",
  },
};

const DEFAULT_SOUND_VARIANTS = new Set(["success", "error"]);

const resolveToastSound = (variant = "info", options = {}) => {
  if (options?.playSound === false || options?.sound === false) return "";
  if (typeof options?.playSound === "string") return options.playSound;
  if (typeof options?.sound === "string") return options.sound;
  if (options?.playSound === true || options?.sound === true) return variant;
  return DEFAULT_SOUND_VARIANTS.has(variant) ? variant : "";
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, variant = "info", options = {}) => {
    if (!message) return;
    const id = `${Date.now()}-${counterRef.current++}`;
    setToasts((current) => [...current, { id, message, variant }]);
    setTimeout(() => dismissToast(id), 5200);

    const sound = resolveToastSound(variant, options);
    if (sound) {
      playFeedbackSound(sound).catch(() => {});
    }
  }, [dismissToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="toast-container" role="status" aria-live="polite">
          {toasts.map((toast) => {
            const variantStyles = TOAST_VARIANTS[toast.variant] || TOAST_VARIANTS.info;
            return (
              <div
                key={toast.id}
                className="toast"
                style={{
                  background: variantStyles.background,
                  color: variantStyles.color,
                  borderColor: variantStyles.border,
                }}
              >
                <div className="toast-message">{toast.message}</div>
                <button
                  className="toast-close"
                  aria-label="Dismiss notification"
                  onClick={() => dismissToast(toast.id)}
                  type="button"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};