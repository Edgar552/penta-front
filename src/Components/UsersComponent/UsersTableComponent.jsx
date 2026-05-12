import {
    flexRender,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserColumns } from "./UserColumns";
import api from "../../API/api";
import PaginationFooter from "../LayoutsComponent/PaginationFooter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useAuth} from "../../Providers/AuthContext";

const fetchUsers = async ({ page, pageSize, sortBy, order }) => {
    const { data } = await api.get("auth/getUsers", {
        params: {
            page,
            limit: pageSize,
            sortBy,
            order,
        },
    });

    return data;// { data, page, totalPages, total }
};
export default function UsersTableComponent() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [sorting, setSorting] = useState([]);

    const sortBy = sorting[0]?.id || "createdAt";
    const order = sorting[0]?.desc ? "desc" : "asc";

    const { data, isLoading } = useQuery({
        queryKey: ["users", page, pageSize, sortBy, order],
        queryFn: () =>
            fetchUsers({ page, pageSize, sortBy, order }),
        keepPreviousData: true,
        enabled: !!user && !loading,
    });

    const table = useReactTable({
        data: data?.data ?? [],
        columns: UserColumns,
        state: { sorting },
        manualPagination: true,
        manualSorting: true,
        pageCount: data?.totalPages ?? -1,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (isLoading) {
        return <div className="p-4 text-muted">Loading tickets...</div>;
    }

    return (
        <div className='col-lg-10 d-flex flex-column justify-content-center '>
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-borderless align-middle mb-0">

                            <thead className="table-light small">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-2"
                                            style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : header.column.columnDef.header}
                                            {header.column.getIsSorted() === "asc" && " ▲"}
                                            {header.column.getIsSorted() === "desc" && " ▼"}
                                        </th>

                                    ))}
                                    <th className="px-4 py-2 text-center">
                                        Actions
                                    </th>
                                </tr>

                            ))}
                            </thead>

                            <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-4">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                    {/*ACTION BUTTONS*/}
                                    <td>
                                        <div className="td-actions text-center">

                                            <button key={row.id}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        const t = row.original;
                                                        navigate(`/Users/${t._id}`);
                                                    }} className="btn btn-sm btn-success text-white btn-round mr-2">
                                                <FontAwesomeIcon icon="fa-solid fa-pen-to-square" size="xl" />
                                                Edit
                                            </button>
                                            <button className="btn btn-sm btn-primary text-white btn-round">
                                                <FontAwesomeIcon icon="fa-solid fa-file-lines" size="xl" />
                                                View
                                            </button>
                                            <button className="btn btn-sm btn-danger text-white btn-round ml-2">
                                                <FontAwesomeIcon icon="fa-solid fa-trash" size="xl"/>
                                                Cancel
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            </tbody>
                        </table>
                    </div>
                    <PaginationFooter
                        page={page}
                        totalPages={data.totalPages}
                        onPageChange={setPage}
                    />

                </div>
            </div>
        </div>
    );
}
