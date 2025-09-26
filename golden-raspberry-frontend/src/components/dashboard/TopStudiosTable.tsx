import type { FC } from 'react';
import type { Studio } from '../../types/movies';

interface TopStudiosTableProps {
    studios: Studio[];
}

const TopStudiosTable: FC<TopStudiosTableProps> = ({ studios }) => (
    <div className="card shadow-sm h-100">
        <div className="card-body">
            <h5 className="card-title">Top 3 studios with winners</h5>
            <table className="table table-striped table-bordered mt-3">
                <thead className="table-light">
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Win Count</th>
                </tr>
                </thead>
                <tbody>
                {studios.map((studio) => (
                    <tr key={studio.name}>
                        <td>{studio.name}</td>
                        <td>{studio.winCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default TopStudiosTable;