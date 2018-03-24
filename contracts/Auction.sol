pragma solidity ^0.4.19;

contract Auction {
    // Parameters
    address public beneficiary;
    uint public auctionEnd;
    uint public item;

    // State
    address public highestBidder;
    uint private startPrice;
    uint public highestBid;
    bool private ended;

    // Pending widrawals
    mapping(address => uint) pendingReturns;

    // Events
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    // Create new auction
    function Auction(
        address _beneficiary,
        uint _biddingTime,
        uint _startPrice,
        uint _item
 	) public {
        beneficiary = _beneficiary;
        auctionEnd = now + _biddingTime;
        item = _item;
        startPrice = _startPrice;
        highestBid = _startPrice;
    }

    function bid() public payable {
        require(now <= auctionEnd);
        require(msg.value > highestBid);
        require(msg.sender != beneficiary && msg.sender != highestBidder);

        if (highestBidder != 0) {
            pendingReturns[highestBidder] = highestBid;
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
        HighestBidIncreased(msg.sender, msg.value);
    }

    /// Withdraw a bid that was overbid.
    function withdraw() public {
        require(pendingReturns[msg.sender] > 0);
        uint amount = pendingReturns[msg.sender];
        pendingReturns[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

    function getWithdraw(address account) public view returns(bool) {
        if (pendingReturns[account] > 0) {
            return true;
        }
        return false;
    }

    function auctionEnd() public {
        require(now >= auctionEnd);
        require(msg.sender == beneficiary);
        require(!ended);

        ended = true;
        AuctionEnded(highestBidder, highestBid);

        beneficiary.transfer(highestBid);
    }

    function getAuctionInfo() public view returns(address,uint,uint,uint) {
        return (beneficiary, highestBid, auctionEnd, item);
    }

}