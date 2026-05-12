import {
    flexRender,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {useEffect, useMemo, useState} from "react";
import { MembershipColumns } from "./MembershipColumns";
import api from "../../API/api";
import PaginationFooter from "../LayoutsComponent/PaginationFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCatalogsContext } from "../../Providers/CatalogContext";
import  {useNavigate} from "react-router-dom";
import ActionButtons from "../Commons/ActionButtons";
export default function MembershipsMainTableComponent() {

    const { catalogs } = useCatalogsContext();

    // estado inmediato (input)
    const [filters, setFilters] = useState({
        search: "",
        grado: "",
        matricula: "",
        subzona: ""
    });

    //estado aplicado (query)
    const [queryFilters, setQueryFilters] = useState({
        search: "",
        grado: "",
        matricula: "",
        subzona: ""
    });
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [sorting, setSorting] = useState([]);
    const navigate = useNavigate();
    const sortBy = sorting[0]?.id || "created_at";
    const order = sorting[0]?.desc ? "desc" : "asc";

    //reset page cuando cambian filtros
    useEffect(() => {
        setPage(1);
    }, [queryFilters]);


    const handleSearch = () => {
        setPage(1);
        setQueryFilters(filters);
    };

    const handleClearFilters = () => {
        const emptyFilters = {
            search: "",
            grado: "",
            matricula: "",
            subzona: ""
        };

        setFilters(emptyFilters);
        setQueryFilters(emptyFilters);
        setPage(1);
    };

    // fetch optimizado + cancelación automática
    const fetchMemberships = async ({ signal }) => {

        const params = new URLSearchParams(queryFilters).toString();

        const { data } = await api.get(
            `api/memberships/getMemberships?${params}`,
            {
                params: {
                    page,
                    limit: pageSize,
                    sortBy,
                    order,
                },
                signal //clave para cancelación automática
            }
        );

        return data;
    };

    const { data, isFetching } = useQuery({
        queryKey: ["memberships", page, pageSize, sortBy, order, queryFilters],
        queryFn: fetchMemberships,
        keepPreviousData: true,
        placeholderData: (prev) => prev, // 🔥 clave
        staleTime: 10000,
    });
    const tableData = useMemo(() => data?.data ?? [], [data]);
    const table = useReactTable({
        data: tableData,
        columns: MembershipColumns,
        state: { sorting },
        manualPagination: true,
        manualSorting: true,
        pageCount: data?.totalPages ?? -1,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (isFetching) {
        return <div className="p-4 text-muted">Cargando registros...</div>;
    }

    return (
        <div className="col-lg-12">

            {/* FILTROS PRO */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-semibold text-secondary">
                            Filtros de búsqueda
                        </h6>

                        {isFetching && (
                            <div className="table-overlay">
                                Actualizando...
                            </div>
                        )}
                    </div>

                    <div className="row g-3">

                        <div className="col-md-2">
                            <input
                                className="form-control"
                                placeholder="Buscar por nombre o apellido..."
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters(prev => ({
                                        ...prev,
                                        search: e.target.value
                                    }))
                                }
                            />
                        </div>

                        <div className="col-md-1">
                            <input
                                className="form-control"
                                placeholder="Matrícula"
                                value={filters.matricula}
                                onChange={(e) =>
                                    setFilters(prev => ({
                                        ...prev,
                                        matricula: e.target.value
                                    }))
                                }
                            />
                        </div>

                        <div className="col-md-2">
                            <select
                                className="form-control"
                                value={filters.grado}
                                onChange={(e) =>
                                    setFilters(prev => ({
                                        ...prev,
                                        grado: e.target.value
                                    }))
                                }
                            >
                                <option value="">Todos los grados</option>
                                {catalogs?.grados?.map(g => (
                                    <option key={g.id_grado} value={g.id_grado}>
                                        {g.grado}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <select
                                className="form-control"
                                value={filters.subzona}
                                onChange={(e) =>
                                    setFilters(prev => ({
                                        ...prev,
                                        subzona: e.target.value
                                    }))
                                }
                            >
                                <option value="">Personal General</option>
                                {catalogs?.subzona?.map(g => (
                                    <option key={g.id_subzona} value={g.id_subzona}>
                                        {g.subzona}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <button
                                className="btn btn-primary w-100"
                                onClick={handleSearch}
                            >
                                Buscar
                            </button>
                        </div>

                        <div className="col-md-2">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={handleClearFilters}
                            >
                                Limpiar
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* TABLA */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">

                    {/* DESKTOP TABLE */}
                    <div className="table-responsive d-none d-md-block">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light small">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-2"
                                        >
                                            {header.column.columnDef.header}
                                        </th>
                                    ))}
                                    <th className="text-center">Acciones</th>
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

                                    <td className="text-center">
                                        <ActionButtons  row={row} navigate={navigate}/>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>


                    {/* MOBILE CARDS */}
                    <div className="d-block d-md-none p-3">
                        {table.getRowModel().rows.map((row) => {
                            const t = row.original;

                            return (
                                <div
                                    key={row.id}
                                    className="card mb-3 border-0 shadow-sm"
                                >
                                    <div className="card-body">

                                        {row.getVisibleCells().map(cell => (
                                            <div
                                                key={cell.id}
                                                className="mb-2"
                                            >
                                                <small className="text-muted d-block">
                                                    {cell.column.columnDef.header}
                                                </small>

                                                <strong>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </strong>
                                            </div>
                                        ))}

                                        {/* actions */}
                                        <div className="d-flex gap-2 mt-3 flex-wrap">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() =>
                                                    navigate(
                                                        `/membresias/edit/${t.id_elemento}`
                                                    )
                                                }
                                            >
                                                <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                                            </button>

                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() =>
                                                    window.open(
                                                        `${process.env.REACT_APP_API_BASE_URL}api/memberships/pdf/${t.id_elemento}`,
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                <FontAwesomeIcon icon="fa-solid fa-file-lines" />
                                            </button>

                                            <button
                                                className="btn btn-sm btn-danger"
                                            >
                                                <FontAwesomeIcon icon="fa-solid fa-trash" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>


                    <PaginationFooter
                        page={page}
                        totalPages={data?.totalPages}
                        onPageChange={setPage}
                    />
                </div>
            </div>
        </div>
    );
}