async function showGrid() {
  const response = await fetch("../dataset.zip");
  const zipBlob = await response.blob();
  const zipReader = new zip.ZipReader(new zip.BlobReader(zipBlob));
  const entries = await zipReader.getEntries();
  const subjectEntry = entries[2]; // 0 is actual metadata, 1 is metadata.csv, 2 is data_subjects.csv
  const subjectWriter = new zip.TextWriter();
  const subjectCsv = await subjectEntry.getData(subjectWriter);

  const parsed = Papa.parse(subjectCsv, { header: true, delimiter: ";" });
  if (parsed.errors) {
    console.log("parse errors", parsed.errors);
  }
  const rows = parsed.data;
  const keys = Object.keys(rows[0]);
  const fields = keys.map((key) => ({ field: key }));
  //console.log(fields)
  const columnDefs = fields;
  const gridOptions = { columnDefs, rowData: rows };

  const myGridElement = document.querySelector("#myGrid");
  agGrid.createGrid(myGridElement, gridOptions);
}

document.addEventListener("DOMContentLoaded", showGrid, false);
