const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080; // Ensure the correct port

// Enable CORS
app.use(cors({
    origin: 'https://wonderful-coast-0c3cd9710.6.azurestaticapps.net', // Replace with your frontend URL
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/calculateRisk', (req, res) => {
    const { age, bmi, systolic, diastolic, familyHistory = [] } = req.body;

    let riskScore = 0;

    // Age Risk Calculation
    if (age < 30) riskScore += 0;
    else if (age < 45) riskScore += 10;
    else if (age < 60) riskScore += 20;
    else riskScore += 30;

    // BMI Risk Calculation
    if (bmi < 25) riskScore += 0;
    else if (bmi < 30) riskScore += 30;
    else riskScore += 75;

    // Blood Pressure Risk Calculation
    let bpRisk = 0;
    if (systolic > 180 || diastolic > 120) {
        bpRisk = 100;
    } else if (systolic >= 140 || diastolic >= 90) {
        bpRisk = 75;
    } else if (systolic >= 130 || diastolic >= 80) {
        bpRisk = 30;
    } else if (systolic >= 120 && diastolic < 80) {
        bpRisk = 15;
    } else {
        bpRisk = 0;
    }
    riskScore += bpRisk;

    // Family History Risk Calculation
    let familyRisk = 0;
    if (familyHistory.includes("Diabetes")) familyRisk += 10;
    if (familyHistory.includes("Cancer")) familyRisk += 10;
    if (familyHistory.includes("Alzheimers")) familyRisk += 10;

    riskScore += familyRisk;

    // Determine Risk Category
    let riskCategory = "";
    if (riskScore <= 20) riskCategory = "Low Risk";
    else if (riskScore <= 50) riskCategory = "Moderate Risk";
    else if (riskScore <= 75) riskCategory = "High Risk";
    else riskCategory = "Uninsurable";

    res.json({ riskScore, riskCategory });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
