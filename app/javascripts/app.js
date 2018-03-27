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
      document.getElementById("account").innerHTML = account.substring(0,6);
      web3.fromWei(web3.eth.getBalance(account, function(error, result) {
        if (error != null) {
          console.log(error);
        } else {
          document.getElementById("balance").innerHTML = web3.fromWei(result.valueOf(), "ether") + " ETH";
        }
      }));
      App.getAllAuctions();
    });
  },

  createAuction: function() {
    var beneficiary = account;
    var biddingTime = parseInt(document.getElementById("biddingTime").value);
    // var startPrice = web3.toWei(parseInt(document.getElementById("startPrice").value), "ether");
    var startPrice = parseInt(document.getElementById("startPrice").value);
    var item = parseInt(document.getElementById("item").value);

    AuctionHouse.deployed().then(function(instance) {
      return instance.createAuction(beneficiary,biddingTime,startPrice,item,{from: account});
    }).then(function(result) {
      App.watchBlocks(result.tx);
    });
  },

  getAllAuctions: function() {
    AuctionHouse.deployed().then(function(instance) {
      return instance.getAuctionIds.call({from: account});
    }).then(function(auctionIds) {
      auctionIds.forEach(function(auctionId) {
        App.getWithdraw(auctionId);
        App.getAuctionInfo(auctionId).then(function(result) {
          App.constructAuctionTable(result, auctionId);
          App.constructMyAuctionsTable(result, auctionId);
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

  constructAuctionTable: function(result,auctionId) {
    var auctionId = auctionId;
    var beneficiary = result[0].valueOf();
    var auctionEnd = result[2].valueOf();
    var item = result[3].valueOf();
    var price = result[1].valueOf() + " ETH";

    var auction = Auction.at(auctionId);
    auction.highestBidder.call({ from: account }).then(function(highestBidder) {
      var tableRef = document.getElementById('auctionTable').getElementsByTagName('tbody')[0];
      var row   = tableRef.insertRow(0);
      var cell0 = row.insertCell(0);
      var cell1 = row.insertCell(1);
      var cell2 = row.insertCell(2);
      var cell3 = row.insertCell(3);
      var cell4 = row.insertCell(4);
      var cell5 = row.insertCell(5);
      var cell6 = row.insertCell(6);
      cell0.innerHTML = auctionId.substring(0,6);
      cell1.innerHTML = item;
      cell2.innerHTML = price;
      cell3.innerHTML = App.convertTimeStamp(auctionEnd);
      var button = App.constructButton(auctionId,"bid");
      var input = App.constructInput("text",auctionId);
      cell4.appendChild(input);
      cell4.appendChild(button);
      cell5.innerHTML = highestBidder.valueOf().substring(0,6);
      cell6.innerHTML = beneficiary.substring(0,6);
    })
  },

  constructMyAuctionsTable: function(result, auctionId) {
    var beneficiary = result[0].valueOf();
    if(beneficiary == account) {
      var auctionId = auctionId;
      var auctionEnd = result[2].valueOf();
      var item = result[3].valueOf();
      var price = result[1].valueOf() + " ETH";

      var tableRef = document.getElementById('myAuctionsTable').getElementsByTagName('tbody')[0];
      var row   = tableRef.insertRow(0);
      var cell0 = row.insertCell(0);
      cell0.innerHTML = item;
      var cell1 = row.insertCell(1);
      cell1.innerHTML = price;
      var cell2 = row.insertCell(2);
      cell2.innerHTML = App.convertTimeStamp(auctionEnd);
      var cell3 = row.insertCell(3);
      var button = App.constructButton(auctionId,"collect");
      cell3.appendChild(button);
    }
  },

  bid: function(auctionId) {
    var value = document.getElementById(auctionId).value;
    var auction = Auction.at(auctionId);
    auction.bid({from: account, value: value});
  },

  getWithdraw: function(auctionId) {
    var auction = Auction.at(auctionId);
    auction.getWithdraw.call(account, {from: account}).then(function(result) {
      var withdrawTableRef = document.getElementById('withdrawTable').getElementsByTagName('tbody')[0];
      var row = withdrawTableRef.insertRow(0);
      var cell0 = row.insertCell(0);
      var cell1 = row.insertCell(1);
      var cell2 = row.insertCell(2);
      cell0.innerHTML = auctionId.substring(0,6);
      cell1.innerHTML = result.valueOf();
      var button = App.constructButton(auctionId,"withdraw");
      cell2.appendChild(button);
    });
  },

  withdraw: function(auctionId) {
    var auction = Auction.at(auctionId);
    auction.withdraw({from: account, gas:3000000});
  },

  auctionEnd: function(auctionId) {
    var auction = Auction.at(auctionId);
    auction.auctionEnd({from: account, gas:3000000});
  },

  constructButton: function(auctionId, type) {
    var button = document.createElement("button");
    switch(type) {
        case "withdraw":
            var buttonText = document.createTextNode("WITHDRAW");
            button.onclick = function() {
              App.withdraw(auctionId)
            };
            button.appendChild(buttonText);
            return button;
        case "bid":
            var buttonText = document.createTextNode("BID");
            button.onclick = function() {
              App.bid(auctionId)
            };
            button.appendChild(buttonText);
            return button;
        case "collect":
            var buttonText = document.createTextNode("COLLECT");
            button.onclick = function() {
              App.auctionEnd(auctionId)
            };
            button.appendChild(buttonText);
            return button;
        default:
            break;
    }
  },

  constructInput: function(type,auctionId) {
    var input = document.createElement("input");
    input.id = auctionId;
    input.type = type;
    input.className = "bidInput"
    return input;
  },

  convertTimeStamp: function(timestamp) {
    var d = new Date(timestamp*1000);
    var minutes = d.getMinutes();
    if (minutes/10 < 1) {
      var minutes = "0" + minutes;
    }
    var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + " " + d.getHours() + ':' + minutes;

    return date;
  },

  watchBlocks: function(txHash) {
    var filter = web3.eth.filter('lastest');
    filter.watch(function(error,result) {
      if(error) {
        console.log(error)
      } else {
        web3.eth.getBlock(result.blockNumber, function(error, block) {
          if (error) {
            console.log(error);
          } else {
            var transactions = block.transactions;
            transactions.forEach(function(transaction) {
              if (txHash == transaction) {
                App.getAllAuctions();
                filter.stopWatching();
              }
            })
          }
        });
      }
    })
  }

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
