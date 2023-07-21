const { promises: fs } = require("fs");
const template = require("./template");

const msInOneDay = 1000 * 60 * 60 * 24;
const today = new Date();

function getNewYearSentence() {
  const nextYear = today.getFullYear() + 1;
  const nextYearDate = new Date(String(nextYear));

  const timeUntilNewYear = nextYearDate - today;
  const dayUntilNewYear = Math.round(timeUntilNewYear / msInOneDay);

  return `**${dayUntilNewYear} day before ${nextYear} ⏱**`;
}

const findIdentifierIndex = (rows, identifier) =>
  rows.findIndex((r) => Boolean(r.match(new RegExp(`{${identifier}}`, "i"))));

function generateReadme() {
  const readmeRow = template.split("\n");

  function updateIdentifier(identifier, replaceText) {
    const identifierIndex = findIdentifierIndex(readmeRow, identifier);
    if (!readmeRow[identifierIndex]) return;
    readmeRow[identifierIndex] = readmeRow[identifierIndex].replace(
      `{${identifier}}`,
      replaceText
    );
  }

  const identifierToUpdate = {
    day_before_new_years: getNewYearSentence(),
    today_date: today.toDateString(),
  };

  Object.entries(identifierToUpdate).forEach(([key, value]) => {
    updateIdentifier(key, value);
  });

  return readmeRow.join("\n");
}

function updateReadmeFile(text) {
  fs.writeFile("./README.md", text);
}

function main() {
  const newReadme = generateReadme();
  console.log(newReadme);
  updateReadmeFile(newReadme);
}

main();
