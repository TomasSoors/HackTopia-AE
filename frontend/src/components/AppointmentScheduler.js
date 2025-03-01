"use client";
import { useState, useEffect } from "react";

const AppointmentScheduler = ({ patientId, onAppointmentBooked }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await fetch("http://localhost:5000/person/all");
      const data = await response.json();
      setDoctors(data.filter((d) => d.isMedicalPractitioner));
    };
    fetchDoctors();
  }, []);

  // Fetch available slots
  useEffect(() => {
    if (!selectedDoctor || !date) return;
  
    const fetchAvailableSlots = async () => {
      const response = await fetch(`http://localhost:5000/appointments/generate-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: selectedDoctor, date }),
      });
  
      const data = await response.json();
      setAvailableSlots(data.map(slot => new Date(slot))); // Convert to Date objects
    };
  
    fetchAvailableSlots();
  }, [selectedDoctor, date]);

  // Book an appointment
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot || !reason) {
      alert("Selecteer een dokter, tijdslot en vul een reden in.");
      return;
    }

    const formattedDateTime = new Date(selectedSlot).toISOString();

    const response = await fetch(`http://localhost:5000/appointments/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId,
        doctorId: selectedDoctor,
        dateTime: formattedDateTime,
        reason,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
      return;
    }

    onAppointmentBooked(); // Refresh patient page
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-xl rounded-xl border border-gray-200">
      <h2 className="text-2xl font-semibold mb-5 text-gray-800">Plan een afspraak</h2>

      {/* Select Doctor */}
      <label className="block text-sm font-medium text-gray-700">Kies een dokter</label>
      <select
        onChange={(e) => setSelectedDoctor(e.target.value)}
        className="w-full p-3 mt-1 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        <option value="">Selecteer een dokter</option>
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.firstName} {doctor.lastName}
          </option>
        ))}
      </select>

      {/* Select Date */}
      <label className="block text-sm font-medium text-gray-700 mt-4">Kies een datum</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-3 mt-1 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

      {/* Select Time Slot */}
      <label className="block text-sm font-medium text-gray-700 mt-4">Kies een tijdslot</label>
      <select
        onChange={(e) => setSelectedSlot(e.target.value)}
        className="w-full p-3 mt-1 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        <option value="">Selecteer een tijdslot</option>
        {availableSlots.map((slot) => (
          <option key={slot} value={slot}>
            {new Date(slot).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </option>
        ))}
      </select>

      {/* Reason Input */}
      <label className="block text-sm font-medium text-gray-700 mt-4">Reden voor afspraak</label>
      <textarea
        className="w-full p-3 mt-1 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        placeholder="Vul de reden in..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      {/* Book Appointment Button */}
      <button
        onClick={handleBookAppointment}
        className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
      >
        Boek Afspraak
      </button>
    </div>
  );
};

export default AppointmentScheduler;
