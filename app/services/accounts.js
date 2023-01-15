const AccountModel = require('../models/account');

const getAccountById = (accountId) => {
  return AccountModel.getAccountById(accountId);
};

module.exports = {
  getAccountById,
};
