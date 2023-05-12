import globMDFiles from "./globMDFiles.js"
import extractMDfromFile from "./extractMDfromFile.js";
import convertMDtoVFile from "./convertMDtoVFile.js";
import convertToSanityDocument from "./convertToSanityDocument.js";

async function migrateFiles (inputPath, filename, outputPath) {
  const files = await globMDFiles(inputPath)
  const mdDocuments = await Promise.all(files.map(extractMDfromFile))
  const VFiles = await Promise.all(mdDocuments.map(convertMDtoVFile))
  const sanityDocuments = await Promise.all(VFiles.map(convertToSanityDocument))
  return sanityDocuments
}

export default migrateFiles;
