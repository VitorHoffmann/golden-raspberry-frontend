import type { FC } from 'react';

interface LoadingIndicatorProps {
    label?: string;
}

const LoadingIndicator: FC<LoadingIndicatorProps> = ({ label = 'Loading...' }) => (
    <div className="d-flex justify-content-center align-items-center py-5" role="status">
        <div className="spinner-border text-primary" aria-hidden="true" />
        <span className="visually-hidden">{label}</span>
    </div>
);

export default LoadingIndicator;