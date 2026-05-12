import { createColumnHelper } from "@tanstack/react-table";


const columnHelper = createColumnHelper();

export const UserColumns = [
    columnHelper.accessor("name", {
        header: "Name",
    }),

    columnHelper.accessor("email", {
        header: "Email",
    }),


];
