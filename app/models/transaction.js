/* eslint-disable promise/no-promise-in-callback */
const db = require('../managers/db.manager');
const moment = require('moment');
const AccountModel = require('./account');
const BadRequestError = require('../errors/badRequestError');

const insertTransaction = (conn, sourceAccountId, destinationAccountId, cashAmount) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO transaction (registeredTime, executedTime, success, cashAmount, sourceAccount, destinationAccount)
    VALUES (?, NULL, 0, ?, ?, ?); `;

    conn.query(sql, [ moment().valueOf(), cashAmount, sourceAccountId, destinationAccountId ], (error, rows, fields) => {
      if (error) {
        return reject(error);
      }

      return resolve(rows.insertId);
    });
  });
};

const updateTransaction = (conn, transactionId) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE transaction SET executedTime=?, success=1
    WHERE id=?; `;

    conn.query(sql, [ moment().valueOf(), transactionId ], (error, rows, fields) => {
      if (error) {
        return reject(error);
      }

      return resolve(rows.insertId);
    });
  });
};

const addTransaction = (sourceAccount, destinationAccount, cashAmount) => {
  return new Promise((resolve, reject) => {
    db.getConnection((err, conn) => {
      if (err) { return reject(err); }

      conn.beginTransaction((err) => {
        if (err) { return reject(err); }

        return insertTransaction(conn, sourceAccount.id, destinationAccount.id, cashAmount)
          .then((transactionId) => {
            if (sourceAccount.availableCash - cashAmount < 0) {
              throw new BadRequestError('Access not allowed');
            }

            if (destinationAccount.availableCash - cashAmount < 0) {
              throw new BadRequestError('Access not allowed');
            }

            return Promise.all([
              AccountModel.updateAccountById(conn, sourceAccount.id, sourceAccount.availableCash - cashAmount),
              AccountModel.updateAccountById(conn, destinationAccount.id, destinationAccount.availableCash + cashAmount),
              transactionId,
            ]);
          })
          .then(([ , , transactionId ]) => updateTransaction(conn, transactionId))
          .then(() => conn.commit((err) => {
            if (err) { throw err; }

            resolve();
          }))
          .catch(error => {
            conn.rollback(() => {
              reject(error);
            });
          })
          .finally(() => {
            conn.release();
          });
      });
    });
  });
};

module.exports = {
  addTransaction,
};
