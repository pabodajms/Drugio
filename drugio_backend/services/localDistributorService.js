import db from "../config/db.js";

export const getAllDistributors = async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM Local_Distributor", (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const addDistributor = async (distributorData) => {
  const sql =
    "INSERT INTO Local_Distributor (distributor_Name, contact_Number, address) VALUES (?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [
        distributorData.distributor_Name,
        distributorData.contact_Number,
        distributorData.address,
      ],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

//  Update a Distributor
export const updateDistributor = async (id, distributorData) => {
  const sql =
    "UPDATE Local_Distributor SET distributor_Name = ?, contact_Number = ?, address = ? WHERE localDistributor_Id = ?";
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [
        distributorData.distributor_Name,
        distributorData.contact_Number,
        distributorData.address,
        id,
      ],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

// Delete a Distributor
export const deleteDistributor = async (id) => {
  const sql = "DELETE FROM Local_Distributor WHERE localDistributor_Id = ?";
  return new Promise((resolve, reject) => {
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
