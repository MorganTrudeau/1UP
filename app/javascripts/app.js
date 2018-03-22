// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import auctionHouse_artifact from '../../build/contracts/AuctionHouse.json';
import auction_artifact from '../../build/contracts/Auction.json';

var AuctionHouse = contract(auctionHouse_artifact);
var Auction = contract(auction_artifact);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    AuctionHouse.setProvider(web3.currentProvider);
    Auction.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      document.getElementById("account").innerHTML = account;
    });
  },

  createAuction: function() {
    var beneficiary = account;
    var biddingTime = parseInt(document.getElementById("biddingTime").value);
    var startPrice = web3.toWei(parseInt(document.getElementById("startPrice").value), "ether");
    var item = parseInt(document.getElementById("item").value);

    AuctionHouse.deployed().then(function(instance) {
      return instance.createAuction(beneficiary,biddingTime,startPrice,item,{from: account});
    }).then(function(auctionId) {
      return App.getAuctionInfo(auctionId);
    }).then(function(result) {
        App.insertTableRow(result,auctionId);
    });
  },

  getAllAuctions: function() {
    AuctionHouse.deployed().then(function(instance) {
      return instance.getAuctionIds.call({from: account});
    }).then(function(auctionIds) {
      auctionIds.forEach(function(auctionId) {
        App.getWithdraw(auctionId);
        App.getAuctionInfo(auctionId).then(function(result) {
          App.insertTableRow(result, auctionId);
        });
      });
    });
  },

  getAuctionIds: function() {
    AuctionHouse.deployed().then(function(instance) {
      return instance.getAuctionIds.call({from: account});
    });
  },

  getAuctionInfo: function(auctionId) {
    var auction = Auction.at(auctionId);
    return auction.getAuctionInfo.call(auctionId, {from: account});
  },

  insertTableRow: function(result,auctionId) {
    var auctionId = auctionId;
    var beneficiary = result[0].valueOf();
    var auctionEnd = result[1].valueOf();
    var item = result[2].valueOf();
    var price = result[3].valueOf();

    var table = document.getElementById("auctionTable");
    var row = table.insertRow(1);
    var cell0 =row.insertCell(0);
    var cell1 =row.insertCell(1);
    var cell2 =row.insertCell(2);
    var cell3 =row.insertCell(3);
    var cell4 =row.insertCell(4);
    var cell5 =row.insertCell(5);
    cell0.innerHTML = item;
    cell1.innerHTML = price;
    cell2.innerHTML = auctionEnd;
    cell3.innerHTML = beneficiary;
    cell4.innerHTML = auctionId;
    cell5.innerHTML = '<input type="text" id="${ bid }" style="width:100px;display:inline-block;margin-right:10px;"></input><button onclick="App.bid()">BID</button>'
  },

  bid: function() {
    var auction = Auction.at("0x6f89c0aee77d112c52862f84d4545b5c658f454a");
    auction.bid({from: account, value: web3.toWei(2, "ether")});
  },

  getWithdraw: function(auctionId) {
    var auction = Auction.at(auctionId);
    return auction.getWithdraw.call(account, {from: account}).then(function(result) {
      console.log(result);
      var table = document.getElementById("withdrawTable");
      var row = table.insertRow(1);
      var cell0 =row.insertCell(0);
      cell0.innerHTML = result.valueOf();
    });
  },

};

window.addEventListener('load', function() {
  // // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using injected web3")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545.");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  App.start();
});
