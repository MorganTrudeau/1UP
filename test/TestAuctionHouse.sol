pragma solidity ^0.4.19;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/AuctionHouse.sol";
import "../contracts/Auction.sol";

contract TestAuctionHouse {
  address _beneficiary = 0x627306090abaB3A6e1400e9345bC60c78a8BEf57;
  uint _time = 8;
  uint _minPrice = 1000;

  function testItem() public {
    AuctionHouse auctionHouse = AuctionHouse(DeployedAddresses.AuctionHouse());
    address auctionAddress = auctionHouse.createAuction(_beneficiary,_time,_minPrice);
    Auction auction = Auction(auctionAddress);
    uint minPrice = auction.getMinPrice();

    Assert.equal(minPrice, _minPrice, "Min price is wrong");
  }
}