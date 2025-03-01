const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mockdata voor ziektes
const diseases = [
  { id: "D001", name: "Influenza", symptoms: "Fever,Cough,Fatigue", type: "Viral", infectious: true, isAcute: true, duration: 7, incubationPeriod: 4 },
  { id: "D002", name: "Hypertension", symptoms: "Headache,Dizziness,Blurred Vision", type: "Chronic", infectious: false, isAcute: false, duration: 9999, incubationPeriod: 0 },
  { id: "D003", name: "Diabetes Type 2", symptoms: "Increased Thirst,Frequent Urination,Fatigue", type: "Metabolic", infectious: false, isAcute: false, duration: 9999, incubationPeriod: 0 },
  { id: "D004", name: "Pneumonia", symptoms: "Cough,Shortness of Breath,Chest Pain", type: "Bacterial/Viral", infectious: true, isAcute: true, duration: 21, incubationPeriod: 10 },
  { id: "D005", name: "Asthma", symptoms: "Wheezing,Shortness of Breath,Cough", type: "Respiratory", infectious: false, isAcute: false, duration: 9999, incubationPeriod: 0 },
  { id: "D006", name: "Tuberculosis", symptoms: "Persistent Cough,Fever,Weight Loss", type: "Bacterial", infectious: true, isAcute: false, duration: 365, incubationPeriod: 12 },
  { id: "D007", name: "COVID-19", symptoms: "Fever,Cough,Loss of Taste", type: "Viral", infectious: true, isAcute: true, duration: 28, incubationPeriod: 14 },
  { id: "D008", name: "Migraine", symptoms: "Severe Headache,Nausea,Sensitivity to Light", type: "Neurological", infectious: false, isAcute: true, duration: 2, incubationPeriod: 0 },
  { id: "D009", name: "Anemia", symptoms: "Fatigue,Pale Skin,Shortness of Breath", type: "Blood Disorder", infectious: false, isAcute: false, duration: 9999, incubationPeriod: 0 },
  { id: "D010", name: "Chickenpox", symptoms: "Itchy Rash,Fever,Fatigue", type: "Viral", infectious: true, isAcute: true, duration: 14, incubationPeriod: 21 }
];

// Mockdata voor personen
const persons = [
  { id: "550e8400-e29b-41d4-a716-446655440000", username: "johndoe92", password: "password123", firstName: "John", lastName: "Doe", dateOfBirth: new Date("1992-06-15"), heartRate: 72, bloodPressure: "120/80", breathRate: 16, temperature: 98.6, bloodType: "O+", occupation: "Doctor", weight: 180, height: 5.9, gender: "Male", isMedicalPractitioner: true },
  { id: "a12f8900-c53d-11ec-9d64-0242ac120002", username: "janesmith85", password: "securepass456", firstName: "Jane", lastName: "Smith", dateOfBirth: new Date("1985-09-22"), heartRate: 68, bloodPressure: "115/75", breathRate: 18, temperature: 98.2, bloodType: "A-", occupation: "Engineer", weight: 140, height: 5.6, gender: "Female", isMedicalPractitioner: false },
  { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479", username: "bobby88", password: "myp@ssw0rd!", firstName: "Bobby", lastName: "Fischer", dateOfBirth: new Date("1988-11-10"), heartRate: 75, bloodPressure: "122/82", breathRate: 14, temperature: 98.9, bloodType: "B+", occupation: "Chess Player", weight: 155, height: 5.8, gender: "Male", isMedicalPractitioner: false }
];

// Relaties tussen personen en ziektes
const personDiseases = [
  { personId: "550e8400-e29b-41d4-a716-446655440000", diseaseId: "D001" },
  { personId: "550e8400-e29b-41d4-a716-446655440000", diseaseId: "D005" },
  { personId: "a12f8900-c53d-11ec-9d64-0242ac120002", diseaseId: "D002" }
];

async function main() {
  console.log("🔥 Reset database...");

  // 1️⃣ **Verwijder oude data om conflicten te voorkomen**
  await prisma.personDisease.deleteMany({});
  await prisma.person.deleteMany({});
  await prisma.disease.deleteMany({});

  console.log("✅ Oude data verwijderd.");

  // 2️⃣ **Voeg ziektes toe**
  console.log("🦠 Ziektes toevoegen...");
  for (const disease of diseases) {
    await prisma.disease.create({ data: disease });
  }
  console.log("✅ Ziektes toegevoegd.");

  // 3️⃣ **Voeg personen toe**
  console.log("👤 Personen toevoegen...");
  for (const person of persons) {
    await prisma.person.create({ data: person });
  }
  console.log("✅ Personen toegevoegd.");

  // 4️⃣ **Voeg ziekte-relaties toe (PersonDisease)**
  console.log("🔗 Relaties tussen personen en ziektes toevoegen...");
  for (const entry of personDiseases) {
    // Controleer of de diseaseId bestaat
    const diseaseExists = await prisma.disease.findUnique({ where: { id: entry.diseaseId } });

    if (diseaseExists) {
      await prisma.personDisease.create({ data: entry });
    } else {
      console.warn(`⚠️ Disease met id ${entry.diseaseId} bestaat niet!`);
    }
  }
  console.log("✅ Relaties toegevoegd.");

  console.log("🚀 Seeding voltooid!");
}

main()
  .catch((error) => {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
