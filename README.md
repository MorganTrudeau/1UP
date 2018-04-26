# 1UP: Auctions Powered by the Blockchain

## Project Description

This Dapp (Distributed Application) was built using Truffle, TestRPC, and MetaMask for web3 injection.

This serves as cryptocurrency auction platform. Currently this smart contract is running on the Ropsten Test Net and can be used with MetaMask to create auctions, bid on auctions, and track existing auctions. To use the application on the Ropsten Test Net just visit [1UP](https://polar-retreat-48757.herokuapp.com/).

## Testing Locally

This section outline setting up the project for local development.

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

Install the [MetaMask](https://metamask.io/) Chrome plugin.<br/>
Login to MetaMask using mnemonic provided by ganache-cli.<br/>
Connect MetaMask to localhost:8545.<br/>

<br/>

Open [1UP](https://polar-retreat-48757.herokuapp.com/) and try it out!
