// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Pool is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    event LogDeposit(address sender,uint256 amount, uint256 time);
    event LogWithdraw(address user, uint256 index);

    struct Deposit {
        uint256 amount;
        uint256 time;
    }
    mapping(address => Deposit[]) public userDeposits;

    uint256 public depositTime;
    IERC20 public token;

    function setDepositTime(uint256 depositTime_) external onlyOwner {
        depositTime = depositTime_;
    }

    constructor(uint256 depositTime_, IERC20 token_) public {
        depositTime = depositTime_;
        token = token_;
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount != 0, "Can't deposit zero amount");
        Deposit[] storage instance = userDeposits[msg.sender];

        uint256 amountToDeposit = amount.mul(10**18).div(token.totalSupply());
        uint256 withdrawTime = block.timestamp.add(depositTime);

        instance.push(Deposit(amount, withdrawTime));
        token.safeTransferFrom(msg.sender, address(this), amountToDeposit);

        emit LogDeposit(msg.sender, amount, withdrawTime);
    }

    function withdraw(uint256 index) external nonReentrant {
        Deposit storage instance = userDeposits[msg.sender][index];

        require(instance.time >= block.timestamp, "Deposit time not finished");
        require(instance.amount != 0, "Amount already withdrawn");

        uint256 balance = instance.amount;
        instance.amount = 0;

        token.safeTransfer(
            msg.sender,
            token.totalSupply().mul(balance).div(10**18)
        );

        emit LogWithdraw(msg.sender, index);
    }
}
