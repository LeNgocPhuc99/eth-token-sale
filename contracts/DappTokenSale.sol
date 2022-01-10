// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./DappToken.sol";

contract DappTokenSale {
    address addmin;
    DappToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(DappToken _tokenContract, uint256 _tokenPrice) {
        // Assign an admin
        addmin = msg.sender;
        // Token Contract
        tokenContract = _tokenContract;
        // Token Price
        tokenPrice = _tokenPrice;
    }

    // multiply: (dapphub/ds-math)
    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        // Require that value is equal to tokens
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        // Require that the contract has enough tokens
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        // Require that a transfer is successful
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        // Keep track of tokensSold
        tokensSold += _numberOfTokens;
        // Trigger Sell Event
        emit Sell(msg.sender, _numberOfTokens);
    }
}
