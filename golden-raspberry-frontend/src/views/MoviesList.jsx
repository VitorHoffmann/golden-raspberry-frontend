import React, { useEffect, useState } from 'react';
import {listMovies} from "../services/MoviesService";

const MovieTable = () => {
    const [movies, setMovies] = useState([]);
    const [yearFilter, setYearFilter] = useState('');
    const [winnerFilter, setWinnerFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const size = 15;
    const [loading, setLoading] = useState(true);

    const loadMovies = async () => {
        try {
            setLoading(true);
            const data = await listMovies(
                page,
                size
            );
            setMovies(data.content);
            setTotalPages(data.totalPages);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMovies();
    }, [page, size]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    async function filterMovies() {
        setLoading(true);
        const data = await listMovies(
            0,
            size,
            winnerFilter,
            yearFilter
        );
        setMovies(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
    }

    function clearFilter() {
        setWinnerFilter('');
        setYearFilter('');
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h3>List movies</h3>

            <div className="table-responsive mt-3">

                <div className="input-group mb-3 mt-2">
                    <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Filter by year"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                    />

                    <select
                        className="form-select form-select-sm"
                        value={winnerFilter}
                        onChange={(e) => setWinnerFilter(e.target.value)}
                    >
                        <option value="">Yes/No</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                    <button className="btn btn-secondary" onClick={clearFilter}>
                        <span>Clear Filter</span>
                    </button>
                    <button className="btn btn-primary" onClick={filterMovies}>
                        <i className="bi bi-search"></i>
                    </button>
                </div>

                <table className="table table-bordered align-middle text-center">
                    <thead className="table-light">
                    <tr>
                    <th>ID</th>
                        <th>Year</th>
                        <th>Title</th>
                        <th>Winner?</th>
                    </tr>
                    </thead>
                    <tbody>
                    {movies.length > 0 ? (
                        movies.map((movie) => (
                            <tr key={movie.id}>
                                <td>{movie.id}</td>
                                <td>{movie.year}</td>
                                <td>{movie.title}</td>
                                <td>{movie.winner ? 'Yes' : 'No'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No results found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(page - 1)}>&laquo;</button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${i === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(i)}>{i + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(page + 1)}>&raquo;</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default MovieTable;
