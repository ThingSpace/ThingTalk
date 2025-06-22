import React from 'react';

export interface LabelProps {
	children: React.ReactNode;
	htmlFor?: string;
	className?: string;
}

export const Label = ({ children, htmlFor, className = '' }: LabelProps) => {
	return (
		<label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>
			{children}
		</label>
	);
}; 