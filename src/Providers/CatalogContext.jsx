import { createContext, useContext, useEffect, useState } from "react";
import api from "../API/api";

const CatalogContext = createContext();

export const CatalogProvider = ({ children }) => {
    const [catalogs, setCatalogs] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const { data } = await api.get("/api/catalogs");
                setCatalogs(data);
            } catch (err) {
                console.error("Error loading catalogs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCatalogs();
    }, []);

    return (
        <CatalogContext.Provider value={{ catalogs, loading }}>
            {children}
        </CatalogContext.Provider>
    );
};

export const useCatalogsContext = () => useContext(CatalogContext);