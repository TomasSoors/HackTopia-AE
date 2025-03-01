const prisma = require('../prisma/client');

// 🔹 Dokter ziet al zijn afspraken
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await prisma.appointment.findMany({
      where: { doctorId },
      include: { patient: true }, // ✅ Haal de patiënt op
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Patiënt ziet zijn toekomstige afspraken
exports.getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await prisma.appointment.findMany({
      where: { patientId },
      include: { doctor: true, patient: true },
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Patiënt boekt een afspraak
exports.bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, dateTime, reason } = req.body;

    if (!patientId || !doctorId || !dateTime || !reason) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const parsedDate = new Date(dateTime);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        dateTime: parsedDate,
        reason,
        status: "pending",
      },
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔹 Dokter bevestigt een afspraak
exports.confirmAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "confirmed" },
    });
    res.json({ message: "Appointment confirmed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Dokter annuleert een afspraak
exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "canceled" },
    });
    res.json({ message: "Appointment canceled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    if (!doctorId || !date) return res.status(400).json({ error: "Dokter en datum zijn verplicht" });

    const dayStart = new Date(date);
    if (isNaN(dayStart.getTime())) return res.status(400).json({ error: "Ongeldige datum" });

    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999); // ✅ Zet het einde van de dag correct

    // 🔹 Genereer tijdsloten van 8:00 tot 17:00 (behalve 12:00)
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      if (hour === 12) continue; // ✅ Middagpauze overslaan
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      slots.push(slotTime);
    }

    // 🔹 Haal bestaande afspraken op
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        dateTime: { gte: dayStart, lt: dayEnd },
      },
    });

    // 🔹 Converteer opgeslagen datums naar timestamps
    const bookedTimes = new Set(existingAppointments.map(a => new Date(a.dateTime).getTime()));

    // 🔹 Zorg dat `slot` een geldig Date-object is voordat `getTime()` wordt gebruikt
    const availableSlots = slots.filter(slot => {
      if (!(slot instanceof Date) || isNaN(slot.getTime())) return false;
      return !bookedTimes.has(slot.getTime());
    });

    res.json(availableSlots.map(slot => slot.toISOString())); // ✅ Stuur ISO strings naar de frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAppointmentsByPatient = async (req, res) => {
  try {
    const { id } = req.params; // Patient ID

    const appointments = await prisma.appointment.findMany({
      where: { patientId: id },
      include: { doctor: true },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 🔹 Haal afspraken op voor een specifieke dokter en patiënt
exports.getDoctorPatientAppointments = async (req, res) => {
  try {
    const { doctorId, patientId } = req.params;

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        patientId,
      },
      include: { patient: true, doctor: true },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
