import type { FC } from 'react';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onChange: (page: number) => void;
}

const PaginationControls: FC<PaginationControlsProps> = ({ currentPage, totalPages, onChange }) => {
    const pages = Array.from({ length: totalPages }, (_, index) => index);

    return (
        <nav aria-label="Movies pagination">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        type="button"
                        onClick={() => onChange(currentPage - 1)}
                        aria-label="Previous page"
                    >
                        &laquo;
                    </button>
                </li>
                {pages.map((page) => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                        <button className="page-link" type="button" onClick={() => onChange(page)}>
                            {page + 1}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        type="button"
                        onClick={() => onChange(currentPage + 1)}
                        aria-label="Next page"
                    >
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default PaginationControls;