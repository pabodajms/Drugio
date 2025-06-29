import db from "../config/db.js";

export const getAllManufacturers = async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM Manufacturer", (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const addManufacturer = async (manufacturerData) => {
  const sql =
    "INSERT INTO Manufacturer (manufacturer_Name, manufactured_Country) VALUES (?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [
        manufacturerData.manufacturer_Name,
        manufacturerData.manufactured_Country,
      ],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

// Update a Manufacturer
export const updateManufacturer = async (id, manufacturerData) => {
  const sql =
    "UPDATE Manufacturer SET manufacturer_Name = ?, manufactured_Country = ? WHERE manufacturer_Id = ?";
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [
        manufacturerData.manufacturer_Name,
        manufacturerData.manufactured_Country,
        id,
      ],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

// Delete a Manufacturer
export const deleteManufacturer = async (id) => {
  const sql = "DELETE FROM Manufacturer WHERE manufacturer_Id = ?";
  return new Promise((resolve, reject) => {
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
