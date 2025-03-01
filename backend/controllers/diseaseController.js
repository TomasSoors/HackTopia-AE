const prisma = require('../prisma/client');

exports.getDiseaseById = async (req, res) => {
    try {
        const { id } = req.params;
        const disease = await prisma.disease.findMany();

        if (!disease) return res.status(404).json({ message: "Ziekte niet gevonden" });

        res.json(disease);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const { id } = req.params;
        const disease = await prisma.disease.findUnique({
            where: { id }
        });

        if (!disease) return res.status(404).json({ message: "Ziekte niet gevonden" });

        res.json(disease);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

