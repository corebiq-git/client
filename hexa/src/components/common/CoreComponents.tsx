import React, { useState } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpDown,
  Filter,
  Download,
  AlertCircle
} from 'lucide-react';

// --- BUTTONS ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const CoreButton: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/30 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 h-8',
    md: 'text-sm px-3.5 py-2 h-9',
    lg: 'text-base px-5 py-2.5 h-11'
  }[size];

  const variantClasses = {
    primary: 'bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-sm active:bg-[#174ea6]',
    secondary: 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124] active:bg-[#dadce0]',
    outline: 'border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-[#3c4043] shadow-xs active:bg-[#f1f3f4]',
    danger: 'bg-[#d93025] hover:bg-[#b31412] text-white shadow-sm active:bg-[#a50e0e]',
    ghost: 'hover:bg-[#f1f3f4] text-[#3c4043] active:bg-[#e8eaed]',
    success: 'bg-[#1e8e3e] hover:bg-[#137333] text-white shadow-sm active:bg-[#0d652d]'
  }[variant];

  return (
    <button
      className={`${base} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};

export const CoreIconButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    title?: string;
    variant?: 'ghost' | 'outline' | 'primary';
    size?: 'sm' | 'md';
  }
> = ({ title, variant = 'ghost', size = 'md', children, className = '', ...props }) => {
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-sm';
  const variantClass = {
    ghost: 'hover:bg-[#f1f3f4] text-[#5f6368] hover:text-[#202124]',
    outline: 'border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-[#5f6368]',
    primary: 'bg-[#1a73e8] text-white hover:bg-[#1557b0]'
  }[variant];

  return (
    <button
      title={title}
      className={`inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none cursor-pointer ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- CARDS ---
export const CoreCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#e0e2e6] shadow-[0_1px_2px_rgba(60,64,67,0.06)] overflow-hidden ${
        onClick ? 'cursor-pointer hover:border-[#bdc1c6] transition-all' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

// --- STAT CARD ---
export const CoreStatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
  badgeColor?: string;
  onClick?: () => void;
}> = ({ title, value, subtitle, icon, trend, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#e0e2e6] p-4.5 shadow-[0_1px_2px_rgba(60,64,67,0.05)] transition-all ${
        onClick ? 'hover:border-[#bdc1c6] hover:shadow-sm cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-[#5f6368] tracking-wider uppercase">{title}</span>
          <div className="text-2xl font-semibold text-[#202124] mt-1 tracking-tight">{value}</div>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-[#f1f3f4] text-[#1a73e8] flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-2 text-xs text-[#5f6368]">
          {trend && (
            <span
              className={`font-semibold flex items-center gap-0.5 ${
                trend.positive ? 'text-[#1e8e3e]' : 'text-[#d93025]'
              }`}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

// --- INPUTS & FORMS ---
export const CoreInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    hint?: string;
  }
> = ({ label, error, hint, className = '', id, ...props }) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '_') : undefined);
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-[#3c4043] mb-1.5">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full h-9.5 px-3 py-1.5 text-sm bg-white border rounded-lg text-[#202124] placeholder-[#80868b] transition-colors focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 ${
          error ? 'border-[#d93025]' : 'border-[#dadce0]'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#d93025] mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-[#5f6368] mt-1">{hint}</p>}
    </div>
  );
};

export const CoreSelect: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
  }
> = ({ label, error, options, className = '', id, ...props }) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '_') : undefined);
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-[#3c4043] mb-1.5">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full h-9.5 px-3 py-1.5 text-sm bg-white border rounded-lg text-[#202124] transition-colors focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 ${
          error ? 'border-[#d93025]' : 'border-[#dadce0]'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-[#d93025] mt-1">{error}</p>}
    </div>
  );
};

// --- DIALOG / MODAL ---
export const CoreDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}> = ({ open, onClose, title, subtitle, children, footer, maxWidth = 'lg' }) => {
  if (!open) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl'
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full ${widthClasses} bg-white rounded-xl border border-[#dadce0] shadow-xl overflow-hidden transform transition-all z-10`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#e0e2e6] flex items-center justify-between bg-white">
            <div>
              <h3 className="text-base font-semibold text-[#202124]">{title}</h3>
              {subtitle && <p className="text-xs text-[#5f6368] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 max-h-[75vh] overflow-y-auto">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-5 py-3 border-t border-[#e0e2e6] bg-[#f8f9fa] flex items-center justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- TABS ---
export const CoreTabs: React.FC<{
  tabs: { id: string; label: string; count?: number; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
}> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex items-center gap-1 border-b border-[#e0e2e6] overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all shrink-0 cursor-pointer ${
              isActive
                ? 'border-[#1a73e8] text-[#1a73e8] font-semibold'
                : 'border-transparent text-[#5f6368] hover:text-[#202124] hover:border-[#dadce0]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-[#e8f0fe] text-[#1a73e8]' : 'bg-[#f1f3f4] text-[#5f6368]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// --- EMPTY STATE ---
export const CoreEmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({ title, description, actionText, onAction, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-dashed border-[#dadce0]">
      <div className="w-12 h-12 rounded-xl bg-[#f1f3f4] text-[#5f6368] flex items-center justify-center mb-3">
        {icon || <AlertCircle className="w-6 h-6" />}
      </div>
      <h4 className="text-sm font-semibold text-[#202124]">{title}</h4>
      <p className="text-xs text-[#5f6368] max-w-sm mt-1 mb-4">{description}</p>
      {actionText && onAction && (
        <CoreButton variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </CoreButton>
      )}
    </div>
  );
};

// --- PAGINATION ---
export const CorePagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, totalItems, pageSize, onPageChange }) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-[#e0e2e6] text-xs text-[#5f6368]">
      <div>
        Showing <span className="font-medium text-[#202124]">{startItem}</span> to{' '}
        <span className="font-medium text-[#202124]">{endItem}</span> of{' '}
        <span className="font-medium text-[#202124]">{totalItems}</span> records
      </div>
      <div className="flex items-center gap-1">
        <CoreIconButton
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </CoreIconButton>
        <span className="px-2 text-xs font-medium text-[#202124]">
          {currentPage} / {totalPages}
        </span>
        <CoreIconButton
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </CoreIconButton>
      </div>
    </div>
  );
};
