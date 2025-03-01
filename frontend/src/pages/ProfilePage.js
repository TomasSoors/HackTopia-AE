"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import AppointmentScheduler from "../components/AppointmentScheduler";

const ProfilePage = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = sessionStorage.getItem("userId");
            if (storedUserId) {
                setUserId(storedUserId);
            }
        }
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchPatientData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/person/id/${userId}`);
                if (!response.ok) throw new Error("Failed to fetch patient data");
                const data = await response.json();
                setSelectedPatient(data);

                const consultationResponse = await fetch(`http://localhost:5000/consultations/${data.id}`);
                const consultationData = await consultationResponse.json();
                setConsultations(consultationData || []);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        const fetchAppointments = async () => {
            try {
                const response = await fetch(`http://localhost:5000/appointments/patient/${userId}`);
                if (!response.ok) throw new Error("Failed to fetch appointments");
                const data = await response.json();
                setAppointments(data || []);
            } catch (err) {
                console.error("Error fetching appointments:", err.message);
            }
        };

        fetchAppointments();
    }, [userId]);

    const handleAppointmentBooked = async () => {
        if (!userId) return;
        const response = await fetch(`http://localhost:5000/appointments/patient/${userId}`);
        setAppointments(await response.json());
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown";
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const pastAppointments = appointments.filter(a => new Date(a.dateTime) < new Date());
    const futureAppointments = appointments.filter(a => new Date(a.dateTime) >= new Date());

    return (
        <div className="min-h-screen flex flex-col bg-[#0d1b2a]">
            <Header />
            <div className="flex flex-1 p-6 pt-20">
                <main className="flex-1 grid grid-cols-1 gap-6 px-6">
                    <section className="w-full bg-white shadow-lg rounded-lg p-6">
                        {selectedPatient ? (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    {selectedPatient.firstName} {selectedPatient.lastName}'s Profile
                                </h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-gray-200 p-4 rounded-lg">
                                        <h3 className="font-bold text-[#FF8C00]">Date of Birth</h3>
                                        <p className="text-gray-700">{formatDate(selectedPatient.dateOfBirth)}</p>
                                    </div>
                                    <div className="bg-gray-200 p-4 rounded-lg">
                                        <h3 className="font-bold text-[#FF8C00]">Blood Type</h3>
                                        <p className="text-gray-700">{selectedPatient.bloodType}</p>
                                    </div>
                                    <div className="bg-gray-200 p-4 rounded-lg">
                                        <h3 className="font-bold text-[#FF8C00]">Medical Condition</h3>
                                        <p className="text-gray-700">
                                            {selectedPatient.diseases?.length > 0
                                                ? selectedPatient.diseases.join(", ")
                                                : "None"}
                                        </p>
                                    </div>
                                    <div className="bg-gray-200 p-4 rounded-lg">
                                        <h3 className="font-bold text-[#FF8C00]">avg. Heart Rate</h3>
                                        <p className="text-gray-700">{selectedPatient.heartRate} BPM</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500">Loading patient data...</p>
                        )}
                    </section>

                    <section className="w-full bg-white shadow-lg rounded-lg p-6 text-gray-800">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointments and Consultations</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-100 p-4 rounded-lg shadow-inner max-h-80 overflow-y-auto">
                                <h3 className="text-xl font-bold text-[#FF8C00]">Future appointments</h3>
                                {futureAppointments.length > 0 ? (
                                    futureAppointments.map((a) => (
                                        <div key={a.id} className="p-3 border-b border-gray-300">
                                            <p className="text-lg font-semibold">{a.reason}</p>
                                            <p className="text-sm text-gray-600">{formatDate(a.dateTime)}</p>
                                            <p className="text-sm text-gray-700">Status: {a.status}</p>
                                            <p className="text-sm font-semibold text-gray-800">
                                                Doctor: {a.doctor?.firstName} {a.doctor?.lastName || "Onbekend"}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No scheduled appointments</p>
                                )}
                            </div>


                            <div className="bg-gray-100 p-4 rounded-lg shadow-inner max-h-80 overflow-y-auto">
                                <h3 className="text-xl font-bold text-[#FF8C00]">Schedule a new appointment</h3>
                                <AppointmentScheduler patientId={userId} onAppointmentBooked={handleAppointmentBooked} />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;
