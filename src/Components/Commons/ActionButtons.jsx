import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ActionButtons({ row, navigate }) {
    const t = row.original;

    return (
        <div className="d-flex justify-content-center gap-2 flex-wrap">
            <button
                className="btn btn-sm btn-outline-primary"
                onClick={() =>
                    navigate(`/membresias/edit/${t.id_elemento}`)
                }
            >
                <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
            </button>

            <button
                className="btn btn-sm btn-primary"
                onClick={() =>
                    window.open(
                        `http://localhost:8081/api/memberships/pdf/${t.id_elemento}`,
                        "_blank"
                    )
                }
            >
                <FontAwesomeIcon icon="fa-solid fa-file-lines" />
            </button>

            <button className="btn btn-sm btn-danger">
                <FontAwesomeIcon icon="fa-solid fa-trash" />
            </button>
        </div>
    );
}

export default ActionButtons;