import type { ChangeEventHandler, FC } from 'react';

type WinnerFilterValue = '' | 'true' | 'false';

interface MoviesFiltersProps {
    yearValue: string;
    winnerValue: WinnerFilterValue;
    onYearChange: ChangeEventHandler<HTMLInputElement>;
    onWinnerChange: ChangeEventHandler<HTMLSelectElement>;
    onApply: () => void;
    onClear: () => void;
    isLoading: boolean;
}

const MoviesFilters: FC<MoviesFiltersProps> = ({
                                                   yearValue,
                                                   winnerValue,
                                                   onYearChange,
                                                   onWinnerChange,
                                                   onApply,
                                                   onClear,
                                                   isLoading,
                                               }) => (
    <div className="input-group mb-3 mt-2">
        <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Filter by year"
            value={yearValue}
            onChange={onYearChange}
            min="0"
        />
        <select
            className="form-select form-select-sm"
            value={winnerValue}
            onChange={onWinnerChange}
        >
            <option value="">Yes/No</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
        </select>
        <button className="btn btn-secondary" type="button" onClick={onClear} disabled={isLoading}>
            Clear Filter
        </button>
        <button className="btn btn-primary" type="button" onClick={onApply} disabled={isLoading}>
            {isLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
                <i className="bi bi-search" aria-hidden="true" />
            )}
            <span className="visually-hidden">Apply filters</span>
        </button>
    </div>
);

export default MoviesFilters;
export type { WinnerFilterValue };