module.exports = {
  '**/*.ts': [() => 'tsc -p tsconfig.json --noEmit', 'npm run lint'],
};
