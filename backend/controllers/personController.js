const prisma = require('../prisma/client');

exports.getPersonById = async (req, res) => {
    try {
        const { id } = req.params;
        const person = await prisma.person.findUnique({
            where: { id },
            include: {
                diseases: {
                    include: {
                        disease: true,
                    },
                },
            },
        });

        if (!person) return res.status(404).json({ message: "Persoon niet gevonden" });
        const formattedPerson = {
            id: person.id,
            username: person.username,
            firstName: person.firstName,
            lastName: person.lastName,
            dateOfBirth: person.dateOfBirth,
            diseases: person.diseases.map(d => d.disease.name),
            heartRate: person.heartRate,
            bloodPressure: person.bloodPressure,
            breathRate: person.breathRate,
            temperature: person.temperature,
            bloodType: person.bloodType,
            occupation: person.occupation,
            weight: person.weight,
            height: person.height,
            gender: person.gender,
            isMedicalPractitioner: person.isMedicalPractitioner,
        };
        res.json(formattedPerson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginPerson = async (req, res) => {
    try {
        const { username, password } = req.body;
        const person = await prisma.person.findFirst({
            where: { username, password }
        });

        if (!person) return res.status(401).json({ message: "Ongeldige inloggegevens" });

        res.json({ message: "Succesvol ingelogd", user: person });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const persons = await prisma.person.findMany({
            include: {
                diseases: {
                    include: {
                        disease: true,
                    },
                },
            },
        });

        const formattedPersons = persons.map(person => ({
            id: person.id,
            username: person.username,
            firstName: person.firstName,
            lastName: person.lastName,
            dateOfBirth: person.dateOfBirth,
            diseases: person.diseases.map(d => d.disease.name),
            heartRate: person.heartRate,
            bloodPressure: person.bloodPressure,
            breathRate: person.breathRate,
            temperature: person.temperature,
            bloodType: person.bloodType,
            occupation: person.occupation,
            weight: person.weight,
            height: person.height,
            gender: person.gender,
            isMedicalPractitioner: person.isMedicalPractitioner,
        }));

        res.json(formattedPersons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getIsDokter = async (req, res) => {
    try {
        const { id } = req.params;
        const person = await prisma.person.findUnique({
            where: { id }
        });

        if (!person) return res.status(404).json({ message: "Persoon niet gevonden" });

        res.json({ isMedicalPractitioner: person.isMedicalPractitioner });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateDiseases = async (req, res) => {
    try {
      const { id } = req.params;
      const { diseases } = req.body;
  
      if (!Array.isArray(diseases)) {
        return res.status(400).json({ error: "Invalid diseases format" });
      }
  
      await prisma.personDisease.deleteMany({
        where: { personId: id },
      });
  
      const newDiseaseEntries = diseases.map(diseaseId => ({
        personId: id,
        diseaseId,
      }));
  
      await prisma.personDisease.createMany({
        data: newDiseaseEntries,
      });
  
      res.json({ message: "Diseases updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
