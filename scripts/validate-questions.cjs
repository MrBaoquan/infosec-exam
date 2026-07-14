const fs = require('fs');
const path = require('path');

const questionDir = path.join(__dirname, '..', 'static', 'questions');
const files = fs.readdirSync(questionDir).filter((file) => file.endsWith('.json'));
const allowedTypes = new Set(['scenario', 'concept', 'parameter', 'comprehensive', 'calculation']);
const ids = new Set();
const questions = [];
const errors = [];

for (const file of files) {
  let items;
  try {
    items = JSON.parse(fs.readFileSync(path.join(questionDir, file), 'utf8'));
  } catch (error) {
    errors.push(`${file}: invalid JSON: ${error.message}`);
    continue;
  }

  if (!Array.isArray(items)) {
    errors.push(`${file}: root must be an array`);
    continue;
  }

  for (const question of items) {
    const label = `${file}:${question.id || '<missing-id>'}`;
    if (!question.id || ids.has(question.id)) errors.push(`${label}: missing or duplicate id`);
    ids.add(question.id);
    if (!question.category) errors.push(`${label}: missing category`);
    if (!question.topic) errors.push(`${label}: missing topic`);
    if (!allowedTypes.has(question.type)) errors.push(`${label}: invalid type ${question.type}`);
    if (!question.question || typeof question.question !== 'string') errors.push(`${label}: missing question text`);
    if (!Array.isArray(question.options) || question.options.length !== 4) errors.push(`${label}: must have exactly four options`);
    if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) errors.push(`${label}: answer must be 0..3`);
    if (!question.explanation || question.explanation.length < 20) errors.push(`${label}: explanation is too short`);
    questions.push(question);
  }
}

const typeCounts = Object.fromEntries([...allowedTypes].map((type) => [type, 0]));
const topicCounts = {};
for (const question of questions) {
  typeCounts[question.type] += 1;
  topicCounts[question.topic] = (topicCounts[question.topic] || 0) + 1;
}

const total = questions.length;
console.log(`Validated ${total} questions across ${files.length} files.`);
console.log('Type distribution:');
for (const [type, count] of Object.entries(typeCounts)) {
  console.log(`  ${type}: ${count} (${((count / total) * 100).toFixed(1)}%)`);
}
console.log('Target topics:');
for (const topic of ['wireless-security', 'industrial-control-security']) {
  console.log(`  ${topic}: ${topicCounts[topic] || 0}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
