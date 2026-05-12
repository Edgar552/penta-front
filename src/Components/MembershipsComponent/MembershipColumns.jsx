import {createColumnHelper} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const MembershipColumns = [
    columnHelper.accessor("id_elemento", {
        header: "#",
    }),

    columnHelper.accessor("grado.grado", {
        header: "Grado"
    }),
    columnHelper.accessor("nombre", {
        header: "Nombre",
    }),
    columnHelper.accessor("ape_pat", {
        header: "Apellido Paterno",
    }),
    columnHelper.accessor("ape_mat", {
        header: "Apellido Materno",
    }),

    columnHelper.accessor("subzona.subzona", {
        header: "Sub Zona / Unidad",
    }),

    columnHelper.accessor("matricula", {
        header: "Matricula",
    }),
    columnHelper.accessor("curp", {
        header: "CURP",
    }),
    //
    // columnHelper.accessor("statusId", {
    //     header: "Status",
    //     cell: info => <StatusBadge {...info.getValue()} />,
    //     enableSorting: false,
    // }),
    //
    // columnHelper.accessor("priorityId", {
    //     header: "Priority",
    //     cell: info => <PriorityBadge {...info.getValue()} />,
    //     enableSorting: false,
    // }),
    //
    // columnHelper.accessor("locationId", {
    //     header: "Location",
    //     cell: info => info.getValue()?.label || "",
    //     enableSorting: false,
    // }),
    //
    // columnHelper.accessor("name", {
    //     header: "Requested By",
    // }),
    //
    // columnHelper.accessor("email", {
    //     header: "Email",
    // }),

    // columnHelper.accessor("createdAt", {
    //     header: "Created",
    //     cell: info =>
    //         new Date(info.getValue()).toLocaleDateString(),
    // }),
];
