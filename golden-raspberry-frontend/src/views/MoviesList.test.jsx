import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieTable from '../components/MovieTable';
import * as MoviesService from '../services/MoviesService';

jest.mock('../services/MoviesService');

describe('MovieTable', () => {
    const mockMoviesPage = {
        content: [
            { id: 1, year: 2000, title: 'Movie A', winner: true },
            { id: 2, year: 2001, title: 'Movie B', winner: false }
        ],
        totalPages: 3
    };

    const emptyMoviesPage = {
        content: [],
        totalPages: 1
    };

    beforeEach(() => {
        MoviesService.listMovies.mockReset();
    });

    it('deve carregar e exibir filmes corretamente', async () => {
        MoviesService.listMovies.mockResolvedValueOnce(mockMoviesPage);

        render(<MovieTable />);

        await waitFor(() => {
            expect(screen.getByText('Movie A')).toBeInTheDocument();
        });

        expect(screen.getAllByRole('button')).toHaveLength(mockMoviesPage.totalPages + 2); // +2 para << >>
    });

    it('deve exibir mensagem quando não houver resultados', async () => {
        MoviesService.listMovies.mockResolvedValueOnce(emptyMoviesPage);

        render(<MovieTable />);

        await waitFor(() => {
            expect(screen.getByText(/No results found/i)).toBeInTheDocument();
        });
    });

    it('deve aplicar filtro por ano', async () => {
        MoviesService.listMovies.mockResolvedValue(mockMoviesPage); // chamada inicial
        render(<MovieTable />);

        await waitFor(() => {
            expect(screen.getByText('Movie A')).toBeInTheDocument();
        });

        const yearInput = screen.getByPlaceholderText(/filter by year/i);
        fireEvent.change(yearInput, { target: { value: '2001' } });

        await waitFor(() => {
            expect(MoviesService.listMovies).toHaveBeenLastCalledWith(
                expect.objectContaining({ year: '2001' })
            );
        });
    });

    it('deve aplicar filtro por vencedor', async () => {
        MoviesService.listMovies.mockResolvedValue(mockMoviesPage);
        render(<MovieTable />);

        await waitFor(() => {
            expect(screen.getByText('Movie A')).toBeInTheDocument();
        });

        const winnerSelect = screen.getByDisplayValue('Yes/No');
        fireEvent.change(winnerSelect, { target: { value: 'Yes' } });

        await waitFor(() => {
            expect(MoviesService.listMovies).toHaveBeenLastCalledWith(
                expect.objectContaining({ winner: 'Yes' })
            );
        });
    });

    it('deve mudar página ao clicar na paginação', async () => {
        MoviesService.listMovies.mockResolvedValue(mockMoviesPage);

        render(<MovieTable />);

        await waitFor(() => {
            expect(screen.getByText('Movie A')).toBeInTheDocument();
        });

        const page2Button = screen.getByRole('button', { name: '2' });
        fireEvent.click(page2Button);

        await waitFor(() => {
            expect(MoviesService.listMovies).toHaveBeenLastCalledWith(
                expect.objectContaining({ page: 1 })
            );
        });
    });

    it('não deve mudar para página inválida', async () => {
        MoviesService.listMovies.mockResolvedValue(mockMoviesPage);

        render(<MovieTable />);

        await waitFor(() => {
            expect(screen.getByText('Movie A')).toBeInTheDocument();
        });

        const prevButton = screen.getByRole('button', { name: '«' });
        fireEvent.click(prevButton);

        expect(MoviesService.listMovies).toHaveBeenCalledTimes(1);
    });
});
