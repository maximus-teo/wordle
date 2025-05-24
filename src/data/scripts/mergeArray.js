const fs = require('fs');

const solution = require('../solutionWords.json');
const valid = require('../validWords.json');

const merged = [...new Set([...solution, ...valid])]
    .map(w => w.toLowerCase())
    .sort();

fs.writeFileSync('validWordsUpdated.json', JSON.stringify(merged, null, 2));
console.log(`Combined list saved to validWordsUpdated.json (${merged.length} words)`)