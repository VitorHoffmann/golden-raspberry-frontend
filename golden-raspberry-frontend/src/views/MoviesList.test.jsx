import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieTable from '../views/MoviesList';
import * as MoviesService from '../services/MoviesService';

jest.mock('../services/MoviesService');

describe('MoviesList', () => {
    const mockMoviesList = {
        content: [
            { id: 1, year: 2000, title: 'Movie A', winner: true },
            { id: 2, year: 2001, title: 'Movie B', winner: false }
        ],
        totalPages: 3
    };

    const emptyMoviesList = {
        content: [],
        totalPages: 1
    };

    beforeEach(() => {
        MoviesService.listMovies.mockReset();
    });

    it('deve carregar e exibir filmes corretamente', async () => {
        MoviesService.listMovies.mockResolvedValueOnce(mockMoviesList);

        render(<MovieTable />);

        await waitFor(() => {
            expect(screen.getByText('Movie A')).toBeInTheDocument();
        });

        expect(screen.getAllByRole('button')).toHaveLength(mockMoviesList.totalPages+4); // +2 para << >>
    });

    it('deve exibir mensagem quando não houver resultados', async () => {
        MoviesService.listMovies.mockResolvedValueOnce(emptyMoviesList);

        render(<MovieTable />);

        await waitFor(() => {
            expect(screen.getByText(/No results found/i)).toBeInTheDocument();
        });
    });
});
