"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
}

interface ToastContextType {
	showToast: (message: string, type: ToastType, duration?: number) => void;
	hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback((message: string, type: ToastType, duration = 5000) => {
		const id = Date.now().toString();
		const toast: Toast = { id, message, type, duration };

		setToasts(prev => [...prev, toast]);

		if (duration > 0) {
			setTimeout(() => {
				hideToast(id);
			}, duration);
		}
	}, []);

	const hideToast = useCallback((id: string) => {
		setToasts(prev => prev.filter(toast => toast.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ showToast, hideToast }}>
			{children}
			<ToastContainer toasts={toasts} onHide={hideToast} />
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
}

interface ToastContainerProps {
	toasts: Toast[];
	onHide: (id: string) => void;
}

function ToastContainer({ toasts, onHide }: ToastContainerProps) {
	if (toasts.length === 0) return null;

	return (
		<div className="fixed top-4 right-4 z-50 space-y-2">
			{toasts.map((toast) => (
				<ToastItem key={toast.id} toast={toast} onHide={onHide} />
			))}
		</div>
	);
}

interface ToastItemProps {
	toast: Toast;
	onHide: (id: string) => void;
}

function ToastItem({ toast, onHide }: ToastItemProps) {
	const getIcon = () => {
		switch (toast.type) {
			case 'success':
				return <CheckCircle className="h-5 w-5 text-green-600" />;
			case 'error':
				return <AlertCircle className="h-5 w-5 text-red-600" />;
			case 'warning':
				return <AlertCircle className="h-5 w-5 text-yellow-600" />;
			default:
				return <AlertCircle className="h-5 w-5 text-blue-600" />;
		}
	};

	const getStyles = () => {
		const baseStyles = "flex items-start gap-3 p-4 rounded-lg shadow-lg border max-w-md";

		switch (toast.type) {
			case 'success':
				return cn(baseStyles, "bg-green-50 border-green-200 text-green-800");
			case 'error':
				return cn(baseStyles, "bg-red-50 border-red-200 text-red-800");
			case 'warning':
				return cn(baseStyles, "bg-yellow-50 border-yellow-200 text-yellow-800");
			default:
				return cn(baseStyles, "bg-blue-50 border-blue-200 text-blue-800");
		}
	};

	return (
		<div className={getStyles()}>
			{getIcon()}
			<div className="flex-1">
				<p className="text-sm font-medium">{toast.message}</p>
			</div>
			<button
				onClick={() => onHide(toast.id)}
				className="flex-shrink-0 hover:opacity-70"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
}
