pragma solidity ^0.4.19;

import "./Auction.sol";

contract AuctionHouse {
    // List of active auctions
    address[] auctionIds;

    // Deploy new auction contract
    function createAuction(
        address _beneficiary, 
        uint _biddingTime,
        uint _startPrice,
        uint _item
    ) 
    public returns(address) {
        Auction id = new Auction(_beneficiary,_biddingTime,_startPrice,_item);
        auctionIds.push(id);
        return id;
    }
    
    function getAuctionIds() public view returns(address[]) {
        return auctionIds;
    }
}