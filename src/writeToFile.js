/* eslint-disable no-console */
import fs from "fs";

function writeToFile ({ filename, sanityDocuments, outputPath }) {
  const path = `${outputPath}/${filename.split('.ndjson')[0]}`

  const preparedDocument = sanityDocuments.reduce(
    (acc, doc) => `${acc  }${JSON.stringify(doc)}\n`
  , '')

  return fs.writeFile(`${path}.ndjson`, preparedDocument, (err, data) => {
    if (err) {
      throw new Error(err)
    }
    console.log(
      `Wrote ${sanityDocuments.length} documents to ${filename}.ndjson`
    )
  })
}

export default writeToFile;
