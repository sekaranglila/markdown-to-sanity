#!/usr/bin/env node
import inquirer from "inquirer";
import {PathPrompt} from "inquirer-path";
import inquirerFuzzyPath from "inquirer-fuzzy-path";
import migrateFiles from "../src/migrateFiles.js";
import writeToFile from "../src/writeToFile.js";

inquirer.registerPrompt('fuzzypath', inquirerFuzzyPath)
inquirer.prompt.registerPrompt('path', PathPrompt)

async function run () {
  const answers = await inquirer.prompt([
    /* Pass your questions in here */
    {
      type: 'path',
      name: 'inputPath',
      default: process.cwd(),
      message: 'The absolute path to your folder with markdown files',
      excludePath: nodePath => nodePath.startsWith('node_modules'),
    },
    {
      type: 'string',
      name: 'filename',
      default: 'production',
      message: `Filename for the import file`
    },
    {
      type: 'path',
      name: 'outputPath',
      default: process.cwd(),
      directoryOnly: true,
      message: `Output path for the import file`
    }
  ])
  const { inputPath, filename, outputPath } = answers
  const sanityDocuments = await migrateFiles(inputPath, filename, outputPath)
  writeToFile({ filename, sanityDocuments, outputPath })
}

run()
