import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid"; // ✅ Tijdweergave toevoegen
import interactionPlugin from "@fullcalendar/interaction"; // ✅ Klikbare events
import Header from "../components/Header";
import { useEffect, useState } from "react";

const CalendarPage = () => {
  const [appointments, setAppointments] = useState([]);
  const doctorId = "550e8400-e29b-41d4-a716-446655440001"; // ✅ Simulatie ingelogde dokter

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch(`http://localhost:5000/appointments/doctor/${doctorId}`);
      const data = await response.json();
      setAppointments(
        data.map(a => ({
          title: `${a.patient?.firstName || "Onbekend"} - ${a.patient?.firstName || "Onbekend"} - ${a.reason}`,
          start: new Date(a.dateTime), // ✅ Zorg ervoor dat het een Date-object is
          allDay: false,
        }))
      );
    };

    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1b2a]">
      <Header />
      <div className="flex flex-1 p-6">
        <div className="w-full h-full bg-white shadow-lg rounded-lg p-6 text-gray-800">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek" // ✅ Start in weekoverzicht
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay", // ✅ Opties voor maand/week/dag
            }}
            events={appointments}
            slotMinTime="08:00:00" // ✅ Begin tijdschema om 08:00
            slotMaxTime="18:00:00" // ✅ Eind tijdschema om 18:00
            height="auto" // ✅ Zorgt ervoor dat de kalender past
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
