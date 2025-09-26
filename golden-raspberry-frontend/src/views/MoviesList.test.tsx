import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MoviesList from './MoviesList';
import * as MoviesService from '../services/MoviesService';
import type { MoviesPage } from '../types/movies';

jest.mock('../services/MoviesService');

const moviesService = jest.mocked(MoviesService);

describe('MoviesList', () => {
    const mockMoviesPage: MoviesPage = {
        content: [
            { id: 1, year: 2000, title: 'Movie A', winner: true },
            { id: 2, year: 2001, title: 'Movie B', winner: false },
        ],
        totalPages: 3,
        totalElements: 2,
        number: 0,
    };

    const emptyMoviesPage: MoviesPage = {
        content: [],
        totalPages: 1,
        totalElements: 0,
        number: 0,
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('loads and displays movies', async () => {
        moviesService.listMovies.mockResolvedValueOnce(mockMoviesPage);

        render(<MoviesList />);

        expect(screen.getByText(/Loading movies/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(moviesService.listMovies).toHaveBeenCalledWith(0, 15, undefined, undefined);
            expect(screen.getByText('Movie A')).toBeInTheDocument();
            expect(screen.getByText('Movie B')).toBeInTheDocument();
        });
    });

    it('shows message when no movies are found', async () => {
        moviesService.listMovies.mockResolvedValueOnce(emptyMoviesPage);

        render(<MoviesList />);

        await waitFor(() => {
            expect(screen.getByText(/No results found/i)).toBeInTheDocument();
        });
    });
});