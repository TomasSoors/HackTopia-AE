"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";

const doctorId = "550e8400-e29b-41d4-a716-446655440000"; // Simuleer de ingelogde dokter

const PatientPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Controleert of de modal open is

  // **Patiënten ophalen**
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:5000/person/all");
        if (!response.ok) throw new Error("Failed to fetch patients");
        const data = await response.json();
        setPatients(data);
        setSelectedPatient(data[0]); // Standaard eerste patiënt
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // **Consultaties ophalen bij patiënt-selectie**
  useEffect(() => {
    if (!selectedPatient) return;
    const fetchConsultations = async () => {
      const response = await fetch(
        `http://localhost:5000/consultations/${selectedPatient.id}`
      );
      const data = await response.json();
      setConsultations(data);
    };
    fetchConsultations();
  }, [selectedPatient]);

  // **Nieuwe consultatie toevoegen**
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPatient || !diagnosis) return;

    const response = await fetch("http://localhost:5000/consultations/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: selectedPatient.id,
        doctorId,
        diagnosis,
      }),
    });

    if (response.ok) {
      const newConsultation = await response.json();
      setConsultations([newConsultation, ...consultations]);
      setDiagnosis("");
      setShowModal(false); // Sluit de modal na opslaan
    }
  };

  // **Datum correct weergeven**
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="flex flex-1 p-6 pt-20">
        <aside className="w-1/3 bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Patients</h2>
          {loading && <p className="text-gray-500">Loading patients...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <ul className="space-y-2">
            {patients.map((patient) => (
              <li
                key={patient.id}
                className={`cursor-pointer px-4 py-3 rounded-md transition ${selectedPatient?.id === patient.id ? "bg-[#FF8C00] text-gray-800 font-bold" : "bg-gray-200 hover:bg-[#FF8C00] text-gray-800"}`}
                onClick={() => setSelectedPatient(patient)}
              >
                {patient.firstName} {patient.lastName}
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 grid grid-cols-2 gap-6 px-6">
          <section className="col-span-2 bg-white shadow-lg rounded-lg p-6">
            {selectedPatient ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedPatient.firstName} {selectedPatient.lastName}'s Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-200 p-4 rounded-lg">
                    <h3 className="font-bold text-[#FF8C00]">Date of Birth</h3>
                    <p className="text-gray-700">{formatDate(selectedPatient.dateOfBirth)}</p>
                  </div>
                  <div className="bg-gray-200 p-4 rounded-lg">
                    <h3 className="font-bold text-[#FF8C00]">Blood Type</h3>
                    <p className="text-gray-700">{selectedPatient.bloodType}</p>
                  </div>
                  <div className="bg-gray-200 p-4 rounded-lg">
                    <h3 className="font-bold text-[#FF8C00]">Heart Rate</h3>
                    <p className="text-gray-700">{selectedPatient.heartRate} BPM</p>
                  </div>
                  <div className="bg-gray-200 p-4 rounded-lg">
                    <h3 className="font-bold text-[#FF8C00]">Medical Condition</h3>
                    <p className="text-gray-700">
                      {selectedPatient.diseases.length > 0
                        ? selectedPatient.diseases.join(", ")
                        : "None"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No patient selected</p>
            )}
          </section>
          <section className="col-span-2 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Consultation History</h2>
            {consultations.length > 0 ? (
              <div className="space-y-4">
                {consultations.map((c) => (
                  <div key={c.id} className="bg-gray-100 p-4 rounded-lg shadow-sm border-l-4 border-[#FF8C00]">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{c.diagnosis}</h3>
                      <span className="text-sm text-gray-600">{formatDate(c.date)}</span>
                    </div>
                    <p className="text-gray-700">
                      Doctor: <span className="font-bold text-[#FF4B28]">
                        {c.doctor ? `${c.doctor.firstName} ${c.doctor.lastName}` : "Unknown"}
                      </span>
                    </p>
                  </div>
                ))}

              </div>
            ) : (
              <p className="text-gray-500">No consultations available</p>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="cursor-pointer mt-4 px-6 py-3 bg-[#FF8C00] text-white font-bold rounded-lg hover:bg-[#FF4B28] transition"
            >
              Add New Consultation
            </button>
          </section>
        </main>
      </div>
      {/* Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-400/[.8] flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">New Consultation</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                className="text-gray-800 w-full h-20 border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:border-[#FF8C00]"
                placeholder="Enter diagnosis..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              ></textarea>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="cursor-pointer px-6 py-2 bg-gray-400 text-white rounded-lg"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-6 py-2 bg-[#FF8C00] text-white font-bold rounded-lg hover:bg-[#FF4B28] transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPage;
