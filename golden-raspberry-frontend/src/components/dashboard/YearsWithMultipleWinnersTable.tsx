import type { FC } from 'react';
import type { YearWithWinners } from '../../types/movies';

interface YearsWithMultipleWinnersTableProps {
    years: YearWithWinners[];
}

const YearsWithMultipleWinnersTable: FC<YearsWithMultipleWinnersTableProps> = ({ years }) => (
    <div className="card shadow-sm h-100">
        <div className="card-body">
            <h5 className="card-title">List years with multiple winners</h5>
            <table className="table table-striped table-bordered mt-3">
                <thead className="table-light">
                <tr>
                    <th scope="col">Year</th>
                    <th scope="col">Win Count</th>
                </tr>
                </thead>
                <tbody>
                {years.map((year) => (
                    <tr key={year.year}>
                        <td>{year.year}</td>
                        <td>{year.winnerCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default YearsWithMultipleWinnersTable;