import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../API/api";
import {useAuth} from "../../Providers/AuthContext";
import React, { useState} from "react";

export function TicketDetails() {
    const { id } = useParams();
    const { user, loading } = useAuth();
    const { data, isLoading } = useQuery({
        queryKey: ["ticket", id],
        queryFn: async () => {
            const res = await api.get(`api/tickets/${id}`);
            return res.data;
        },
        enabled: !!user && !loading,
    });

    const [comments, setComment] = useState("");

    const downloadFile = async (file) => {
        try {

            const response = await api.get(
                `/api/tickets/attachments/${file.filename}`,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file.filename);

            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.error("Download failed", error);
        }
    };

    const queryClient = useQueryClient();

    const addCommentMutation = useMutation({
        mutationFn: async () => {
            return api.post(`/api/tickets/${id}/comment`, {
                message: comments,
            });

        },
        onSuccess: () => {
            setComment("");
            queryClient.invalidateQueries(["ticket", id]);
        }
    });

    if (isLoading) return <p>Loading...</p>;

    return (

        <div className="container">
            <div className="row g-4">

                {/* LEFT COLUMN */}
                <div className="col-lg-8">

                    {/* Ticket Header */}
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div>
                                <h4 className="fw-bold">Ticket #{data.ticketNumber}</h4>
                                <small className="text-muted">
                                    Created on {new Date(data.createdAt).toLocaleDateString()}
                                </small>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <small className="text-muted">Requester</small>
                                    <div className="fw-semibold">{data.name}</div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <small className="text-muted">Email</small>
                                    <div className="fw-semibold">{data.email}</div>
                                </div>

                                <div className="col-md-6">
                                    <small className="text-muted">Type</small>
                                    <div className="fw-semibold">{data.typeId.label}</div>
                                </div>

                                <div className="col-md-6">
                                    <small className="text-muted">Extension</small>
                                    <div className="fw-semibold">{data.phoneExtension}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Issue Description */}
                    <div className="card shadow-sm mt-4">
                        <div className="card-body">
                            <h5 className="card-title">Issue Description</h5>
                            <p className="text-muted mb-0">
                                {data.description}
                            </p>
                        </div>
                    </div>

                    {/* Updates and Comments */}
                    <div className="card shadow-sm mt-4">
                        <div className="card-body">
                            <h5 className="card-title">Updates and Comments</h5>
                            {(!data.comments || data.comments.length === 0) && (
                                <p className="text-muted">No updates or comments have been added yet</p>
                            )}
                            {data.comments?.map(comment => (

                                <div key={comment._id} className="border-bottom mb-3 pb-2">

                                    <div className="d-flex justify-content-between">
                                        <strong>{comment.userId?.name || "User"}</strong>

                                        <small className="text-muted">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </small>

                                    </div>

                                    <div className="mt-1">
                                        {comment.message}
                                    </div>
                                </div>

                            ))}
                        </div>
                    </div>

                    {/* Update Form */}
                    <div className="card shadow-sm mt-4">

                        <div className="card-body">

                            <div className="row g-3 align-items-center">

                                <div className="col-12 col-md-9">
                                  <textarea
                                      className="form-control"
                                      id="comments"
                                      name="comments"
                                      value={comments}
                                      onChange={(e) => setComment(e.target.value)}
                                      rows="3"
                                      required
                                      placeholder="Write your update here..."/>
                                </div>
                                    <div className="col-12 col-md-3 d-grid">
                                        <button className="btn btn-primary"
                                                disabled={!comments.trim() || addCommentMutation.isPending}
                                            onClick={() => addCommentMutation.mutate()}>
                                            {addCommentMutation.isPending ? (<> <span/> Updating... </> ) :
                                                ("Update Ticket")}
                                        </button>
                                    </div>
                                </div>
                            </div>

                    </div>
                </div>


                {/* RIGHT COLUMN */}
                <div className="col-lg-4">

                    {/* Details */}
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Details</h5>

                            <ul className="list-unstyled mb-0">

                                <li className="d-flex justify-content-between">
                                    <span className="text-muted">Location</span>
                                    <span className="fw-semibold">{data.locationId.label}</span>
                                </li>

                                <li className="d-flex justify-content-between">
                                    <span className="text-muted">Extension</span>
                                    <span className="fw-semibold">{data.phoneExtension}</span>
                                </li>

                            </ul>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="card shadow-sm mt-4">
                        <div className="card-body">

                            <h5 className="card-title">Attachments</h5>

                            {data.attachments?.length === 0 && (
                                <p className="text-muted">No files uploaded</p>
                            )}

                            <ul className="list-group attachments-list">

                                {data.attachments?.map(file => (
                                    <li
                                        key={file.filename}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <span>{file.filename}</span>

                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => downloadFile(file)}
                                        >
                                            Download
                                        </button>

                                    </li>
                                ))}

                            </ul>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
