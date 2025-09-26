import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import type { Movie } from '../../types/movies';

interface WinnersByYearSectionProps {
    searchYear: string;
    movies: Movie[];
    onYearChange: ChangeEventHandler<HTMLInputElement>;
    onSearch: FormEventHandler<HTMLFormElement>;
    isSearching: boolean;
    errorMessage?: string | null;
}

const WinnersByYearSection: FC<WinnersByYearSectionProps> = ({
                                                                 searchYear,
                                                                 movies,
                                                                 onYearChange,
                                                                 onSearch,
                                                                 isSearching,
                                                                 errorMessage,
                                                             }) => (
    <div className="card shadow-sm h-100">
        <div className="card-body">
            <h5 className="card-title">List movie winners by year</h5>
            <form className="input-group mb-3 mt-2" onSubmit={onSearch} noValidate>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Search by year"
                    value={searchYear}
                    onChange={onYearChange}
                    min="0"
                />
                <button className="btn btn-primary" type="submit" disabled={isSearching}>
                    {isSearching ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    ) : (
                        <i className="bi bi-search" aria-hidden="true" />
                    )}
                    <span className="visually-hidden">Search</span>
                </button>
            </form>
            {errorMessage && <div className="alert alert-warning py-2" role="alert">{errorMessage}</div>}
            <table className="table table-striped table-bordered">
                <thead className="table-light">
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Year</th>
                    <th scope="col">Title</th>
                </tr>
                </thead>
                <tbody>
                {movies.map((movie) => (
                    <tr key={movie.id}>
                        <td>{movie.id}</td>
                        <td>{movie.year}</td>
                        <td>{movie.title}</td>
                    </tr>
                ))}
                {movies.length === 0 && (
                    <tr>
                        <td colSpan={3} className="text-center">
                            No winners found for this year
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    </div>
);

export default WinnersByYearSection;