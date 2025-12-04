const BMI_MIN = 10;
const BMI_MAX = 40;

const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max)
}

export const caltdee = (weight: number, height: number, age: number, gender: string, activity: number) => {
    const bmi = Math.round(weight / Math.pow(height * 0.01, 2))
    const clampedBMI = clamp(bmi, BMI_MIN, BMI_MAX);
    const percentage = ((clampedBMI - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100;
    let tdee
    if (gender === "Male") {
        tdee = Math.floor((10 * weight) + (6.25 * height) - (5 * age) + 5) * activity;
    } else if (gender === "Female") {
        tdee = Math.floor((10 * weight) + (6.25 * height) - (5 * age) - 161) * activity;
    } else {
        tdee = "Nan"
    }
    return {
        bmi,
        tdee,
        percentage
    }
}

export const getPercentage = (value: number) => {
    return ((value - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100;
};