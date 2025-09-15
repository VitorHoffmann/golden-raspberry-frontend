import {
    listMovies,
    getMovieById,
    getYearsWithMultipleWinners,
    getWinnersByYear,
    getStudiosWithWinCount,
    getMaxMinWinIntervalForProducers
} from './movieApi';

beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('movieApi', () => {

    describe('listMovies', () => {
        it('deve retornar dados quando fetch retorna ok e JSON válido', async () => {
            const mockData = { movies: ['Filme1', 'Filme2'], page: 1, size: 10 };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData
            });

            const result = await listMovies({ page: 1, size: 10, winner: '', year: '' });
            expect(result).toEqual(mockData);
            expect(fetch).toHaveBeenCalledWith(
                "https://challenge.outsera.tech/api/movies/api/movies",
                { params: { page: 1, size: 10 } }
            );
        });

        it('deve acrescentar winner como booleano quando winner = "Yes"', async () => {
            const mockData = { movies: ['FilmeX'], page: 2, size: 5, winner: true };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData
            });

            const result = await listMovies({ page: 2, size: 5, winner: 'Yes', year: '' });
            expect(result).toEqual(mockData);
            expect(fetch).toHaveBeenCalledWith(
                "https://challenge.outsera.tech/api/movies/api/movies",
                { params: { page: 2, size: 5, winner: true } }
            );
        });

        it('deve retornar null quando fetch retorna status !ok', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => ({ error: 'Server error' })
            });

            const result = await listMovies({ page: 1, size: 10, winner: '', year: '' });
            expect(result).toBeNull();
        });

        it('deve retornar null quando fetch rejeita', async () => {
            global.fetch.mockRejectedValueOnce(new Error("Network Error"));

            const result = await listMovies({ page: 1, size: 10, winner: '', year: '' });
            expect(result).toBeNull();
        });
    });

    describe('getMovieById', () => {
        it('deve retornar filme se fetch ok', async () => {
            const mockMovie = { id: '123', title: 'Meu Filme' };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockMovie
            });

            const result = await getMovieById('123');
            expect(result).toEqual(mockMovie);
            expect(fetch).toHaveBeenCalledWith("https://challenge.outsera.tech/api/movies/123");
        });

        it('deve retornar null se status !ok', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: async () => ({ error: 'Not found' })
            });

            const result = await getMovieById('999');
            expect(result).toBeNull();
        });

        it('deve retornar null se fetch rejeitar', async () => {
            global.fetch.mockRejectedValueOnce(new Error("Fetch failed"));
            const result = await getMovieById('123');
            expect(result).toBeNull();
        });
    });

    // testes semelhantes para os outros métodos:

    describe('getYearsWithMultipleWinners', () => {
        it('should return JSON when ok', async () => {
            const data = { years: [2000, 2005] };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => data
            });

            const result = await getYearsWithMultipleWinners();
            expect(result).toEqual(data);
            expect(fetch).toHaveBeenCalledWith("https://challenge.outsera.tech/api/movies/yearsWithMultipleWinners");
        });

        it('should return null when not ok', async () => {
            global.fetch.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });
            const result = await getYearsWithMultipleWinners();
            expect(result).toBeNull();
        });
    });

    describe('getWinnersByYear', () => {
        it('should attach year query param and return data', async () => {
            const data = { winners: ['Prod1', 'Prod2'] };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => data
            });

            const result = await getWinnersByYear(2020);
            expect(result).toEqual(data);
            expect(fetch).toHaveBeenCalledWith("https://challenge.outsera.tech/api/movies/winnersByYear?year=2020");
        });

        it('should return null if response not ok', async () => {
            global.fetch.mockResolvedValueOnce({ ok: false, status: 400, json: async () => ({}) });
            const result = await getWinnersByYear(2020);
            expect(result).toBeNull();
        });
    });

    describe('getStudiosWithWinCount', () => {
        it('returns JSON when ok', async () => {
            const data = { studios: ['StudioA'] };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => data
            });
            const result = await getStudiosWithWinCount();
            expect(result).toEqual(data);
            expect(fetch).toHaveBeenCalledWith("https://challenge.outsera.tech/api/movies/studiosWithWinCount");
        });

        it('returns null on failure', async () => {
            global.fetch.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });
            const result = await getStudiosWithWinCount();
            expect(result).toBeNull();
        });
    });

    describe('getMaxMinWinIntervalForProducers', () => {
        it('returns JSON when ok', async () => {
            const data = { intervals: [] };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => data
            });
            const result = await getMaxMinWinIntervalForProducers();
            expect(result).toEqual(data);
            expect(fetch).toHaveBeenCalledWith("https://challenge.outsera.tech/api/movies/maxMinWinIntervalForProducers");
        });

        it('returns null when !ok', async () => {
            global.fetch.mockResolvedValueOnce({ ok: false, status: 503, json: async () => ({}) });
            const result = await getMaxMinWinIntervalForProducers();
            expect(result).toBeNull();
        });
    });

});
