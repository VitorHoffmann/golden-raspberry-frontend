import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import LoadingIndicator from '../components/common/LoadingIndicator.tsx';
import MoviesFilters, { type WinnerFilterValue } from '../components/movies/MoviesFilters.tsx';
import MoviesTable from '../components/movies/MoviesTable.tsx';
import PaginationControls from '../components/movies/PaginationControls.tsx';
import { listMovies } from '../services/MoviesService.ts';
import type { Movie } from '../types/movies';

const PAGE_SIZE = 15;

const MoviesList = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [yearFilterInput, setYearFilterInput] = useState<string>('');
    const [winnerFilterInput, setWinnerFilterInput] = useState<WinnerFilterValue>('');
    const [yearFilter, setYearFilter] = useState<string>('');
    const [winnerFilter, setWinnerFilter] = useState<WinnerFilterValue>('');
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadMovies = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await listMovies(
                currentPage,
                PAGE_SIZE,
                winnerFilter || undefined,
                yearFilter || undefined,
            );

            setMovies(result.content);
            setTotalPages(result.totalPages);
        } catch (err) {
            console.error('Error while loading movie list', err);
            setMovies([]);
            setTotalPages(0);
            setError('Unable to load movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, winnerFilter, yearFilter]);

    useEffect(() => {
        void loadMovies();
    }, [loadMovies]);

    const handlePageChange = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const handleApplyFilters = () => {
        setCurrentPage(0);
        setYearFilter(yearFilterInput.trim());
        setWinnerFilter(winnerFilterInput);
    };

    const handleClearFilters = () => {
        setYearFilterInput('');
        setWinnerFilterInput('');
        setYearFilter('');
        setWinnerFilter('');
        setCurrentPage(0);
    };

    const handleYearInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setYearFilterInput(event.target.value);
    };

    const handleWinnerInputChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setWinnerFilterInput(event.target.value as WinnerFilterValue);
    };

    return (
        <div className="container mt-4">
            <h3>List movies</h3>
            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div>
            )}

            <MoviesFilters
                yearValue={yearFilterInput}
                winnerValue={winnerFilterInput}
                onYearChange={handleYearInputChange}
                onWinnerChange={handleWinnerInputChange}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                isLoading={isLoading}
            />

            {isLoading ? (
                <LoadingIndicator label="Loading movies" />
            ) : (
                <>
                    <div className="table-responsive mt-3">
                        <MoviesTable movies={movies} />
                    </div>
                    <PaginationControls currentPage={currentPage} totalPages={totalPages} onChange={handlePageChange} />
                </>
            )}
        </div>
    );
};

export default MoviesList;