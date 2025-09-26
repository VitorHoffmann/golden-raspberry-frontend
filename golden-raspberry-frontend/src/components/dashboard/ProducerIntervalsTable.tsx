import type { FC } from 'react';
import type { ProducerInterval } from '../../types/movies';

interface ProducerIntervalsTableProps {
    title: string;
    intervals: ProducerInterval[];
}

const ProducerIntervalsTable: FC<ProducerIntervalsTableProps> = ({ title, intervals }) => (
    <div>
        <h6 className="mt-3">{title}</h6>
        <table className="table table-bordered table-sm">
            <thead className="table-light">
            <tr>
                <th scope="col">Producer</th>
                <th scope="col">Interval</th>
                <th scope="col">Previous Year</th>
                <th scope="col">Following Year</th>
            </tr>
            </thead>
            <tbody>
            {intervals.map((interval) => (
                <tr key={`${interval.producer}-${interval.interval}-${interval.previousWin}`}>
                    <td>{interval.producer}</td>
                    <td>{interval.interval}</td>
                    <td>{interval.previousWin}</td>
                    <td>{interval.followingWin}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

export default ProducerIntervalsTable;