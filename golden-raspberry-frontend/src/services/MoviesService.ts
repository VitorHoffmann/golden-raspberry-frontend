import type {
    Movie,
    MoviesPage,
    MultipleWinnersResponse,
    ProducerInterval,
    ProducersIntervalResponse,
    Studio,
    StudiosResponse,
    YearWithWinners,
} from '../types/movies';

const DEFAULT_BASE_URL = 'https://challenge.outsera.tech/api/movies';
const BASE_URL = process.env.REACT_APP_MOVIES_API ?? DEFAULT_BASE_URL;

type WinnersByYearApiResponse = Movie[] | { winners?: Movie[] } | { content?: Movie[] };

type MoviesPageApiResponse = Partial<MoviesPage> & {
    content?: Partial<Movie>[];
};

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request to ${url} failed with status ${response.status}`);
    }

    return (await response.json()) as T;
}

function normalizeMovie(movie: Partial<Movie>): Movie {
    return {
        id: Number(movie.id ?? 0),
        title: String(movie.title ?? ''),
        year: Number(movie.year ?? 0),
        winner: Boolean(movie.winner),
    };
}

export async function listMovies(
    page: number,
    size: number,
    winner?: string,
    year?: string,
): Promise<MoviesPage> {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (winner) {
        params.append('winner', winner);
    }

    if (year) {
        params.append('year', year);
    }

    const data = await fetchJson<MoviesPageApiResponse>(`${BASE_URL}?${params.toString()}`);

    const content = Array.isArray(data.content)
        ? data.content.map(normalizeMovie)
        : [];

    return {
        content,
        totalPages: typeof data.totalPages === 'number' ? data.totalPages : 0,
        totalElements:
            typeof data.totalElements === 'number'
                ? data.totalElements
                : content.length,
        number: typeof data.number === 'number' ? data.number : page,
    };
}

export async function getYearsWithMultipleWinners(): Promise<YearWithWinners[]> {
    const data = await fetchJson<MultipleWinnersResponse | YearWithWinners[]>(
        `${BASE_URL}/yearsWithMultipleWinners`,
    );

    const years = Array.isArray(data)
        ? data
        : Array.isArray((data as MultipleWinnersResponse).years)
            ? (data as MultipleWinnersResponse).years
            : [];

    return years.map((year) => ({
        year: Number(year.year ?? 0),
        winnerCount: Number(year.winnerCount ?? 0),
    }));
}

export async function getStudiosWithWinCount(): Promise<Studio[]> {
    const data = await fetchJson<StudiosResponse | Studio[]>(
        `${BASE_URL}/studiosWithWinCount`,
    );

    const studios = Array.isArray(data)
        ? data
        : Array.isArray((data as StudiosResponse).studios)
            ? (data as StudiosResponse).studios
            : [];

    return studios.map((studio) => ({
        name: String(studio.name ?? ''),
        winCount: Number(studio.winCount ?? 0),
    }));
}

export async function getMaxMinWinIntervalForProducers(): Promise<ProducersIntervalResponse> {
    const data = await fetchJson<ProducersIntervalResponse>(
        `${BASE_URL}/maxMinWinIntervalForProducers`,
    );

    const normalizeIntervals = (intervals?: ProducerInterval[]): ProducerInterval[] =>
        Array.isArray(intervals)
            ? intervals.map((interval) => ({
                producer: String(interval.producer ?? ''),
                interval: Number(interval.interval ?? 0),
                previousWin: Number(interval.previousWin ?? 0),
                followingWin: Number(interval.followingWin ?? 0),
            }))
            : [];

    return {
        min: normalizeIntervals(data.min),
        max: normalizeIntervals(data.max),
    };
}

export async function getWinnersByYear(year: string): Promise<Movie[]> {
    const data = await fetchJson<WinnersByYearApiResponse>(
        `${BASE_URL}/winnersByYear?year=${encodeURIComponent(year)}`,
    );

    const winners = Array.isArray(data)
        ? data
        : Array.isArray((data as { winners?: Movie[] }).winners)
            ? (data as { winners?: Movie[] }).winners
            : Array.isArray((data as { content?: Movie[] }).content)
                ? (data as { content?: Movie[] }).content
                : [];

    return winners.map(normalizeMovie);
}