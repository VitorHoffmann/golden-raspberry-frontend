export interface Movie {
    id: number;
    title: string;
    year: number;
    winner: boolean;
}

export interface MoviesPage {
    content: Movie[];
    totalPages: number;
    totalElements: number;
    number: number;
}

export interface YearWithWinners {
    year: number;
    winnerCount: number;
}

export interface MultipleWinnersResponse {
    years: YearWithWinners[];
}

export interface Studio {
    name: string;
    winCount: number;
}

export interface StudiosResponse {
    studios: Studio[];
}

export interface ProducerInterval {
    producer: string;
    interval: number;
    previousWin: number;
    followingWin: number;
}

export interface ProducersIntervalResponse {
    min: ProducerInterval[];
    max: ProducerInterval[];
}