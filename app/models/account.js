const db = require('../managers/db.manager');

const getAccountById = (accountId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT a.id, a.name, a.availableCash
    FROM account a
    WHERE a.id = ? `;

    db.query(sql, [ accountId ], (error, rows, fields) => {
      if (error) { return reject(error); }

      return resolve(rows);
    });
  });
};

const updateAccountById = (conn, accountId, cashAmount) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE account SET availableCash=?
    WHERE id = ? `;

    conn.query(sql, [ cashAmount, accountId ], (error, rows, fields) => {
      if (error) { return reject(error); }

      return resolve(rows);
    });
  });
};

module.exports = {
  getAccountById,
  updateAccountById,
};
