import React from 'react';
import './style.css';
import { TButtonProps } from './types';

export const Button = ({
    text,
    onClick,
    style,
    backgroundColor = 'rgba(81, 199, 47, 1)',
    filled = true,
}: TButtonProps) => {
    return (
        <button
            onClick={onClick}
            style={{
                ...style,
                backgroundColor: filled ? backgroundColor : 'transparent',
                border: filled ? 'none' : `1px solid ${backgroundColor}`,
            }}>
            <p style={{ color: filled ? 'white' : backgroundColor }}>{text}</p>
        </button>
    );
};
