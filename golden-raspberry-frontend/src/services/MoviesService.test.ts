import {
    getMaxMinWinIntervalForProducers,
    getStudiosWithWinCount,
    getWinnersByYear,
    getYearsWithMultipleWinners,
    listMovies,
} from './MoviesService';
import type { Movie } from '../types/movies';

describe('MoviesService', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
        global.fetch = originalFetch;
    });

    it('listMovies builds the query string and normalises movies', async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                content: [
                    { id: '1', title: 'Movie 1', year: '1980', winner: 'true' },
                ],
                totalPages: 4,
                totalElements: 1,
                number: 1,
            }),
        } as Response;

        (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

        const result = await listMovies(1, 10, 'true', '1980');

        expect(global.fetch).toHaveBeenCalledWith(
            'https://challenge.outsera.tech/api/movies?page=1&size=10&winner=true&year=1980',
        );
        expect(result.content).toEqual([
            { id: 1, title: 'Movie 1', year: 1980, winner: true },
        ]);
        expect(result.totalPages).toBe(4);
        expect(result.number).toBe(1);
    });

    it('getYearsWithMultipleWinners returns the years array', async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({ years: [{ year: '1980', winnerCount: '2' }] }),
        } as Response;

        (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

        const years = await getYearsWithMultipleWinners();
        expect(global.fetch).toHaveBeenCalledWith(
            'https://challenge.outsera.tech/api/movies/yearsWithMultipleWinners',
        );
        expect(years).toEqual([{ year: 1980, winnerCount: 2 }]);
    });

    it('getStudiosWithWinCount returns studios list', async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({ studios: [{ name: 'Studio A', winCount: '5' }] }),
        } as Response;

        (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

        const studios = await getStudiosWithWinCount();
        expect(global.fetch).toHaveBeenCalledWith(
            'https://challenge.outsera.tech/api/movies/studiosWithWinCount',
        );
        expect(studios).toEqual([{ name: 'Studio A', winCount: 5 }]);
    });

    it('getMaxMinWinIntervalForProducers normalises the response', async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                min: [{ producer: 'Producer A', interval: '1', previousWin: '1980', followingWin: '1981' }],
                max: [{ producer: 'Producer B', interval: '5', previousWin: '1970', followingWin: '1975' }],
            }),
        } as Response;

        (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

        const result = await getMaxMinWinIntervalForProducers();
        expect(global.fetch).toHaveBeenCalledWith(
            'https://challenge.outsera.tech/api/movies/maxMinWinIntervalForProducers',
        );
        expect(result.min[0]).toEqual({
            producer: 'Producer A',
            interval: 1,
            previousWin: 1980,
            followingWin: 1981,
        });
        expect(result.max[0]).toEqual({
            producer: 'Producer B',
            interval: 5,
            previousWin: 1970,
            followingWin: 1975,
        });
    });

    it('getWinnersByYear accepts different response shapes', async () => {
        const mockMovies: Movie[] = [
            { id: 1, title: 'Movie 1', year: 1980, winner: true },
        ];

        const firstResponse = { ok: true, json: async () => mockMovies } as Response;
        const secondResponse = { ok: true, json: async () => ({ winners: mockMovies }) } as Response;

        (global.fetch as jest.Mock)
            .mockResolvedValueOnce(firstResponse)
            .mockResolvedValueOnce(secondResponse);

        const result1 = await getWinnersByYear('1980');
        const result2 = await getWinnersByYear('1981');

        expect(global.fetch).toHaveBeenNthCalledWith(
            1,
            'https://challenge.outsera.tech/api/movies/winnersByYear?year=1980',
        );
        expect(global.fetch).toHaveBeenNthCalledWith(
            2,
            'https://challenge.outsera.tech/api/movies/winnersByYear?year=1981',
        );
        expect(result1).toEqual(mockMovies);
        expect(result2).toEqual(mockMovies);
    });
});