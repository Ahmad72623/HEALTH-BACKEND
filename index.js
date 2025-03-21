const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: 'https://wonderful-coast-0c3cd9710.6.azurestaticapps.net', // Replace with your frontend URL
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/calculateRisk', (req, res) => {
    const { age, weight, height, systolic, diastolic, familyHistory = [] } = req.body;

    let riskScore = 0;

    //  Age Risk Calculation
    if (age < 30) riskScore += 0;
    else if (age < 45) riskScore += 10;
    else if (age < 60) riskScore += 20;
    else riskScore += 30;

    //  BMI Calculation
    const bmi = weight / ((height / 100) ** 2);
    if (bmi >= 18.5 && bmi <= 24.9) riskScore += 0;     // Normal
    else if (bmi >= 25.0 && bmi <= 29.9) riskScore += 30; // Overweight
    else riskScore += 75; // Obesity or other BMI issues

    //  Blood Pressure Risk Calculation
    if (systolic > 180 || diastolic > 120) {
        riskScore += 100; // Crisis
    } else if (systolic >= 140 || diastolic >= 90) {
        riskScore += 75; // Stage 2
    } else if (systolic >= 130 || diastolic >= 80) {
        riskScore += 30; // Stage 1
    } else if (systolic >= 120 && diastolic < 80) {
        riskScore += 15; // Elevated
    } else {
        riskScore += 0; // Normal
    }

    //  Family History Risk Calculation
    if (familyHistory.includes("Diabetes")) riskScore += 10;
    if (familyHistory.includes("Cancer")) riskScore += 10;
    if (familyHistory.includes("Alzheimers")) riskScore += 10;

    //  Correct Risk Category Logic
    let riskCategory = "";
    if (riskScore <= 20) riskCategory = "Low Risk";
    else if (riskScore <= 50) riskCategory = "Moderate Risk";
    else if (riskScore <= 75) riskCategory = "High Risk";
    else riskCategory = "Uninsurable";

    console.log({
        age,
        bmi,
        systolic,
        diastolic,
        familyHistory,
        riskScore,
        riskCategory
    });

    res.json({ riskScore, riskCategory });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
