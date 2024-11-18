let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';

function appendToDisplay(value) {
  if (isNaN(currentInput) || !isFinite(currentInput)) {
    currentInput = value;
  } else {
    currentInput += value;
  }
  display.value = currentInput;
}

function clearDisplay() {
  currentInput = '';
  previousInput = '';
  operator = '';
  display.value = '';
}

function calculate() {
  let result;
  let num1 = parseFloat(previousInput);
  let num2 = parseFloat(currentInput);
  
  if (operator === '/' && num2 === 0) {
    display.value = "Помилка";
    currentInput = '';
    previousInput = '';
    operator = '';
    return; 
  }
  
  if (operator === '+') {
    result = num1 + num2;
  } else if (operator === '-') {
    result = num1 - num2;
  } else if (operator === '*') {
    result = num1 * num2;
  } else if (operator === '/') {
    result = num1 / num2;
  }
  
  if (!isFinite(result)) {
    display.value = "Помилка";
    currentInput = '';
    previousInput = '';
    operator = '';
    return; 
  }
  
  display.value = result;
  currentInput = result.toString();
  operator = '';
  previousInput = '';
}

document.querySelectorAll('.button').forEach(button => {
  button.addEventListener('click', function() {
    if (button.id === 'clear') {
      clearDisplay();
    } else if (button.id === 'equals') {
      calculate();
    } else if (['add', 'subtract', 'multiply', 'divide'].includes(button.id)) {
      previousInput = currentInput;
      currentInput = '';
      operator = button.id === 'add' ? '+' : button.id === 'subtract' ? '-' : button.id === 'multiply' ? '*' : '/';
    } else {
      appendToDisplay(button.id);
    }
  });
});
