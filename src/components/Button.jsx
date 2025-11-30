import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const baseStyles = 'relative font-semibold rounded-lg transition-all overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-400',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white',
    ghost: 'bg-transparent hover:bg-cyan-500/10 border border-cyan-500/30 text-cyan-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Glow effect on hover */}
      {variant === 'primary' && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-400 to-purple-500 blur-xl transition-all" />
      )}
      
      <span className="relative flex items-center justify-center space-x-2">
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : Icon ? (
          <Icon className="w-5 h-5" />
        ) : null}
        <span>{children}</span>
      </span>
    </motion.button>
  );
};

export const IconButton = ({ 
  icon: Icon, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'relative rounded-lg transition-all overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';
  
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-400',
    danger: 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400',
    ghost: 'bg-transparent hover:bg-cyan-500/10 text-cyan-400',
  };

  const sizes = {
    sm: 'p-1.5',
    md: 'p-2.5',
    lg: 'p-3.5',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <Icon className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
    </motion.button>
  );
};

export default Button;
