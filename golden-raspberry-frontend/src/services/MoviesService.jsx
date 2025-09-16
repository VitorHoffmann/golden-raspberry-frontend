const BASE_URL = "https://challenge.outsera.tech/api/movies"; // altere para sua API real

export async function listMovies(page, size, winner = null, year = null) {
    try {
        let params = "page=" + page + "&size=" + size;
        params += !!winner && winner !== '' ? "&winner=" + winner : "";
        params += !!year && year !== '' ? "&year=" + year : "";

        const response = await fetch(`${BASE_URL}?` + params);
        if (!response.ok) throw new Error("Error loading movie list");
        return await response.json();
    } catch (error) {
        console.error("Error API (movie data):", error);
        return null;
    }
}

export async function getMovieById(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Error get movie");
        return await response.json();
    } catch (error) {
        console.error("Error API (movie by ID):", error);
        return null;
    }
}

export async function getYearsWithMultipleWinners() {
    try {
        const response = await fetch(`${BASE_URL}/yearsWithMultipleWinners`);
        if (!response.ok) throw new Error("Error loading years with multiple winners");
        return await response.json();
    } catch (error) {
        console.error("Erro API (years with multiple winners):", error);
        return null;
    }
}

export async function getWinnersByYear(year) {
    try {
        const response = await fetch(`${BASE_URL}/winnersByYear?year=${year}`);
        if (!response.ok) throw new Error("Error loading list of winners by year");
        return await response.json();
    } catch (error) {
        console.error("Erro API (winners by year):", error);
        return null;
    }
}

export async function getStudiosWithWinCount() {
    try {
        const response = await fetch(`${BASE_URL}/studiosWithWinCount`);
        if (!response.ok) throw new Error("Error loading studios with wins count");
        return await response.json();
    } catch (error) {
        console.error("Erro API (studios with win count):", error);
        return null;
    }
}

export async function getMaxMinWinIntervalForProducers() {
    try {
        const response = await fetch(`${BASE_URL}/maxMinWinIntervalForProducers`);
        if (!response.ok) throw new Error("Error loading max and min win interval for producers");
        return await response.json();
    } catch (error) {
        console.error("Erro API (max min win interval for producers):", error);
        return null;
    }
}



