import db from "../config/db.js";

export const getDashboardData = () => {
  return new Promise((resolve, reject) => {
    const data = {};

    const queries = {
      totalMedicines: "SELECT COUNT(*) AS count FROM medicine",
      totalPharmacies: "SELECT COUNT(*) AS count FROM pharmacy",
      activePharmacists:
        "SELECT COUNT(*) AS count FROM pharmacist WHERE is_active = TRUE",
      prescriptionsToday:
        "SELECT COUNT(*) AS count FROM prescriptions WHERE DATE(uploaded_at) = CURDATE()",
      pendingResponses: `
        SELECT COUNT(*) AS count 
        FROM prescriptions p
        LEFT JOIN prescription_response r ON p.prescription_Id = r.prescription_Id
        WHERE r.response_Id IS NULL
      `,
      recentActivity: `
      (
        SELECT 'Prescription uploaded' AS type, CONCAT('by User ', u.user_Id) AS detail, uploaded_at AS time
        FROM prescriptions p
        JOIN user u ON p.user_Id = u.user_Id
        ORDER BY uploaded_at DESC LIMIT 3
      )
      UNION ALL
      (
        SELECT 'Pharmacist response' AS type, CONCAT('by ', ph.name) AS detail, r.created_at AS time
        FROM prescription_response r
        JOIN pharmacist ph ON r.pharmacist_Id = ph.pharmacist_Id
        ORDER BY r.created_at DESC LIMIT 3
      )
      UNION ALL
      (
        SELECT 'New pharmacy registered' AS type, pharmacyName AS detail, NULL AS time
        FROM pharmacy
        ORDER BY pharmacy_Id DESC LIMIT 3
      )
      LIMIT 6
    `,

      notifications: `
        SELECT 
          (SELECT COUNT(*) FROM prescriptions p
           LEFT JOIN prescription_response r ON p.prescription_Id = r.prescription_Id
           WHERE r.response_Id IS NULL) AS pendingPrescriptions,
          (SELECT COUNT(*) FROM pharmacy WHERE contactNumber IS NULL OR contactNumber = '') AS missingContact
      `,
      monthlyTrend: `
      SELECT DATE_FORMAT(uploaded_at, '%Y-%m') AS month, COUNT(*) AS count
      FROM prescriptions
      WHERE uploaded_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(uploaded_at, '%Y-%m')
      ORDER BY DATE_FORMAT(uploaded_at, '%Y-%m')
    `,
    };

    // Run all queries in parallel
    Promise.all(
      Object.entries(queries).map(([key, sql]) => {
        return new Promise((res, rej) => {
          db.query(sql, (err, results) => {
            if (err) return rej(err);
            res({ key, results });
          });
        });
      })
    )
      .then((resultsArray) => {
        resultsArray.forEach(({ key, results }) => {
          if (key === "recentActivity") {
            data[key] = results.map((row) => ({
              type: row.type,
              detail: row.detail,
              time: row.time,
            }));
          } else if (key === "notifications") {
            data.notifications = [
              `${results[0].pendingPrescriptions} prescriptions still awaiting response.`,
              `${results[0].missingContact} pharmacies have not updated contact info.`,
            ];
          } else if (key === "monthlyTrend") {
            data.monthlyTrend = results.map((row) => ({
              month: row.month,
              count: row.count,
            }));
          } else {
            data[key] = results[0]?.count || 0;
          }
        });
        resolve(data);
      })
      .catch(reject);
  });
};
