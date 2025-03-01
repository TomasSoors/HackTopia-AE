"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import AppointmentScheduler from "../components/AppointmentScheduler";


const doctorId = "550e8400-e29b-41d4-a716-446655440000"; // Simuleer de ingelogde dokter

const PatientPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [consultations, setConsultations] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Controleert of de modal open is
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

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
  useEffect(() => {
    if (!selectedPatient) return;
    const fetchConsultations = async () => {
      const response = await fetch(`http://localhost:5000/appointments/patient/${selectedPatient.id}`);
      setAppointments(await response.json());
    };
    fetchConsultations();
  }, [selectedPatient]);
  useEffect(() => {
    const fetchConditions = async () => {
      const response = await fetch("http://localhost:5000/disease/all");
      const data = await response.json();
      setConditions(data);
    };
    fetchConditions();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      setSelectedConditions(selectedPatient.diseases || []);
    }
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
  const toggleCondition = (condition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };
  const handleSaveConditions = async () => {
    if (!selectedPatient) return;

    const diseaseIds = conditions
      .filter(condition => selectedConditions.includes(condition.name)) // Zoek de id's op basis van de naam
      .map(condition => condition.id);

    await fetch(`http://localhost:5000/person/update-diseases/${selectedPatient.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ diseases: diseaseIds }),
    });


    setSelectedPatient((prev) => ({ ...prev, diseases: selectedConditions }));
    setShowConditionModal(false);
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
  const formatDate2 = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1b2a]">
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
                    <h3 className="font-bold text-[#FF8C00]">avg. Heart Rate</h3>
                    <p className="text-gray-700">{selectedPatient.heartRate} BPM</p>
                  </div>
                  <div className="bg-gray-200 p-4 rounded-lg relative">
                    <button
                      onClick={() => setShowConditionModal(true)}
                      className="cursor-pointer absolute top-2 right-2 bg-[#FF8C00] text-white px-3 py-2 text-sm rounded-lg hover:bg-[#FF4B28] transition"
                    >
                      Edit
                    </button>
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

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointments and Consultations</h2>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-[#FF8C00] text-white font-bold rounded-lg hover:bg-[#FF4B28] transition mb-4"
            >
              Add New Consultation
            </button>
            <div className="grid grid-cols-2 gap-4">
              {/* 🔹 Linkerzijde: Consultatiegeschiedenis */}
              <div className="bg-gray-100 p-4 rounded-lg shadow-inner max-h-60 overflow-y-auto">
                <h3 className="text-xl font-bold text-[#FF8C00]">Previous Consultations</h3>
                {consultations.length > 0 ? (
                  consultations.map((c) => (
                    <div key={c.id} className="p-3 border-b border-gray-300 text-gray-800">
                      <h4 className="text-lg font-semibold">{c.diagnosis}</h4>
                      <p className="text-sm text-gray-600">{formatDate(c.date)}</p>
                      <p className="text-sm text-gray-700">Door: {c.doctor?.firstName} {c.doctor?.lastName || "Onbekend"}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No consultations found</p>
                )}
              </div>

              {/* 🔹 Rechterzijde: Toekomstige afspraken */}
              <div className="bg-gray-100 p-4 rounded-lg shadow-inner max-h-60 overflow-y-auto">
                <h3 className="text-xl font-bold text-[#FF8C00]">Future appointments</h3>
                {appointments.length > 0 ? (
                  appointments.map((a) => (
                    <div key={a.id} className="p-3 border-b border-gray-300 text-gray-800">
                      <p className="text-lg font-semibold">{a.reason}</p>
                      <p className="text-sm text-gray-600">{formatDate2(a.dateTime)}</p>
                      <p className="text-sm text-gray-700">Status: {a.status}</p>
                      <p className="text-sm font-semibold text-gray-800">
                        Patient: {a.patient?.firstName} {a.patient?.lastName || "Onbekend"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No scheduled appointments</p>
                )}
              </div>

            </div>
          </section>

        </main>
      </div>
      {/* Popup Modal */}
      {showConditionModal && (
        <div className="fixed inset-0 bg-gray-400/[.8] flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Medical Conditions</h2>
            <div className="flex flex-col space-y-2">
              {conditions.map((condition, index) => (
                <label key={condition.id || index} className="flex items-center space-x-2 text-gray-800">
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(condition.name)}
                    onChange={() => toggleCondition(condition.name)}
                  />
                  <span>{condition.name}</span>
                </label>
              ))}

            </div>
            <button onClick={handleSaveConditions} className="mt-4 bg-[#FF8C00] text-white px-4 py-2 rounded-lg">Save</button>
          </div>
        </div>
      )}

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
