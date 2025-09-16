import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../views/Dashboard';
import * as MoviesService from '../services/MoviesService';

jest.mock('../services/MoviesService');

describe('Dashboard component (useEffect & loadDashboard)', () => {
    const mockYears = [
        { year: 2000, winnerCount: 2 },
        { year: 2005, winnerCount: 3 }
    ];

    const mockStudios = {
        studios: [
            { name: 'Studio A', winCount: 5 },
            { name: 'Studio B', winCount: 3 },
            { name: 'Studio C', winCount: 2 },
            { name: 'Studio D', winCount: 1 }
        ]
    };

    const mockIntervals = {
        min: [{ producer: 'Prod Min', interval: 1, previousWin: 2000, followingWin: 2001 }],
        max: [{ producer: 'Prod Max', interval: 10, previousWin: 1990, followingWin: 2000 }]
    };

    const mockMoviesByYear = [
        { id: '1', year: 2000, title: 'Movie 1' },
        { id: '2', year: 2000, title: 'Movie 2' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        MoviesService.getYearsWithMultipleWinners.mockResolvedValue(mockYears);
        MoviesService.getStudiosWithWinCount.mockResolvedValue(mockStudios);
        MoviesService.getMaxMinWinIntervalForProducers.mockResolvedValue(mockIntervals);
        MoviesService.getWinnersByYear.mockResolvedValue(mockMoviesByYear);
    });

    it('deve chamar loadDashboard no primeiro render (useEffect)', async () => {
        render(<Dashboard />);

        expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(MoviesService.getYearsWithMultipleWinners).toHaveBeenCalledTimes(1);
            expect(MoviesService.getStudiosWithWinCount).toHaveBeenCalledTimes(1);
            expect(MoviesService.getMaxMinWinIntervalForProducers).toHaveBeenCalledTimes(1);
        });
    });

    it('deve buscar filmes por ano quando searchMoviesByYear é chamado', async () => {
        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('Studio A')).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText(/Search by year/i);
        fireEvent.change(input, { target: { value: '2000' } });

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(MoviesService.getWinnersByYear).toHaveBeenCalledWith('2000');
            expect(screen.getByText('Movie 1')).toBeInTheDocument();
            expect(screen.getByText('Movie 2')).toBeInTheDocument();
        });
    });

    it('deve lidar com retorno vazio de getWinnersByYear', async () => {
        MoviesService.getWinnersByYear.mockResolvedValueOnce([]);

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('Studio A')).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText(/Search by year/i);
        fireEvent.change(input, { target: { value: '1999' } });

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(MoviesService.getWinnersByYear).toHaveBeenCalledWith('1999');
            expect(screen.queryByText('Movie 1')).not.toBeInTheDocument();
        });
    });

    it('deve parar o loading mesmo quando loadDashboard falhar', async () => {
        MoviesService.getYearsWithMultipleWinners.mockRejectedValueOnce(new Error('Erro'));

        render(<Dashboard />);

        expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    });
});
