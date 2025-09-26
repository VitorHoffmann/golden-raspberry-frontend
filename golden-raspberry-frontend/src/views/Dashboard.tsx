import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ProducerIntervalsTable from '../components/dashboard/ProducerIntervalsTable';
import TopStudiosTable from '../components/dashboard/TopStudiosTable';
import WinnersByYearSection from '../components/dashboard/WinnersByYearSection';
import YearsWithMultipleWinnersTable from '../components/dashboard/YearsWithMultipleWinnersTable';
import {
    getMaxMinWinIntervalForProducers,
    getStudiosWithWinCount,
    getWinnersByYear,
    getYearsWithMultipleWinners,
} from '../services/MoviesService';
import type { Movie, ProducerInterval, Studio, YearWithWinners } from '../types/movies';

const Dashboard = () => {
    const [yearsWithMultipleWinners, setYearsWithMultipleWinners] = useState<YearWithWinners[]>([]);
    const [topStudios, setTopStudios] = useState<Studio[]>([]);
    const [minIntervals, setMinIntervals] = useState<ProducerInterval[]>([]);
    const [maxIntervals, setMaxIntervals] = useState<ProducerInterval[]>([]);
    const [moviesByYear, setMoviesByYear] = useState<Movie[]>([]);
    const [searchYear, setSearchYear] = useState<string>('');
    const [isLoadingDashboard, setIsLoadingDashboard] = useState<boolean>(true);
    const [isSearchingYear, setIsSearchingYear] = useState<boolean>(false);
    const [dashboardError, setDashboardError] = useState<string | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);

    const loadDashboard = useCallback(async () => {
        setIsLoadingDashboard(true);
        setDashboardError(null);

        try {
            const [years, studios, intervals] = await Promise.all([
                getYearsWithMultipleWinners(),
                getStudiosWithWinCount(),
                getMaxMinWinIntervalForProducers(),
            ]);

            setYearsWithMultipleWinners(years);
            setTopStudios(
                [...studios]
                    .sort((a, b) => b.winCount - a.winCount)
                    .slice(0, 3),
            );
            setMinIntervals(intervals.min);
            setMaxIntervals(intervals.max);
        } catch (error) {
            console.error('Error while loading dashboard information', error);
            setYearsWithMultipleWinners([]);
            setTopStudios([]);
            setMinIntervals([]);
            setMaxIntervals([]);
            setDashboardError('Unable to load dashboard information. Please try again later.');
        } finally {
            setIsLoadingDashboard(false);
        }
    }, []);

    useEffect(() => {
        void loadDashboard();
    }, [loadDashboard]);

    const handleYearChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchYear(event.target.value);
    };

    const handleSearchByYear = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedYear = searchYear.trim();

        if (!trimmedYear) {
            setMoviesByYear([]);
            setSearchError(null);
            return;
        }

        setIsSearchingYear(true);
        setSearchError(null);

        try {
            const winners = await getWinnersByYear(trimmedYear);
            setMoviesByYear(winners);
            if (winners.length === 0) {
                setSearchError('No winners found for the provided year.');
            }
        } catch (error) {
            console.error('Error while searching winners by year', error);
            setMoviesByYear([]);
            setSearchError('Unable to load winners for the provided year.');
        } finally {
            setIsSearchingYear(false);
        }
    };

    if (isLoadingDashboard) {
        return <LoadingIndicator label="Loading dashboard information" />;
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">Frontend React Test</h2>
            {dashboardError && (
                <div className="alert alert-danger" role="alert">
                    {dashboardError}
                </div>
            )}

            <div className="row g-4">
                <div className="col-md-6">
                    <YearsWithMultipleWinnersTable years={yearsWithMultipleWinners} />
                </div>

                <div className="col-md-6">
                    <TopStudiosTable studios={topStudios} />
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Producers with longest and shortest interval between wins</h5>
                            <ProducerIntervalsTable title="Maximum" intervals={maxIntervals} />
                            <ProducerIntervalsTable title="Minimum" intervals={minIntervals} />
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <WinnersByYearSection
                        searchYear={searchYear}
                        movies={moviesByYear}
                        onYearChange={handleYearChange}
                        onSearch={handleSearchByYear}
                        isSearching={isSearchingYear}
                        errorMessage={searchError}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;