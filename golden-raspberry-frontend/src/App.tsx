import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Dashboard from './views/Dashboard.tsx';
import MoviesList from './views/MoviesList.tsx';

const App = () => (
    <Router>
        <div className="d-flex">
            <div className="bg-light border-end" style={{ width: '220px', minHeight: '100vh' }}>
                <div className="p-3">
                    <h5 className="fw-bold">Frontend Test</h5>
                    <ul className="nav flex-column mt-4">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/list">
                                List
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex-grow-1 p-4">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/list" element={<MoviesList />} />
                </Routes>
            </div>
        </div>
    </Router>
);

export default App;