import React from 'react';
import { cn } from './Button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "flex h-11 w-full rounded-xl border bg-white/[0.04] px-3.5 py-2 text-sm text-gray-100 placeholder:text-gray-600 transition-all duration-200 input-glow",
                            "border-white/[0.10] focus:border-violet-500/60 focus:bg-white/[0.06]",
                            "disabled:cursor-not-allowed disabled:opacity-40",
                            error && "border-red-500/70 focus:border-red-500 focus:ring-red-500/25",
                            icon && "pl-10",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';
