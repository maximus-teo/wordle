/*
use `node filterWords.js` to get 5-letter words
*/
const fs = require('fs');

const words = fs.readFileSync('words_alpha.txt', 'utf-8')
  .split('\n')
  .map(w => w.trim())
  .filter(w => w.length === 5 && /^[a-z]+$/.test(w))
  .map(w => w.toLowerCase());

fs.writeFileSync('../validWords.json', JSON.stringify(words, null, 2));
console.log(`Saved ${words.length} 5-letter words.`);