import React, { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  buttonStyles?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode; // Updated to accept ReactNode for the icon
  id?: string;
}

const Button: React.FC<ButtonProps> = ({ title, type = 'button', onClick, buttonStyles, icon, id }) => {
  return (
    <button 
      type={type} 
      id={id}
      className={`px-3 py-1 bg-black font-bold text-lg flex items-center justify-center gap-2 ${buttonStyles}`} 
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      {title}
    </button>
  );
};

export default Button;
