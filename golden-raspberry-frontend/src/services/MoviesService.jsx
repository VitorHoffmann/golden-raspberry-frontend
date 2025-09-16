const BASE_URL = "https://challenge.outsera.tech/api/movies"; // altere para sua API real

export async function listMovies(page, size, winner, year) {
    try {
        let params = "page=" + page + "&size=" + size;
        params += winner ? "&winner=" + winner : "";
        params += year ? "&year=" + year : "";

        const response = await fetch(`${BASE_URL}?` + params);
        if (!response.ok) throw new Error("Erro ao carregar lista de filmes");
        return await response.json();
    } catch (error) {
        console.error("Erro API (movie data):", error);
        return null;
    }
}

export async function getMovieById(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar filme");
        return await response.json();
    } catch (error) {
        console.error("Erro API (Movie by ID):", error);
        return null;
    }
}

export async function getYearsWithMultipleWinners() {
    try {
        const response = await fetch(`${BASE_URL}/yearsWithMultipleWinners`);
        if (!response.ok) throw new Error("Erro ao carregar anos com multiplos vencedores");
        return await response.json();
    } catch (error) {
        console.error("Erro API (movie data):", error);
        return null;
    }
}

export async function getWinnersByYear(year) {
    try {
        const response = await fetch(`${BASE_URL}/winnersByYear?year=${year}`);
        if (!response.ok) throw new Error("Erro ao carregar lista de vencedores por ano");
        return await response.json();
    } catch (error) {
        console.error("Erro API (movie data):", error);
        return null;
    }
}

export async function getStudiosWithWinCount() {
    try {
        const response = await fetch(`${BASE_URL}/studiosWithWinCount`);
        if (!response.ok) throw new Error("Erro ao carregar estudios com vitorias");
        return await response.json();
    } catch (error) {
        console.error("Erro API (movie data):", error);
        return null;
    }
}

export async function getMaxMinWinIntervalForProducers() {
    try {
        const response = await fetch(`${BASE_URL}/maxMinWinIntervalForProducers`);
        if (!response.ok) throw new Error("Erro ao carregar intervalo de vitorias");
        return await response.json();
    } catch (error) {
        console.error("Erro API (movie data):", error);
        return null;
    }
}



