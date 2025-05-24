/*
use `node filterSolutionWords.js` to get solution words
*/
const fs = require('fs');

const words = fs.readFileSync('solutionWords.txt', 'utf-8')
  .split('\n')
  .map(w => w.trim())
  .sort()
  .map(w => w.toLowerCase());

fs.writeFileSync('../solutionWords.json', JSON.stringify(words, null, 2));
console.log(`Processed ${words.length} solution words.`);