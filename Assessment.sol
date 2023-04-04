// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
       balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        // perform transaction
        balance = balance + _amount;

        // emit the event
        emit Deposit(_amount);
    }
    function withdraw(uint256 _withdrawAmount) public payable {
    
        if (balance < _withdrawAmount) {
            revert("The amount entered to withdraw is invalid");
        }

        // withdraw the given amount
        balance = balance - _withdrawAmount;

        // emit the event
        emit Withdraw(_withdrawAmount);
    }
}
