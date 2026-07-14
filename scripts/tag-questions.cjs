const fs = require('fs');
const path = require('path');

const questionDir = path.join(__dirname, '..', 'static', 'questions');

const topicRanges = {
  'application.json': [
    ['web-attacks', [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 35]],
    ['email-mobile', [9, 26]],
    ['database', [13, 24, 25]],
    ['cloud-iot', [27, 28, 34]],
    ['industrial-control-security', [29, 30, 31, 32, 33]],
  ],
  'crypto.json': [
    ['symmetric', [1, 9, 12, 18, 31, 39, 47]],
    ['des', [2, 3, 11]],
    ['asymmetric', [4, 8, 14, 20, 22, 24, 26, 29, 37, 41, 42, 44, 46]],
    ['signature', [5, 21, 23, 25, 35, 38, 45]],
    ['hash', [6, 10, 15, 27, 33, 36]],
    ['national-crypto', [7, 28, 48]],
    ['classical', [16, 17, 43]],
    ['pki', [13, 19, 30, 32, 40]],
    ['engineering-detail', [34]],
  ],
  'network.json': [
    ['vpn-ipsec', [1, 6, 11, 15, 31, 53]],
    ['ids-ips', [2, 3, 23, 33]],
    ['tls-https', [4, 13, 34]],
    ['protocol-security', [5, 8, 9, 16, 17, 32, 36, 42, 52]],
    ['firewall', [7, 12, 30, 39]],
    ['security-assessment', [10, 24]],
    ['active-defense', [14]],
    ['physical-security', [18, 19]],
    ['physical-isolation', [20, 35]],
    ['security-audit', [21, 25, 40]],
    ['security-system-model', [22, 26]],
    ['security-architecture', [27, 28, 29, 37, 38, 41, 43, 44, 50]],
    ['wireless-security', [45, 46, 47, 48, 49, 51]],
  ],
  'others.json': [
    ['models', ['fund-1', 'fund-4']],
    ['concepts', ['fund-2', 'fund-3', 'fund-5', 'fund-6']],
    ['security-assessment', ['fund-7', 'fund-8']],
    ['level-protection', ['mgmt-1', 'mgmt-13', 'mgmt-14', 'mgmt-18', 'mgmt-22', 'mgmt-29', 'mgmt-30']],
    ['bcp-drp', ['mgmt-2', 'mgmt-8', 'mgmt-9', 'mgmt-15', 'mgmt-21', 'mgmt-24', 'mgmt-26', 'mgmt-27', 'mgmt-32']],
    ['risk-assessment', ['mgmt-3', 'mgmt-4', 'mgmt-7', 'mgmt-17', 'mgmt-20', 'mgmt-25', 'mgmt-28']],
    ['security-management', ['mgmt-5', 'mgmt-6', 'mgmt-10', 'mgmt-16', 'mgmt-19', 'mgmt-23', 'mgmt-31']],
    ['laws', ['mgmt-11', 'mgmt-12']],
    ['engineering-detail', ['eng-1', 'eng-2', 'eng-3', 'eng-4', 'eng-5', 'eng-6', 'eng-7', 'eng-8', 'eng-9', 'eng-10', 'eng-11', 'eng-12']],
  ],
  'system.json': [
    ['access-control', [1, 2, 3, 10, 29]],
    ['malware', [4, 13, 14, 23, 24, 25, 28, 31]],
    ['vulnerability-incident', [5, 6, 7, 21, 22, 39]],
    ['os-security', [9, 11, 12, 15, 32, 36]],
    ['vulnerability-management', [16, 33, 35]],
    ['authentication', [8, 17, 18, 19, 20, 26, 27, 30, 34, 37, 38]],
  ],
};

const parameterPatterns = /多少|长度|轮密钥|端口|时间|频率|共有几个|共\d|哪一层|施行时间|严重等级|评估保证级|阶段数/;
const calculationIds = new Set([
  'crypto-22',
  'crypto-26',
  'crypto-41',
  'crypto-42',
  'crypto-43',
  'crypto-44',
  'mgmt-17',
  'mgmt-20',
  'mgmt-25',
  'mgmt-26',
  'mgmt-27',
]);
const parameterIds = new Set([
  'crypto-47',
  'crypto-48',
  'network-51',
  'network-52',
  'network-53',
  'system-38',
  'system-39',
  'app-35',
  'mgmt-30',
  'mgmt-31',
  'mgmt-32',
  'eng-11',
  'eng-12',
]);
const comprehensiveIds = new Set([
  'crypto-45',
  'crypto-46',
  'network-50',
  'system-37',
  'app-34',
  'mgmt-28',
  'mgmt-29',
  'eng-9',
  'eng-10',
]);
const comprehensivePatterns = /同时|组合正确|最佳方案|综合整改方案|正确顺序|对应正确|以下需求|需实现|满足/;
const scenarioPatterns = /^(某|Alice|下列代码|攻击者|用户 A)|场景题|发现|发生|要求|需要|部署|规定|被|使用|通过/;

function typeFor(question) {
  const text = `${question.question} ${question.explanation}`;
  if (calculationIds.has(question.id)) return 'calculation';
  if (parameterIds.has(question.id)) return 'parameter';
  if (comprehensiveIds.has(question.id)) return 'comprehensive';
  if (comprehensivePatterns.test(question.question)) return 'comprehensive';
  if (scenarioPatterns.test(question.question) || /场景题/.test(question.explanation)) return 'scenario';
  if (parameterPatterns.test(question.question)) return 'parameter';
  return 'concept';
}

function idFor(file, value) {
  if (typeof value === 'string') return value;
  const prefixes = {
    'application.json': 'app',
    'crypto.json': 'crypto',
    'network.json': 'network',
    'system.json': 'system',
  };
  return `${prefixes[file]}-${value}`;
}

for (const [file, groups] of Object.entries(topicRanges)) {
  const filePath = path.join(questionDir, file);
  const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const topicById = new Map();

  for (const [topic, values] of groups) {
    for (const value of values) {
      const id = idFor(file, value);
      if (topicById.has(id)) throw new Error(`Duplicate topic mapping for ${id}`);
      topicById.set(id, topic);
    }
  }

  const knownIds = new Set(questions.map((question) => question.id));
  for (const id of topicById.keys()) {
    if (!knownIds.has(id)) throw new Error(`Unknown question id in mapping: ${id}`);
  }

  for (const question of questions) {
    const topic = topicById.get(question.id);
    if (!topic) throw new Error(`Missing topic mapping for ${question.id}`);
    question.topic = topic;
    question.type = typeFor(question);
  }

  fs.writeFileSync(filePath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
}

console.log('Tagged all question files.');
