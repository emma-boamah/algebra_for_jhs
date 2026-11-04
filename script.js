const $ = (selector) => document.querySelector(selector);

const equations = [
  { coefficient: 1, constant: 3, total: 8, label: 'x + 3 = 8' },
  { coefficient: 1, constant: 5, total: 12, label: 'x + 5 = 12' },
  { coefficient: 1, constant: -4, total: 6, label: 'x − 4 = 6' },
  { coefficient: 2, constant: 3, total: 13, label: '2x + 3 = 13' }
];
let equationIndex = 0;
let equationStep = 0;
function renderEquation() {
  const item = equations[equationIndex];
  equationStep = 0;
  $('#equation-title').textContent = item.label;
  $('#balance-left').textContent = item.label.split(' = ')[0];
  $('#balance-right').textContent = item.total;
  $('#solution-step').textContent = item.label;
  $('#solution-help').textContent = item.constant < 0 ? `What operation will undo ${item.constant}?` : `What operation will undo +${item.constant}?`;
  $('#balance-feedback').textContent = 'Choose an operation to begin.';
  $('#balance-feedback').className = 'feedback';
  $('.operation[data-op="subtract"]').textContent = `Subtract ${Math.abs(item.constant)} from both sides`;
  $('.operation[data-op="add"]').textContent = `Add ${Math.abs(item.constant)} to both sides`;
  $('.operation').forEach?.(() => {});
  document.querySelectorAll('.operation').forEach((button) => { button.disabled = false; });
}

document.querySelectorAll('.operation').forEach((button) => {
  button.addEventListener('click', () => {
    const item = equations[equationIndex];
    const inverseCorrect = (item.constant > 0 && button.dataset.op === 'subtract') || (item.constant < 0 && button.dataset.op === 'add');
    const feedback = $('#balance-feedback');
    if (!inverseCorrect) {
      feedback.textContent = 'Not quite. Choose the inverse operation to undo the constant, and keep both sides balanced.';
      feedback.className = 'feedback bad';
      return;
    }
    if (equationStep === 0) {
      equationStep = 1;
      const adjustedTotal = item.total - item.constant;
      $('#solution-step').textContent = item.coefficient === 1 ? `x = ${adjustedTotal}` : `${item.coefficient}x = ${adjustedTotal}`;
      $('#solution-help').textContent = item.coefficient === 1 ? 'The variable is isolated. Now check your answer.' : `Divide both sides by ${item.coefficient} to isolate x.`;
      feedback.textContent = item.coefficient === 1 ? 'Correct! You isolated x.' : 'Correct first step! One more step will isolate x.';
      feedback.className = 'feedback good';
      if (item.coefficient === 1) document.querySelectorAll('.operation').forEach((choice) => { choice.disabled = true; });
    } else if (item.coefficient !== 1) {
      const solution = (item.total - item.constant) / item.coefficient;
      $('#solution-step').textContent = `x = ${solution}`;
      $('#solution-help').textContent = `Check: ${item.coefficient} × ${solution} ${item.constant >= 0 ? '+' : '−'} ${Math.abs(item.constant)} = ${item.total}`;
      feedback.textContent = 'Great! You solved the equation.';
      feedback.className = 'feedback good';
      document.querySelectorAll('.operation').forEach((choice) => { choice.disabled = true; });
    }
  });
});
$('#new-equation').addEventListener('click', () => { equationIndex = (equationIndex + 1) % equations.length; renderEquation(); });
renderEquation();

const expressionDefinitions = {
  '3x+2': { display: '3x + 2', calculate: (x) => 3 * x + 2, substitute: (x) => `3 × (${x}) + 2` },
  '2x-5': { display: '2x − 5', calculate: (x) => 2 * x - 5, substitute: (x) => `2 × (${x}) − 5` },
  'x²+1': { display: 'x² + 1', calculate: (x) => x * x + 1, substitute: (x) => `(${x})² + 1` },
  '4(x+2)': { display: '4(x + 2)', calculate: (x) => 4 * (x + 2), substitute: (x) => `4 × ((${x}) + 2)` }
};
function updateExpression() {
  const x = Number($('#x-value').value);
  const definition = expressionDefinitions[$('#expression-choice').value];
  $('#x-output').textContent = x;
  $('#expression').textContent = definition.display;
  $('#substitution-steps').textContent = definition.substitute(x);
  $('#expression-result').textContent = definition.calculate(x);
}
$('#expression-choice').addEventListener('change', updateExpression);
$('#x-value').addEventListener('input', updateExpression);
updateExpression();

const patterns = [
  { prompt: 'Add 4 each time. What are the next two numbers?', sequence: [3, 7, 11, 15], answers: [19, 23], rule: 'Add 4 each time.' },
  { prompt: 'Multiply by 2 each time. What are the next two numbers?', sequence: [2, 4, 8, 16], answers: [32, 64], rule: 'Multiply each number by 2.' },
  { prompt: 'Subtract 3 each time. What are the next two numbers?', sequence: [20, 17, 14, 11], answers: [8, 5], rule: 'Subtract 3 each time.' }
];
let patternIndex = 0;
let patternSolved = false;
function renderPattern() {
  const item = patterns[patternIndex];
  $('#pattern-count').textContent = `PATTERN ${patternIndex + 1} OF ${patterns.length}`;
  $('#pattern-prompt').textContent = item.prompt;
  $('#sequence').replaceChildren(...item.sequence.map((number) => { const chip = document.createElement('span'); chip.textContent = number; return chip; }));
  $('#next-one').value = ''; $('#next-two').value = '';
  $('#pattern-feedback').textContent = ''; $('#pattern-feedback').className = 'feedback';
  $('#pattern-form').hidden = patternSolved;
  $('#next-pattern').textContent = patternIndex === patterns.length - 1 ? 'Start patterns again →' : 'Try another pattern →';
}
$('#pattern-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const item = patterns[patternIndex];
  const correct = Number($('#next-one').value) === item.answers[0] && Number($('#next-two').value) === item.answers[1];
  const feedback = $('#pattern-feedback');
  feedback.textContent = correct ? `Correct! ${item.rule}` : 'Not quite. Check the change between each pair of numbers and try again.';
  feedback.className = `feedback ${correct ? 'good' : 'bad'}`;
  if (correct) {
    patternSolved = true;
    $('#sequence').append(...item.answers.map((number) => { const chip = document.createElement('span'); chip.textContent = number; chip.className = 'revealed'; return chip; }));
    $('#pattern-form').hidden = true;
  }
});
$('#next-pattern').addEventListener('click', () => { patternIndex = (patternIndex + 1) % patterns.length; patternSolved = false; renderPattern(); });
renderPattern();

const questions = [
  { text: 'Solve: x + 5 = 12', options: ['5', '7', '17', '6'], answer: 1, explanation: 'Subtract 5 from both sides: x = 12 − 5 = 7.' },
  { text: 'If x = 3, what is 2x + 4?', options: ['10', '14', '9', '24'], answer: 0, explanation: 'Substitute x = 3: 2 × 3 + 4 = 10.' },
  { text: 'Simplify: 3a + 2a', options: ['5', '5a', '6a', 'a'], answer: 1, explanation: 'These are like terms. Add the coefficients: 3a + 2a = 5a.' },
  { text: 'What comes next: 5, 9, 13, 17, …?', options: ['20', '21', '22', '25'], answer: 1, explanation: 'The pattern adds 4 each time, so 17 + 4 = 21.' }
];
let questionIndex = 0; let selectedAnswer = null; let score = 0; let answered = false;
const answers = $('#answers'); const action = $('#quiz-action');
function renderQuestion() {
  const item = questions[questionIndex];
  $('#quiz-count').textContent = `QUESTION ${questionIndex + 1} OF ${questions.length}`;
  $('#progress-fill').style.width = `${(questionIndex + 1) / questions.length * 100}%`;
  $('#question').textContent = item.text;
  $('#quiz-feedback').textContent = ''; $('#quiz-feedback').className = 'feedback';
  $('#score').textContent = `Score: ${score}`;
  answers.replaceChildren(); selectedAnswer = null; answered = false;
  item.options.forEach((text, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'answer'; button.textContent = text;
    button.addEventListener('click', () => {
      if (answered) return;
      selectedAnswer = index;
      answers.querySelectorAll('button').forEach((choice) => choice.classList.toggle('selected', choice === button));
      action.disabled = false; action.textContent = 'Check answer';
    });
    answers.append(button);
  });
  action.disabled = true; action.textContent = 'Check answer'; action.dataset.retry = 'false';
}
action.addEventListener('click', () => {
  if (action.dataset.retry === 'true') { questionIndex = 0; score = 0; renderQuestion(); return; }
  if (!answered) {
    if (selectedAnswer === null) return;
    answered = true; const item = questions[questionIndex]; const correct = selectedAnswer === item.answer;
    if (correct) score++;
    answers.querySelectorAll('button').forEach((button, index) => { button.disabled = true; if (index === item.answer) button.classList.add('correct'); else if (index === selectedAnswer) button.classList.add('incorrect'); });
    $('#quiz-feedback').textContent = `${correct ? 'Correct!' : 'Not quite.'} ${item.explanation}`;
    $('#quiz-feedback').classList.add(correct ? 'good' : 'bad'); $('#score').textContent = `Score: ${score}`;
    action.textContent = questionIndex === questions.length - 1 ? 'See results' : 'Next question';
  } else if (questionIndex < questions.length - 1) { questionIndex++; renderQuestion(); }
  else {
    $('#quiz-count').textContent = 'QUIZ COMPLETE'; $('#progress-fill').style.width = '100%';
    $('#question').textContent = score === questions.length ? 'Excellent work—you’re an algebra star!' : score >= 3 ? 'Great job—you’re building strong algebra skills!' : 'Good try! Explore the activities and have another go.';
    answers.replaceChildren(); $('#quiz-feedback').textContent = `You scored ${score} out of ${questions.length}.`; $('#quiz-feedback').className = 'feedback good';
    action.textContent = 'Try again'; action.disabled = false; action.dataset.retry = 'true';
  }
});
renderQuestion();
