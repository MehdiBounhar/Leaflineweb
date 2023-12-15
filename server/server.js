const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const parseCSV = require("csv-parser");
const fs = require("fs");
const xlsx = require("xlsx");

const app = express();

const port = 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const storage = multer.memoryStorage();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "maladies",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Create a new maladie
app.post("/maladies", (req, res) => {
  const {
    Plante,
    Organisme,
    Temp_rature_min_C,
    Temp_rature_max_C,
    HR_min,
    H_A1R_max,
    Ensoleillement,
    Humidit_du_sol,
    Type,
  } = req.body;
  const insertQuery = `INSERT INTO maladie (Plante, Organisme, Temp_rature_min_C, Temp_rature_max_C, HR_min, H_A1R_max, Ensoleillement, Humidit_du_sol, Type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(
    insertQuery,
    [
      Plante,
      Organisme,
      Temp_rature_min_C,
      Temp_rature_max_C,
      HR_min,
      H_A1R_max,
      Ensoleillement,
      Humidit_du_sol,
      Type,
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting into maladie:", err);
        res.status(500).send("Error inserting into maladie");
      } else {
        res.status(201).json({ id: results.insertId });
      }
    }
  );
});

// Get all maladies
app.get("/maladies", (req, res) => {
  const selectQuery = "SELECT * FROM maladie";

  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Error selecting from maladie:", err);
      res.status(500).send("Error selecting from maladie");
    } else {
      res.json(results);
    }
  });
});

// Update a maladie
app.put("/maladies/:id", (req, res) => {
  const id = req.params.id;
  const {
    Plante,
    Organisme,
    Temp_rature_min_C,
    Temp_rature_max_C,
    HR_min,
    H_A1R_max,
    Ensoleillement,
    Humidit_du_sol,
    Type,
  } = req.body;
  const updateQuery = `UPDATE maladie SET Plante=?, Organisme=?, Temp_rature_min_C=?, Temp_rature_max_C=?, HR_min=?, H_A1R_max=?, Ensoleillement=?, Humidit_du_sol=?, Type=? WHERE id=?`;

  connection.query(
    updateQuery,
    [
      Plante,
      Organisme,
      Temp_rature_min_C,
      Temp_rature_max_C,
      HR_min,
      H_A1R_max,
      Ensoleillement,
      Humidit_du_sol,
      Type,
      id,
    ],
    (err, results) => {
      if (err) {
        console.error("Error updating maladie:", err);
        res.status(500).send("Error updating maladie");
      } else {
        res.status(200).send("Maladie updated successfully");
      }
    }
  );
});

// Delete a maladie
app.delete("/maladies/:id", (req, res) => {
  const id = req.params.id;
  const deleteQuery = "DELETE FROM maladie WHERE id=?";

  connection.query(deleteQuery, [id], (err, results) => {
    if (err) {
      console.error("Error deleting from maladie:", err);
      res.status(500).send("Error deleting from maladie");
    } else {
      res.status(200).send("Maladie deleted successfully");
    }
  });
});

// Upload a CSV file
app.post("/upload", upload.single("file"), (req, res) => {
  const uploadedFile = req.file;

  try {
    const buffer = req.file.buffer;
    const workbook = xlsx.read(buffer, { type: "buffer" });

    console.log("Sheet Names:", workbook.SheetNames);
    console.log("Workbook:", workbook);
    console.log("Sheet Name:", sheetName);
    console.log("Sheet Content:", workbook.Sheets[sheetName]);

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error("No sheet found in the workbook.");
    }

    const sheetName = workbook.SheetNames[0];
    console.log("Sheet Name:", sheetName);

    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log("Data:", data);

    let insertCounter = 0;

    // Process each row of data (e.g., insert into the database)
    for (const row of data) {
      const {
        Plante,
        Organisme,
        Temp_rature_min_C,
        Temp_rature_max_C,
        HR_min,
        H_A1R_max,
        Ensoleillement,
        Humidit_du_sol,
        Type,
      } = row;

      const insertQuery = `INSERT INTO maladie (Plante, Organisme, Temp_rature_min_C, Temp_rature_max_C, HR_min, H_A1R_max, Ensoleillement, Humidit_du_sol, Type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      connection.query(
        insertQuery,
        [
          Plante,
          Organisme,
          Temp_rature_min_C,
          Temp_rature_max_C,
          HR_min,
          H_A1R_max,
          Ensoleillement,
          Humidit_du_sol,
          Type,
        ],
        (err, results) => {
          if (err) {
            console.error("Error inserting row:", err);
          } else {
            insertCounter++; // Increment the counter for each successful insert operation
          }
        }
      );
    }

    console.log(`Number of inserted rows: ${insertCounter}`); // Log the number of inserted rows
    res.json({ message: "File uploaded and processed successfully" });
  } catch (error) {
    console.error("Error processing file:", error.message);
    res.status(500).json({ error: "Error processing file" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
