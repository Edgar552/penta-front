import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../API/api";
import { MembershipFormComponent } from "./MembershipFormComponent";

export  function MembershipEditPage() {

    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/api/memberships/edit/${id}`);
                setData(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [id]);

    if (!data) return <div className="p-4">Cargando...</div>;

    return (
        <MembershipFormComponent
            mode="edit"
            initialData={data}
        />
    );
}