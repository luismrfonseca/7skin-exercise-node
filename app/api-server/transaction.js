/* eslint-disable promise/no-callback-in-promise */
const R = require('ramda');
const loggerManager = require('../managers/logger.manager');
const router = require('express').Router();
const AccountService = require('../services/accounts');
const TransactionService = require('../services/transactions');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

router.post('/', (req, res, next) => {
  if (R.isEmpty(req.body) || req.body.length <= 0) {
    return res.status(500).json({ status: 500, message: 'Invalid body payload' });
  }

  const newTransaction = req.body;

  return Promise.all([
    AccountService.getAccountById(newTransaction.sourceAccount),
    AccountService.getAccountById(newTransaction.destinationAccount),
  ])
    .then(([ [ sourceAccount ], [ destinationAccount ] ]) => {
      if (!sourceAccount) {
        throw new NotFoundError('Source Account not found', 'TransactionAdd');
      }

      if (!destinationAccount) {
        throw new NotFoundError('Destination Account not found', 'TransactionAdd');
      }

      return TransactionService.addTransaction(sourceAccount, destinationAccount, newTransaction.cashAmount);
    })
    .then(() => res.json({ message: 'Transaction completed' }))
    .catch(error => {
      loggerManager.getLogger().error(`[Transaction][Add] ${error.message || error}`);

      if (error.status === 404) {
        return next(new NotFoundError(error.message, 'TransactionAdd'));
      } else if (error.status === 400) {
        return next(new BadRequestError('Insufficient Amount', 'TransactionAdd'));
      } else {
        return next(new Error(error.message, 'TransactionAdd'));
      }
    });
});

module.exports = router;
