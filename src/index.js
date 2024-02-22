function colDef(fieldName) {
  const def = { field: fieldName };
  if (fieldName == "Id") {
    def.type = "idColumn";
  }
  if (fieldName.includes("(DATE)")) {
    def.type = "dateColumn";
  }
  return def;
}

function row(unsplit) {
  const row = {};
  for (key in unsplit) {
    row[key] = unsplit[key];
    //row[key] = unsplit[key].split(",");
  }
  return row;
}

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
  const rows = parsed.data.map(row);
  const keys = Object.keys(rows[0]);
  const columnDefs = keys.map(colDef);
  console.log(columnDefs);
  const defaultColDef = {
    editable: false,
    sortable: true,
    filter: "agNumberColumnFilter",
  };
  const columnTypes = {
    idColumn: { filter: "agTextColumnFilter" },
    dateColumn: {
      filter: "agDateColumnFilter",
      cellDataType: "dateString",
    },
  };
  const gridOptions = {
    columnDefs,
    rowData: rows,
    defaultColDef,
    columnTypes,
    enableCellTextSelection: true,
  };
  console.log(gridOptions);
  const myGridElement = document.querySelector("#myGrid");
  agGrid.createGrid(myGridElement, gridOptions);
}

document.addEventListener("DOMContentLoaded", showGrid, false);
