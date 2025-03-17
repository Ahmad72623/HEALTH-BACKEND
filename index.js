module.exports = async function (context, req) {
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

    context.res = {
        body: { riskScore, riskCategory }
    };
};
