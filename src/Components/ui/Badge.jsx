// src/Components/ui/Badge.jsx
// COMPONENTE NUEVO - No afecta nada existente
import React from 'react';

const badgeVariants = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  new: 'bg-purple-100 text-purple-800 border-purple-200',
  offer: 'bg-orange-100 text-orange-800 border-orange-200',
};

export const Badge = ({ children, variant = 'info', className = '' }) => {
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      border ${badgeVariants[variant]} ${className}
    `}>
      {children}
    </span>
  );
};