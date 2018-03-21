pragma solidity ^0.4.19;

import "./Auction.sol";

contract AuctionHouse {
    struct AuctionData {
        address beneficiary;
        uint item;
        uint time;
        uint minPrice;
    }

    // List of active auctions
    address[] auctionIds;
    mapping(address => AuctionData) auctions;

    // Deploy new auction contract
    function createAuction(
        address _beneficiary, 
        uint _item,
        uint _time,
        uint _minPrice) 
        public returns(address) {
        Auction id = new Auction(_beneficiary, _time, _minPrice);
        auctionIds.push(id);
        auctions[id] = AuctionData(_beneficiary, _item, _time, _minPrice);
        return id;
    }
    
    function getAuctionIds() public view returns(address[]) {
        return auctionIds;
    }

    function getAuction(address id) public view returns(address) {
        AuctionData auction = auctions[id];
        return (
            auction.beneficiary
        );
    }
}