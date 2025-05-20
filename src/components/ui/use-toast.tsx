'use client'

import { createContext, useContext, useState } from 'react'

type ToastVariant = 'default' | 'destructive';
type ToastType = {
  id?: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

interface ToastContextType {
  toasts: ToastType[];
  toast: (toast: ToastType) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const toast = (toast: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { ...toast, id }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismiss(id);
    }, 5000);

    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 flex flex-col items-end space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg shadow-lg p-4 max-w-md transform transition-all duration-300 ease-in-out animate-slide-in
              ${toast.variant === 'destructive' 
                ? 'bg-red-600 text-white'
                : 'bg-white dark:bg-gray-800 hotdog:bg-hotdog-yellow text-gray-700 dark:text-gray-100 hotdog:text-black'
              }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{toast.title}</h3>
                {toast.description && (
                  <p className="text-sm mt-1 opacity-90">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id!)}
                className="ml-4 text-gray-500 dark:text-gray-400 hotdog:text-black hover:text-gray-900 dark:hover:text-gray-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
