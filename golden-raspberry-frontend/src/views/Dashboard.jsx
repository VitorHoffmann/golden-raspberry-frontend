import React, { useEffect, useState } from "react";
import {
    getMaxMinWinIntervalForProducers,
    getStudiosWithWinCount,
    getWinnersByYear,
    getYearsWithMultipleWinners,
} from "../services/MoviesService";

export default function Dashboard() {
    const [yearMtplWinsList, setYearMtplWinsList] = useState([]);
    const [top3StudiosList, setTop3StudiosList] = useState([]);
    const [minIntervalList, setMinIntervalList] = useState([]);
    const [maxIntervalList, setMaxIntervalList] = useState([]);
    const [moviesByYearList, setMoviesByYearList] = useState([]);
    const [searchYear, setSearchYear] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            setLoading(true);

            const years = await getYearsWithMultipleWinners();
            setYearMtplWinsList(Array.isArray(years) ? years : years.years || []);

            const studios = await getStudiosWithWinCount();

            const top3 = (Array.isArray(studios) ? studios : studios.studios || [])
                .sort((a, b) => b.winCount - a.winCount) // maior primeiro
                .slice(0, 3);

            setTop3StudiosList(top3);

            const resultMinMax = await getMaxMinWinIntervalForProducers();
            setMinIntervalList(resultMinMax.min || []);
            setMaxIntervalList(resultMinMax.max || []);
        } finally {
            setLoading(false);
        }
    }

    async function searchMoviesByYear(year) {
        try {
            setLoading(true);
            const movies = await getWinnersByYear(year);
            setMoviesByYearList(Array.isArray(movies) ? movies : []);
        } finally {
            setLoading(false);
        }
    }

    function loadMoviesByYearList() {
        if (searchYear !== null && searchYear !== undefined && searchYear.length > 0) {
            searchMoviesByYear(searchYear)
        }
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
        <div className="container py-4">
            <h2 className="mb-4">Frontend React Test</h2>

            <div className="row g-4">
                {/* Years with multiple winners */}
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">List years with multiple winners</h5>
                            <table className="table table-striped table-bordered mt-3">
                                <thead className="table-light">
                                <tr>
                                    <th>Year</th>
                                    <th>Win Count</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(yearMtplWinsList).map((y) => (
                                    <tr key={y.year}>
                                        <td>{y.year}</td>
                                        <td>{y.winnerCount}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Top 3 studios */}
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Top 3 studios with winners</h5>
                            <table className="table table-striped table-bordered mt-3">
                                <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Win Count</th>
                                </tr>
                                </thead>
                                <tbody>
                                {top3StudiosList.map((s, i) => (
                                    <tr key={i}>
                                        <td>{s.name}</td>
                                        <td>{s.winCount}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Producers with min/max intervals */}
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">
                                Producers with longest and shortest interval between wins
                            </h5>

                            <h6 className="mt-3">Maximum</h6>
                            <table className="table table-bordered table-sm">
                                <thead className="table-light">
                                <tr>
                                    <th>Producer</th>
                                    <th>Interval</th>
                                    <th>Previous Year</th>
                                    <th>Following Year</th>
                                </tr>
                                </thead>
                                <tbody>
                                {maxIntervalList.map((s, i) => (
                                    <tr key={i}>
                                        <td>{s.producer}</td>
                                        <td>{s.interval}</td>
                                        <td>{s.previousWin}</td>
                                        <td>{s.followingWin}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <h6 className="mt-3">Minimum</h6>
                            <table className="table table-bordered table-sm">
                                <thead className="table-light">
                                <tr>
                                    <th>Producer</th>
                                    <th>Interval</th>
                                    <th>Previous Year</th>
                                    <th>Following Year</th>
                                </tr>
                                </thead>
                                <tbody>
                                {minIntervalList.map((s, i) => (
                                    <tr key={i}>
                                        <td>{s.producer}</td>
                                        <td>{s.interval}</td>
                                        <td>{s.previousWin}</td>
                                        <td>{s.followingWin}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Winners by year */}
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">List movie winners by year</h5>
                            <div className="input-group mb-3 mt-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Search by year"
                                    value={searchYear}
                                    onChange={(e) => setSearchYear(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={loadMoviesByYearList}>
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                            <table className="table table-striped table-bordered">
                                <thead className="table-light">
                                <tr>
                                    <th>Id</th>
                                    <th>Year</th>
                                    <th>Title</th>
                                </tr>
                                </thead>
                                <tbody>
                                {moviesByYearList.map((m) => (
                                    <tr key={m.id}>
                                        <td>{m.id}</td>
                                        <td>{m.year}</td>
                                        <td>{m.title}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
