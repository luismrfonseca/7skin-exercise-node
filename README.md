# 7Skin tech assignment

Design and implement a REST API that able to execute transaction between 2 bank accounts (simple model defined below), to allow money exchange between them.

After the transaction is executed, the transacted amount X should have been subtracted from source account and added to destination account.

Successful execution of request should response with 200 and include the executed transaction model within response body.

Negative cash balance on bank account is not allowed when executing, and the request should be rejected with response of 400 and a reason text at least.

Your application can hardcode/pre-insert multiple bank accounts with predefined available cash, so no need of extra API for account management.

The bank accounts and transactions should be stored, you may choose what storage solution it might be (database/file/etc.)
Note
Explain how you'd improve this system for a production scenario.

Models
Below are simplified models for account and transaction, you may choose to use them or design your own models that suit your needs better.

# Database

Database init is on the file db/init-db.sql. For testing, You will need a mysql server to execute the script and change the file config/config.json and create a .env file and configure the database password - DATABASE_PWD. This script will add two accounts, one account with id 1234567890 and 1000 of available cash and another account with id 0987654321 and 500 of available cash.

# Setup 

After configure the database connection, you need to run ```npm i``` to install all dependences and run ```npm start``` to run the project. This will run on ``` http://localhost:3200/api/transaction ``` and the body can be like this:
```
{
    "cashAmount": 200, 
    "sourceAccount": "1234567890", 
    "destinationAccount": "987654321"
}
```