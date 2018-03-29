# 1UP: Auctions Powered by the Blockchain

## Project Description

This Dapp (Distributed Application) was built using Truffle, TestRPC, and MetaMask for web3 injection.

It is hosted on Heroku and is fully functional running contracts on the TestRPC.

Until contracts have been deployed to the Ropsten Testnet this project can be tested by cloning projects and downloading dependencies.

## Testing Locally

Download ```ganache-cli'```

```npm install -g ganache-cli```

Start ganache by running

```ganache-cli -b 5```

<br/>

Install ```truffle```

```npm install -g truffle```

Compile contracts

```truffle compile```

Migrate contracts

```truffle migrate```

<br/>

Install the [MetaMask](https://metamask.io/) Chrome plugin.
Login to MetaMask using mnemonic provided by ganache-cli.
Connect MetaMask to localhost:8545.

<br/>

Open [1UP](https://polar-retreat-48757.herokuapp.com/) and try it out!
