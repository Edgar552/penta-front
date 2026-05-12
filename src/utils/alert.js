import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const showSuccess = (title, text) =>
    MySwal.fire({
        icon: "success",
        title,
        text,
        confirmButtonColor: "#090909",
    });

export const showSmallSuccess = (title) =>
    Swal.fire({
            position: "top-end",
            icon: "success",
            title: title,
            showConfirmButton: false,
            timer: 3500
    });

export const showError = (title, text) =>
    MySwal.fire({
        icon: "error",
        title,
        text,
        confirmButtonColor: "#d33",
    });

export const showConfirm = (title, text) =>
    MySwal.fire({
        icon: "warning",
        title,
        text,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
    });
