pragma solidity ^0.4.19;

import "./Auction.sol";

contract AuctionHouse {
    // List of active auctions
    address[] private auctions;

    // Deploy new auction contract
    function createAuction(
        address _beneficiary, 
        uint _biddingTime,
        uint _minPrice) 
        public returns(address) {
        Auction auction = new Auction(_beneficiary, _biddingTime, _minPrice);
        auctions.push(auction);
        return auction;
    }

    function getAuctions() view public returns(address[]) {
        return auctions;
    }
}