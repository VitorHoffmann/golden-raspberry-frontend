import type { FC } from 'react';
import type { Movie } from '../../types/movies';

interface MoviesTableProps {
    movies: Movie[];
}

const MoviesTable: FC<MoviesTableProps> = ({ movies }) => (
    <table className="table table-bordered align-middle text-center">
        <thead className="table-light">
        <tr>
            <th scope="col">ID</th>
            <th scope="col">Year</th>
            <th scope="col">Title</th>
            <th scope="col">Winner?</th>
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
                <td colSpan={4} className="text-center">
                    No results found
                </td>
            </tr>
        )}
        </tbody>
    </table>
);

export default MoviesTable;