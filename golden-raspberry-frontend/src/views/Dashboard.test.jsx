import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from '../components/Dashboard';

import * as MoviesService from '../services/MoviesService';

jest.mock('../services/MoviesService');

describe('Dashboard component', () => {
    const mockYearsWithMultipleWinners = [
        { year: 2000, winnerCount: 2 },
        { year: 2005, winnerCount: 3 }
    ];

    const mockStudiosWithWinCount = {
        studios: [
            { name: 'StudioA', winCount: 5 },
            { name: 'StudioB', winCount: 3 },
            { name: 'StudioC', winCount: 2 },
            { name: 'StudioD', winCount: 1 }
        ]
    };

    const mockMinMaxProducers = {
        min: [
            { producer: 'Producer1', interval: 1, previousWin: 2001, followingWin: 2002 }
        ],
        max: [
            { producer: 'ProducerMax', interval: 10, previousWin: 1990, followingWin: 2000 }
        ]
    };

    const mockWinnersByYear = [
        { id: '1', year: 2000, title: 'Movie1' },
        { id: '2', year: 2000, title: 'Movie2' }
    ];

    beforeEach(() => {
        MoviesService.getYearsWithMultipleWinners.mockReset();
        MoviesService.getStudiosWithWinCount.mockReset();
        MoviesService.getMaxMinWinIntervalForProducers.mockReset();
        MoviesService.getWinnersByYear.mockReset();
    });

    it('deve mostrar loading inicial e depois renderizar os dados do dashboard', async () => {
        MoviesService.getYearsWithMultipleWinners.mockResolvedValueOnce(mockYearsWithMultipleWinners);
        MoviesService.getStudiosWithWinCount.mockResolvedValueOnce(mockStudiosWithWinCount);
        MoviesService.getMaxMinWinIntervalForProducers.mockResolvedValueOnce(mockMinMaxProducers);

        render(<Dashboard />);

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('2000')).toBeInTheDocument();
        });

        expect(screen.queryByText(/Carregando.../i)).not.toBeInTheDocument();
    });

    it('deve buscar vencedores por ano quando o usuário insere um ano e clica no botão', async () => {
        MoviesService.getYearsWithMultipleWinners.mockResolvedValueOnce(mockYearsWithMultipleWinners);
        MoviesService.getStudiosWithWinCount.mockResolvedValueOnce(mockStudiosWithWinCount);
        MoviesService.getMaxMinWinIntervalForProducers.mockResolvedValueOnce(mockMinMaxProducers);

        MoviesService.getWinnersByYear.mockResolvedValueOnce(mockWinnersByYear);
        render(<Dashboard />);


        await waitFor(() => {
            expect(screen.getByText('StudioA')).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText(/Search by year/i);
        fireEvent.change(input, { target: { value: '2000' } });

        const button = screen.getByRole('button', { name: /search/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Movie1')).toBeInTheDocument();
        });
    });

    it('deve tratar retorno vazio para winnersByYear', async () => {
        MoviesService.getYearsWithMultipleWinners.mockResolvedValueOnce(mockYearsWithMultipleWinners);
        MoviesService.getStudiosWithWinCount.mockResolvedValueOnce(mockStudiosWithWinCount);
        MoviesService.getMaxMinWinIntervalForProducers.mockResolvedValueOnce(mockMinMaxProducers);

        MoviesService.getWinnersByYear.mockResolvedValueOnce([]);  // nenhum filme para o ano

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('StudioA')).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText(/Search by year/i);
        fireEvent.change(input, { target: { value: '1999' } });

        const button = screen.getByRole('button', { name: /search/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.queryByText('Movie1')).not.toBeInTheDocument();
        });
    });

    it('deve esconder o loading após falha / exceção nos serviços iniciais', async () => {
        MoviesService.getYearsWithMultipleWinners.mockRejectedValueOnce(new Error('Erro de rede'));
        MoviesService.getStudiosWithWinCount.mockResolvedValueOnce(mockStudiosWithWinCount);
        MoviesService.getMaxMinWinIntervalForProducers.mockResolvedValueOnce(mockMinMaxProducers);

        render(<Dashboard />);

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText(/Carregando.../i)).not.toBeInTheDocument();
        });

        expect(screen.queryByText('2000')).not.toBeInTheDocument();
    });

});
