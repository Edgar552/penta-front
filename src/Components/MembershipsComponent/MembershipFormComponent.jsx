import React, { useState,forwardRef  } from 'react';
import { useCatalogsContext } from "../../Providers/CatalogContext";
import api from "../../API/api";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils/alert";
import DatePicker from "react-datepicker";
import { IMaskInput } from "react-imask";
import {
    parse,
    isValid,
    format,
} from "date-fns";

import "react-datepicker/dist/react-datepicker.css";
// ================= COMPONENTES FUERA=================


const FormInput = ({ label, name, type = "text", state, handleChange,required }) => (
    <div className="col-md-4 mb-3">
        <label className="form-label">{label}</label>
        <input
            type={type}
            className="form-control"
            name={name}
            value={state[name] || ""}
            onChange={handleChange}
            required={required}
        />
    </div>
);

const FormSelect = ({ label, name, list, valueKey, labelKey, state, handleChange, required  }) => (
    <div className="col-md-4 mb-3">
        <label className="form-label">{label}</label>
        <select
            className="form-control"
            name={name}
            value={state[name] || ""}
            onChange={handleChange}
            required={required}
        >
            <option value="">Selecciona...</option>
            {list?.map(item => (
                <option key={item[valueKey]} value={item[valueKey]}>
                    {item[labelKey]}
                </option>
            ))}
        </select>
    </div>
);

const parseDate = (date) => {
    if (!date) return null;

    try {
        if (date instanceof Date && !isNaN(date)) {
            return date;
        }

        // formato yyyy-mm-dd
        if (typeof date === "string" && date.includes("-")) {
            const [year, month, day] = date.split("T")[0].split("-");

            return new Date(
                Number(year),
                Number(month) - 1,
                Number(day)
            );
        }

        const parsed = new Date(date);

        if (!isNaN(parsed.getTime())) {
            return parsed;
        }

        return null;

    } catch {
        return null;
    }
};

const CustomDateInput = forwardRef(
    ({ value, onClick, onChange }, ref) => (
        <IMaskInput
            mask="00/00/0000"
            value={value || ""}
            inputRef={ref}
            className="form-control"
            placeholder="dd/mm/yyyy"
            onClick={onClick}
            overwrite
            onAccept={(value) => {
                onChange({
                    target: {
                        value
                    }
                });
            }}
        />
    )
);
const FormDateInput = ({
                           label,
                           name,
                           state,
                           setState,
                           required = false
                       }) => {
    const handleManualDateChange = (e) => {
        // cuando seleccionas desde calendario no existe target
        if (!e?.target?.value) {
            return;
        }

        const value = e.target.value;

        // esperar input completo dd/MM/yyyy
        if (value.length !== 10) {
            return;
        }

        const parsedDate = parse(
            value,
            "dd/MM/yyyy",
            new Date()
        );

        if (isValid(parsedDate)) {
            setState((prev) => ({
                ...prev,
                [name]: parsedDate
            }));
        }
    };

    return (
        <div className="col-md-4 mb-3">
            <label className="form-label">{label}</label>

            <DatePicker
                selected={
                    state[name] instanceof Date &&
                    !isNaN(state[name])
                        ? state[name]
                        : null
                }
                onChange={(date) =>
                    setState((prev) => ({
                        ...prev,
                        [name]: date
                    }))
                }
                onChangeRaw={handleManualDateChange}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                customInput={<CustomDateInput />
                }
                required={required}
                placeholderText="dd/mm/yyyy"
            />
        </div>
    );
};



// ================= COMPONENTE PRINCIPAL =================
function MembershipFormComponent({ mode = "create", initialData = null }) {

    const [state, setState] = useState(() => ({
        id_renovacion: '',
        matricula: '',
        fecha_ingreso: null,
        id_subzona: '',
        id_cuerpo: '',
        id_grado: '',
        id_cargo: '',
        nombre: '',
        ape_pat: '',
        ape_mat: '',
        id_genero: '',
        id_estado_civil: '',
        fecha_nacimiento: null,
        id_lugar_nacimiento: '',
        curp: '',
        id_ocupacion: '',
        id_grado_estudio: '',
        referencias_medicas: '',
        domicilio: '',
        id_municipio: '',
        codigo_postal: '',
        telefono: '',
        fecha_jura_bandera: null,
        fecha_jura_guion: null,
        reclutamiento: '',
        ...(initialData
            ? {
                ...initialData,
                fecha_ingreso: parseDate(initialData.fecha_ingreso),
                fecha_nacimiento: parseDate(initialData.fecha_nacimiento),
                fecha_jura_bandera: parseDate(initialData.fecha_jura_bandera),
                fecha_jura_guion: parseDate(initialData.fecha_jura_guion),
            }
            : {})
    }));

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setState(prev => ({
            ...prev,
            [name]: value
        }));
    };


        const SubmitFunction = async (e) => {
        e.preventDefault();

        const submitButton = document.getElementById("btsubmit");
        submitButton.disabled = true;
        submitButton.innerHTML = "Guardando...";

        const payload = {
                ...state,
            fecha_ingreso:
                state.fecha_ingreso instanceof Date &&
                !isNaN(state.fecha_ingreso)
                    ? format(state.fecha_ingreso, "yyyy-MM-dd")
                    : null,

            fecha_nacimiento:
                state.fecha_nacimiento instanceof Date &&
                !isNaN(state.fecha_nacimiento)
                    ? format(state.fecha_nacimiento, "yyyy-MM-dd")
                    : null,

            fecha_jura_bandera:
                state.fecha_jura_bandera instanceof Date &&
                !isNaN(state.fecha_jura_bandera)
                    ? format(state.fecha_jura_bandera, "yyyy-MM-dd")
                    : null,

            fecha_jura_guion:
                state.fecha_jura_guion instanceof Date &&
                !isNaN(state.fecha_jura_guion)
                    ? format(state.fecha_jura_guion, "yyyy-MM-dd")
                    : null,
            };

        try {
            let response;

            if (mode === "edit") {
                response = await api.put(
                    `api/memberships/${state.id_elemento}`,
                    payload
                );
            } else {
                const formData = new FormData();

                Object.entries(payload).forEach(([key, value]) => {
                    formData.append(key, value);
                });

                response = await api.post(
                    "api/memberships/createMembershipRequest",
                    formData
                );
            }

            showSuccess(
                mode === "edit" ? "Registro actualizado" : "Solicitud creada",
                "Operación exitosa"
            );

            navigate("/membresias");

        } catch (error) {
            const msg = error.response?.data?.error || "Error";

            showError("Error", msg);

            submitButton.disabled = false;
            submitButton.innerHTML = "Guardar";
        }
    };

    const { catalogs, loading } = useCatalogsContext();
    if (loading) return <p>Loading...</p>;

    return (
        <div className="container-fluid mt-4">
            <form onSubmit={SubmitFunction}>

                <div className="row">

                    {/* IZQUIERDA */}
                    <div className="col-lg-6">

                        <div className="form-card-section">
                            <div className="section-header">Información de Solicitud</div>
                            <div className="row">
                                <FormSelect label="Tipo Solicitud" name="id_renovacion"
                                            list={catalogs.renovacion}
                                            valueKey="id_renovacion"
                                            labelKey="renovacion"
                                            state={state} handleChange={handleChange} required={true} />

                                <FormInput label="Matrícula" name="matricula"
                                           state={state} handleChange={handleChange} required={true}/>

                                <FormDateInput
                                    label="Fecha de Ingreso"
                                    name="fecha_ingreso"
                                    state={state}
                                    setState={setState}
                                    required={true}
                                />

                                {/*<FormInput type="date" label="Fecha de Ingreso" name="fecha_ingreso"*/}
                                {/*           state={state} handleChange={handleChange} required={true}/>*/}


                                <FormInput label="Reclutamiento" name="reclutamiento"
                                           state={state} handleChange={handleChange} required={true}/>
                            </div>
                        </div>

                        <div className="form-card-section">
                            <div className="section-header">Datos Institucionales</div>
                            <div className="row">
                                <FormSelect label="Sub Zona" name="id_subzona"
                                            list={catalogs.subzona}
                                            valueKey="id_subzona"
                                            labelKey="subzona"
                                            state={state} handleChange={handleChange} required={true} />

                                <FormSelect label="Cuerpo" name="id_cuerpo"
                                            list={catalogs.cuerpos}
                                            valueKey="id_cuerpo"
                                            labelKey="cuerpo"
                                            state={state} handleChange={handleChange} required={true}/>

                                <FormSelect label="Grado" name="id_grado"
                                            list={catalogs.grados}
                                            valueKey="id_grado"
                                            labelKey="grado"
                                            state={state} handleChange={handleChange} required={true}/>

                                <FormSelect label="Cargo" name="id_cargo"
                                            list={catalogs.cargos}
                                            valueKey="id_cargo"
                                            labelKey="cargo"
                                            state={state} handleChange={handleChange} required={true}/>

                                <FormDateInput
                                    label="Jura Bandera Nacional"
                                    name="fecha_jura_bandera"
                                    state={state}
                                    setState={setState}
                                    required={true}
                                />

                                <FormDateInput
                                    label="Jura Bandera Guion"
                                    name="fecha_jura_guion"
                                    state={state}
                                    setState={setState}
                                    required={true}
                                />
                            </div>
                        </div>

                        <div className="form-card-section">
                            <div className="section-header">Datos Adicionales</div>
                            <div className="row">
                                <FormSelect label="Ocupación" name="id_ocupacion"
                                            list={catalogs.ocupacion}
                                            valueKey="id_ocupacion"
                                            labelKey="ocupacion"
                                            state={state} handleChange={handleChange} required={true}/>

                                <FormSelect label="Grado de Estudios" name="id_grado_estudio"
                                            list={catalogs.estudios}
                                            valueKey="id_grado_estudio"
                                            labelKey="grado_estudio"
                                            state={state} handleChange={handleChange} required={true}/>

                                <FormInput label="Referencias Médicas"
                                           name="referencias_medicas"
                                           state={state} handleChange={handleChange} required={false}/>
                            </div>
                        </div>


                    </div>

                    {/* DERECHA */}
                    <div className="col-lg-6">

                        <div className="form-card-section">
                            <div className="section-header">Información Personal</div>
                            <div className="row">
                                <FormInput label="Nombre" name="nombre"
                                           state={state} handleChange={handleChange} required={true}/>

                                <FormInput label="Apellido Paterno" name="ape_pat"
                                           state={state} handleChange={handleChange} required={true}/>

                                <FormInput label="Apellido Materno" name="ape_mat"
                                           state={state} handleChange={handleChange} required={false}/>

                                <FormSelect label="Género" name="id_genero"
                                            list={catalogs.generos}
                                            valueKey="id_genero"
                                            labelKey="genero"
                                            state={state} handleChange={handleChange} required={true}/>

                                <FormSelect label="Estado Civil" name="id_estado_civil"
                                            list={catalogs.edo_civil}
                                            valueKey="id_estado_civil"
                                            labelKey="estado_civil"
                                            state={state} handleChange={handleChange} required={true}/>

                                <FormDateInput
                                    label="Nacimiento"
                                    name="fecha_nacimiento"
                                    state={state}
                                    setState={setState}
                                    required={true}
                                />

                                <FormSelect label="Lugar Nacimiento" name="id_lugar_nacimiento"
                                            list={catalogs.nacimiento}
                                            valueKey="id_lugar_nacimiento"
                                            labelKey="lugar_nacimiento"
                                            state={state} handleChange={handleChange} required={true}/>

                                <FormInput label="CURP" name="curp"
                                           state={state} handleChange={handleChange} required={true}/>
                            </div>
                        </div>

                        <div className="form-card-section">
                            <div className="section-header">Contacto</div>
                                <div className="row">
                                    <FormInput label="Domicilio (Calle , N&uacute;mero, Colonia)" name="domicilio"
                                               state={state} handleChange={handleChange} required={true}/>

                                    <FormSelect label="Municipio" name="id_municipio"
                                                list={catalogs.municipio}
                                                valueKey="id_municipio"
                                                labelKey="municipio"
                                                state={state} handleChange={handleChange} required={true}/>

                                    <FormInput label="Código Postal" name="codigo_postal"
                                               state={state} handleChange={handleChange} required={false}/>

                                    <FormInput label="Teléfono" name="telefono"
                                               state={state} handleChange={handleChange} required={true}/>

                                </div>
                        </div>

                        <div className="form-card-section">
                            <div className="row justify-content-center">
                                <button type="submit" id="btsubmit" className="btn btn-primary px-4">
                                    {mode === "edit" ? "Actualizar" : "Guardar"}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/*<div className="form-footer-global">*/}
                {/*    <button type="submit" className="btn btn-primary px-4">*/}
                {/*        Guardar*/}
                {/*    </button>*/}
                {/*</div>*/}

            </form>
        </div>
    );
}

export { MembershipFormComponent };