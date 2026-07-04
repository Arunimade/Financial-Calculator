const typeEl = document.getElementById('type');
const principalEl = document.getElementById('principal');
const rateEl = document.getElementById('rate');
const yearsEl = document.getElementById('years');
const freqEl = document.getElementById('freq');
const compoundRow = document.getElementById('compoundRow');
const errorBanner = document.getElementById('errorBanner');
const resultBox = document.getElementById('resultBox');
const resultLabel = document.getElementById('resultLabel');
const resultValue = document.getElementById('resultValue');
const resultDetails = document.getElementById('resultDetails');

const currency = (n) =>
  isFinite(n) ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';

typeEl.addEventListener('change', () => {
  compoundRow.classList.toggle('show', typeEl.value === 'compound');
  hideError();
});

[principalEl, rateEl, yearsEl].forEach(el => {
  el.addEventListener('input', () => el.classList.remove('invalid'));
});

function showError(msg) {
  errorBanner.textContent = msg;
  errorBanner.classList.add('show');
  resultBox.classList.remove('show');
}

function hideError() {
  errorBanner.classList.remove('show');
}

function validateInputs(principal, rate, years) {
  let valid = true;
  [ [principalEl, principal], [rateEl, rate], [yearsEl, years] ].forEach(([el, val]) => {
    if (isNaN(val) || val < 0 || el.value.trim() === '') {
      el.classList.add('invalid');
      valid = false;
    } else {
      el.classList.remove('invalid');
    }
  });
  return valid;
}

function setResult(label, value, details) {
  resultLabel.textContent = label;
  resultValue.textContent = value;
  resultDetails.innerHTML = '';
  details.forEach(([k, v]) => {
    const div = document.createElement('div');
    div.innerHTML = `${k}<span>${v}</span>`;
    resultDetails.appendChild(div);
  });
  resultBox.classList.add('show');
}

function calculate() {
  hideError();

  const principal = parseFloat(principalEl.value);
  const annualRatePct = parseFloat(rateEl.value);
  const years = parseFloat(yearsEl.value);
  const type = typeEl.value;

  if (!validateInputs(principal, annualRatePct, years)) {
    showError('Please fill in all fields with valid, non-negative numbers.');
    return;
  }

  if (years === 0 && type !== 'simple') {
    showError('Number of years must be greater than zero for this calculation.');
    return;
  }

  const monthlyRate = annualRatePct / 100 / 12;
  const n = Math.round(years * 12);

  try {
    if (type === 'loan' || type === 'annuity') {
      let payment;
      if (monthlyRate === 0) {
        payment = principal / n;
      } else {
        payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
                  (Math.pow(1 + monthlyRate, n) - 1);
      }
      const totalPaid = payment * n;
      const totalInterest = totalPaid - principal;

      setResult(
        type === 'loan' ? 'Monthly Loan Payment' : 'Monthly Annuity Payment',
        `${currency(payment)}`,
        [
          ['Total Payments', currency(totalPaid)],
          ['Total Interest', currency(totalInterest)],
          ['Number of Payments', n],
          ['Monthly Rate', (monthlyRate * 100).toFixed(3) + '%']
        ]
      );

    } else if (type === 'simple') {
      const interest = principal * (annualRatePct / 100) * years;
      const total = principal + interest;

      setResult(
        'Simple Interest',
        currency(interest),
        [
          ['Principal', currency(principal)],
          ['Total Amount', currency(total)],
          ['Rate', annualRatePct + '% / yr'],
          ['Duration', years + ' yrs']
        ]
      );

    } else if (type === 'compound') {
      const freq = parseFloat(freqEl.value);
      const r = annualRatePct / 100;
      const amount = principal * Math.pow(1 + r / freq, freq * years);
      const interest = amount - principal;

      setResult(
        'Compound Interest',
        currency(interest),
        [
          ['Future Value', currency(amount)],
          ['Principal', currency(principal)],
          ['Compounding', freqEl.options[freqEl.selectedIndex].text],
          ['Duration', years + ' yrs']
        ]
      );

    } else if (type === 'future') {
      // Future value of a lump-sum investment with monthly compounding
      const amount = principal * Math.pow(1 + monthlyRate, n);
      const gain = amount - principal;

      setResult(
        'Future Value',
        currency(amount),
        [
          ['Total Gain', currency(gain)],
          ['Principal', currency(principal)],
          ['Duration', years + ' yrs'],
          ['Monthly Rate', (monthlyRate * 100).toFixed(3) + '%']
        ]
      );
    }
  } catch (e) {
    showError('Something went wrong with that calculation. Please check your inputs.');
  }
}
