function calculate() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100 / 12;
    const years = parseInt(document.getElementById('years').value);
    const type = document.getElementById('type').value;

    let result;
    const n = years * 12; // number of monthly payments

    if (type === 'loan') {
        // Loan Payment Calculation
        result = (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
        result = result.toFixed(2);
    } else if (type === 'interest') {
        // Simple Interest Calculation
        result = principal * rate * n;
        result = result.toFixed(2);
    } else if (type === 'annuity') {
        // Annuity Calculation
        result = principal * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
        result = result.toFixed(2);
    }

    document.getElementById('result').innerText = `Result: ${result}`;
}
