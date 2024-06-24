const stringSimilarity = require('string-similarity');

const names = [
  'chicken', 'chicken flesh', 'beef', 'pork', 'fish', 'tofu', 'chicken breast'
];

const searchQuery = 'chick';

const findClosestMatches = (query, namesArray, topN = 5) => {
  const matches = stringSimilarity.findBestMatch(query, namesArray);
  return matches.ratings
    .sort((a, b) => b.rating - a.rating)
    .slice(0, topN)
    .map(match => match.target);
}

const closestMatches = findClosestMatches(searchQuery, names);
console.log(closestMatches); 
