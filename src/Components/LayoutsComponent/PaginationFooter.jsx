export default function PaginationFooter({
                                             page,
                                             totalPages,
                                             onPageChange,
                                         }) {
    return (
        <nav className="border-top">
            <ul className="pagination pagination-sm justify-content-end m-3">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(page - 1)}
                    >
                        Previous
                    </button>
                </li>

                {[...Array(totalPages)].map((_, i) => (
                    <li
                        key={i}
                        className={`page-item ${page === i + 1 ? "active" : ""}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => onPageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
                    </li>
                ))}

                <li
                    className={`page-item ${
                        page === totalPages ? "disabled" : ""
                    }`}
                >
                    <button
                        className="page-link"
                        onClick={() => onPageChange(page + 1)}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
}
