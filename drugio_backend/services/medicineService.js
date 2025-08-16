import db from "../config/db.js";

// Get all medicines with manufacturer and distributor details
export const getAllMedicines = async () => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT 
        m.*, 
        b.brandName, 
        g.genericName,
        man.manufacturer_Name AS manufacturerName,
        man.manufactured_Country,
        dist.distributor_Name AS distributorName,
        dist.contact_Number AS distributorContact,
        dist.address AS distributorAddress
      FROM medicine m
      JOIN brand b ON m.brand_Id = b.brand_Id
      JOIN generic g ON b.generic_Id = g.generic_Id
      LEFT JOIN manufacturer man ON m.manufacturer_Id = man.manufacturer_Id
      LEFT JOIN local_distributor dist ON m.localDistributor_Id = dist.localDistributor_Id
      `,
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
};

// Get a single medicine by ID
export const getMedicineById = async (medicineId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT 
        m.*, 
        b.brandName, 
        g.genericName,
        man.manufacturer_Name AS manufacturerName,
        man.manufactured_Country,
        dist.distributor_Name AS distributorName,
        dist.contact_Number AS distributorContact,
        dist.address AS distributorAddress
      FROM medicine m
      JOIN brand b ON m.brand_Id = b.brand_Id
      JOIN generic g ON b.generic_Id = g.generic_Id
      LEFT JOIN manufacturer man ON m.manufacturer_Id = man.manufacturer_Id
      LEFT JOIN local_distributor dist ON m.localDistributor_Id = dist.localDistributor_Id
      WHERE m.medicine_Id = ?
      `,
      [medicineId],
      (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      }
    );
  });
};

// Add a new medicine
export const addMedicine = async (medicineData) => {
  return new Promise(async (resolve, reject) => {
    const {
      brandName,
      genericName,
      dosageForm,
      packSize,
      strength,
      drugSchedule,
      shelfLife,
      packageType,
      temperature,
      typeOfDrug,
      coat,
      manufacturerName,
      manufactured_Country,
      localDistributorName,
      localDistributorContact,
      localDistributorAddress,
    } = medicineData;

    try {
      // check if generic exists
      let [generic] = await db
        .promise()
        .query(`SELECT generic_Id FROM generic WHERE genericName = ?`, [
          genericName,
        ]);
      let generic_Id;
      if (generic.length > 0) {
        generic_Id = generic[0].generic_Id;
      } else {
        const [genericInsert] = await db
          .promise()
          .query(`INSERT INTO generic (genericName) VALUES (?)`, [genericName]);
        generic_Id = genericInsert.insertId;
      }

      // check if brand exists under that generic
      let [brand] = await db
        .promise()
        .query(
          `SELECT brand_Id FROM brand WHERE brandName = ? AND generic_Id = ?`,
          [brandName, generic_Id]
        );
      let brand_Id;
      if (brand.length > 0) {
        brand_Id = brand[0].brand_Id;
      } else {
        const [brandInsert] = await db
          .promise()
          .query(`INSERT INTO brand (brandName, generic_Id) VALUES (?, ?)`, [
            brandName,
            generic_Id,
          ]);
        brand_Id = brandInsert.insertId;
      }

      // check manufacturer
      let [manu] = await db
        .promise()
        .query(
          `SELECT manufacturer_Id FROM manufacturer WHERE manufacturer_Name = ?`,
          [manufacturerName]
        );
      let manufacturer_Id;
      if (manu.length > 0) {
        manufacturer_Id = manu[0].manufacturer_Id;
      } else {
        const [manuInsert] = await db
          .promise()
          .query(
            `INSERT INTO manufacturer (manufacturer_Name, manufactured_Country) VALUES (?, ?)`,
            [manufacturerName, manufactured_Country]
          );
        manufacturer_Id = manuInsert.insertId;
      }

      // check local distributor
      let [dist] = await db
        .promise()
        .query(
          `SELECT localDistributor_Id FROM local_distributor WHERE distributor_Name = ?`,
          [localDistributorName]
        );
      let localDistributor_Id;
      if (dist.length > 0) {
        localDistributor_Id = dist[0].localDistributor_Id;
      } else {
        const [distInsert] = await db
          .promise()
          .query(
            `INSERT INTO local_distributor (distributor_Name, contact_Number, address) VALUES (?, ?, ?)`,
            [
              localDistributorName,
              localDistributorContact,
              localDistributorAddress,
            ]
          );
        localDistributor_Id = distInsert.insertId;
      }

      // finally insert into medicine
      const [medInsert] = await db.promise().query(
        `INSERT INTO medicine 
        (
          brand_Id, dosageForm, packSize, strength, drugSchedule, shelfLife,
          packageType, temperature, typeOfDrug, coat, manufacturer_Id, localDistributor_Id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          brand_Id,
          dosageForm,
          packSize,
          strength,
          drugSchedule,
          shelfLife,
          packageType,
          temperature,
          typeOfDrug,
          coat,
          manufacturer_Id,
          localDistributor_Id,
        ]
      );

      resolve(medInsert.insertId);
    } catch (error) {
      reject(error);
    }
  });
};

// Update a medicine
export const updateMedicine = async (medicineId, medicineData) => {
  return new Promise(async (resolve, reject) => {
    const {
      brandName,
      genericName,
      dosageForm,
      packSize,
      strength,
      drugSchedule,
      shelfLife,
      packageType,
      temperature,
      typeOfDrug,
      coat,
      manufacturerName,
      manufactured_Country,
      localDistributorName,
      localDistributorContact,
      localDistributorAddress,
    } = medicineData;

    try {
      // check generic
      let [generic] = await db
        .promise()
        .query(`SELECT generic_Id FROM generic WHERE genericName = ?`, [
          genericName,
        ]);
      let generic_Id;
      if (generic.length > 0) {
        generic_Id = generic[0].generic_Id;
      } else {
        const [genericInsert] = await db
          .promise()
          .query(`INSERT INTO generic (genericName) VALUES (?)`, [genericName]);
        generic_Id = genericInsert.insertId;
      }

      // check brand
      let [brand] = await db
        .promise()
        .query(
          `SELECT brand_Id FROM brand WHERE brandName = ? AND generic_Id = ?`,
          [brandName, generic_Id]
        );
      let brand_Id;
      if (brand.length > 0) {
        brand_Id = brand[0].brand_Id;
      } else {
        const [brandInsert] = await db
          .promise()
          .query(`INSERT INTO brand (brandName, generic_Id) VALUES (?, ?)`, [
            brandName,
            generic_Id,
          ]);
        brand_Id = brandInsert.insertId;
      }

      // check manufacturer
      let [manu] = await db
        .promise()
        .query(
          `SELECT manufacturer_Id FROM manufacturer WHERE manufacturer_Name = ?`,
          [manufacturerName]
        );
      let manufacturer_Id;
      if (manu.length > 0) {
        manufacturer_Id = manu[0].manufacturer_Id;
      } else {
        const [manuInsert] = await db
          .promise()
          .query(
            `INSERT INTO Manufacturer (manufacturer_Name, manufactured_Country) VALUES (?, ?)`,
            [manufacturerName, manufactured_Country]
          );
        manufacturer_Id = manuInsert.insertId;
      }

      // check distributor
      let [dist] = await db
        .promise()
        .query(
          `SELECT localDistributor_Id FROM local_distributor WHERE distributor_Name = ?`,
          [localDistributorName]
        );
      let localDistributor_Id;
      if (dist.length > 0) {
        localDistributor_Id = dist[0].localDistributor_Id;
      } else {
        const [distInsert] = await db
          .promise()
          .query(
            `INSERT INTO local_distributor (distributor_Name, contact_Number, address) VALUES (?, ?, ?)`,
            [
              localDistributorName,
              localDistributorContact,
              localDistributorAddress,
            ]
          );
        localDistributor_Id = distInsert.insertId;
      }

      // update medicine
      await db.promise().query(
        `UPDATE medicine SET 
          brand_Id = ?,
          dosageForm = ?,
          packSize = ?,
          strength = ?,
          drugSchedule = ?,
          shelfLife = ?,
          packageType = ?,
          temperature = ?,
          typeOfDrug = ?,
          coat = ?,
          manufacturer_Id = ?,
          localDistributor_Id = ?
        WHERE medicine_Id = ?`,
        [
          brand_Id,
          dosageForm,
          packSize,
          strength,
          drugSchedule,
          shelfLife,
          packageType,
          temperature,
          typeOfDrug,
          coat,
          manufacturer_Id,
          localDistributor_Id,
          medicineId,
        ]
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// Delete a medicine
export const deleteMedicine = async (medicineId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM medicine WHERE medicine_Id = ?`,
      [medicineId],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

export const searchMedicines = async (filterType, searchTerm) => {
  return new Promise((resolve, reject) => {
    let sql = "";
    let params = [];

    if (filterType === "generic") {
      sql = `
        SELECT 
          generic_Id,
          genericName
        FROM generic
        WHERE genericName LIKE ?
      `;
      params.push(`%${searchTerm}%`);
    } else if (filterType === "brand") {
      sql = `
        SELECT 
          m.medicine_Id,
          b.brandName,
          g.genericName
        FROM medicine m
        JOIN brand b ON m.brand_Id = b.brand_Id
        JOIN generic g ON b.generic_Id = g.generic_Id
        WHERE b.brandName LIKE ?
      `;
      params.push(`%${searchTerm}%`);
    } else {
      // for "All" searches, return minimal
      sql = `
        SELECT 
          m.medicine_Id,
          b.brandName,
          g.genericName
        FROM medicine m
        JOIN brand b ON m.brand_Id = b.brand_Id
        JOIN generic g ON b.generic_Id = g.generic_Id
        WHERE b.brandName LIKE ? OR g.genericName LIKE ?
      `;
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

export const getBrandsByGeneric = async (genericName) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT 
        b.brand_Id,
        b.brandName
      FROM brand b
      JOIN generic g ON b.generic_Id = g.generic_Id
      WHERE g.genericName = ?
      `,
      [genericName],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
};

export const getMedicineByBrandId = async (brandId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT 
        m.*, 
        b.brandName, 
        g.genericName,
        man.manufacturer_Name AS manufacturerName,
        man.manufactured_Country,
        dist.distributor_Name AS distributorName,
        dist.contact_Number AS distributorContact,
        dist.address AS distributorAddress
      FROM medicine m
      JOIN brand b ON m.brand_Id = b.brand_Id
      JOIN generic g ON b.generic_Id = g.generic_Id
      LEFT JOIN manufacturer man ON m.manufacturer_Id = man.manufacturer_Id
      LEFT JOIN local_distributor dist ON m.localDistributor_Id = dist.localDistributor_Id
      WHERE m.brand_Id = ?
      `,
      [brandId],
      (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      }
    );
  });
};
