import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';
import * as MoviesService from '../services/MoviesService';
import type { Movie, ProducerInterval, Studio, YearWithWinners } from '../types/movies';

jest.mock('../services/MoviesService');

const moviesService = jest.mocked(MoviesService);

describe('Dashboard', () => {
    const mockYears: YearWithWinners[] = [
        { year: 2000, winnerCount: 2 },
        { year: 2005, winnerCount: 3 },
    ];

    const mockStudios: Studio[] = [
        { name: 'Studio A', winCount: 5 },
        { name: 'Studio B', winCount: 3 },
        { name: 'Studio C', winCount: 2 },
        { name: 'Studio D', winCount: 1 },
    ];

    const mockIntervals: { min: ProducerInterval[]; max: ProducerInterval[] } = {
        min: [{ producer: 'Prod Min', interval: 1, previousWin: 2000, followingWin: 2001 }],
        max: [{ producer: 'Prod Max', interval: 10, previousWin: 1990, followingWin: 2000 }],
    };

    const mockMoviesByYear: Movie[] = [
        { id: 1, year: 2000, title: 'Movie 1', winner: true },
        { id: 2, year: 2000, title: 'Movie 2', winner: true },
    ];

    beforeEach(() => {
        jest.resetAllMocks();

        moviesService.getYearsWithMultipleWinners.mockResolvedValue(mockYears);
        moviesService.getStudiosWithWinCount.mockResolvedValue(mockStudios);
        moviesService.getMaxMinWinIntervalForProducers.mockResolvedValue(mockIntervals);
        moviesService.getWinnersByYear.mockResolvedValue(mockMoviesByYear);
    });

    it('loads dashboard data on first render', async () => {
        render(<Dashboard />);

        expect(screen.getByText(/Loading dashboard information/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(moviesService.getYearsWithMultipleWinners).toHaveBeenCalledTimes(1);
            expect(moviesService.getStudiosWithWinCount).toHaveBeenCalledTimes(1);
            expect(moviesService.getMaxMinWinIntervalForProducers).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText('Studio A')).toBeInTheDocument();
        expect(screen.getByText('Prod Max')).toBeInTheDocument();
    });

    it('searches winners by year when the form is submitted', async () => {
        render(<Dashboard />);

        await waitFor(() => expect(screen.getByText('Studio A')).toBeInTheDocument());

        const input = screen.getByPlaceholderText(/Search by year/i);
        fireEvent.change(input, { target: { value: '2000' } });

        const form = input.closest('form');
        expect(form).not.toBeNull();
        fireEvent.submit(form!);

        await waitFor(() => {
            expect(moviesService.getWinnersByYear).toHaveBeenCalledWith('2000');
            expect(screen.getByText('Movie 1')).toBeInTheDocument();
            expect(screen.getByText('Movie 2')).toBeInTheDocument();
        });
    });

    it('shows a warning when no winners are found', async () => {
        moviesService.getWinnersByYear.mockResolvedValueOnce([]);

        render(<Dashboard />);

        await waitFor(() => expect(screen.getByText('Studio A')).toBeInTheDocument());

        const input = screen.getByPlaceholderText(/Search by year/i);
        fireEvent.change(input, { target: { value: '1999' } });

        const form = input.closest('form');
        fireEvent.submit(form!);

        await waitFor(() => {
            expect(moviesService.getWinnersByYear).toHaveBeenCalledWith('1999');
            expect(screen.getByText(/No winners found for the provided year/i)).toBeInTheDocument();
        });
    });
});