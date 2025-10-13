import React from 'react';

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void; 
};

export const Button = ({ children, onClick }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="bg-primary hover:bg-blue-600 text-light font-bold py-2 px-6 rounded"
        >
            {children}
        </button>
    );
};