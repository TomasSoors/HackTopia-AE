const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Nieuwe consultatie toevoegen
exports.addConsultation = async (req, res) => {
  try {
    const { patientId, doctorId, diagnosis } = req.body;

    if (!patientId || !doctorId || !diagnosis) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const consultation = await prisma.consultation.create({
      data: {
        patientId,
        doctorId,
        diagnosis,
      },
      include: { doctor: true },
    });

    res.status(201).json(consultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Haal alle consultaties per patiënt op
exports.getConsultationsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const consultations = await prisma.consultation.findMany({
      where: { patientId },
      include: { doctor: true },
      orderBy: { date: "desc" },
    });

    res.json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
