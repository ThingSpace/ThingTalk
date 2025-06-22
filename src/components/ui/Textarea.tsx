import { cva, type VariantProps } from 'class-variance-authority';
import React, { forwardRef } from 'react';

const TextareaStyles = cva('mt-1 block w-full border-gray-300 shadow-sm outline-none duration-200 resize-none', {
	variants: {
		intent: {
			default: 'border-gray-300 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50',
			error: 'border-red-300 focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50',
			warning: 'border-yellow-300 focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50',
			success: 'border-green-300 focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50',
		},
		fullWidth: {
			default: 'w-full',
			true: 'w-full',
			false: 'w-auto',
		},
	},
	defaultVariants: {
		intent: 'default',
	},
});

export interface TextareaProps extends VariantProps<typeof TextareaStyles> {
	id?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
	placeholder?: string;
	rows?: number;
	className?: string;
	disabled?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ id, value, onChange, onKeyDown, placeholder, rows = 3, className, disabled, ...props }, ref) => {
		return (
			<textarea
				ref={ref}
				id={id}
				value={value}
				onChange={onChange}
				onKeyDown={onKeyDown}
				placeholder={placeholder}
				rows={rows}
				disabled={disabled}
				className={`${TextareaStyles(props)} ${className || ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
			/>
		);
	}
);

Textarea.displayName = 'Textarea'; 