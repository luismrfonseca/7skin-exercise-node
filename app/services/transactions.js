const TransactionModel = require('../models/transaction');

const addTransaction = (sourceAccount, destinationAccount, cashAmount) => {
  return TransactionModel.addTransaction(sourceAccount, destinationAccount, cashAmount);
};

module.exports = {
  addTransaction,
};
