
import React from 'react';
// Footer component with dark background and centered text
export const Footer: React.FC = () => {
    return (
        <footer className="relative bg-dark p-8">
            <div>
                <span className="text-primary text-lg font-bold">
                    LIZA ia
                </span>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="text-orange-500 font-semibold">
                    Teste iagiliza - fullstack
                </span>
            </div>
        </footer>
    );
};