// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract ClonkToken is ERC20, Ownable, EIP712 {
    using ECDSA for bytes32;

    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 1e18; // 1B
    uint256 public constant DAILY_BASE_AMOUNT = 100 * 1e18; // 100 CLONK per claim
    uint256 public constant CLAIM_COOLDOWN = 24 hours;
    uint256 public constant STREAK_BONUS_7 = 200; // 2x at 7 days
    uint256 public constant STREAK_BONUS_30 = 500; // 5x at 30 days

    address public claimSigner;

    struct UserInfo {
        uint256 lastClaimTime;
        uint256 streak;
        uint256 totalClaimed;
    }

    mapping(address => UserInfo) public users;
    mapping(bytes32 => bool) public usedNonces;

    bytes32 private constant CLAIM_TYPEHASH =
        keccak256("Claim(address user,uint256 amount,uint256 nonce,uint256 deadline)");

    event Claimed(address indexed user, uint256 amount, uint256 streak);

    constructor(address _claimSigner)
        ERC20("Clonk", "CLONK")
        Ownable(msg.sender)
        EIP712("ClonkToken", "1")
    {
        claimSigner = _claimSigner;
        // Mint liquidity allocation (20%) to deployer for Uniswap pool
        _mint(msg.sender, (MAX_SUPPLY * 20) / 100);
    }

    function claim(
        uint256 amount,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external {
        require(block.timestamp <= deadline, "Expired");
        require(
            block.timestamp >= users[msg.sender].lastClaimTime + CLAIM_COOLDOWN,
            "Cooldown active"
        );
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply reached");

        // Verify nonce
        bytes32 nonceHash = keccak256(abi.encodePacked(nonce));
        require(!usedNonces[nonceHash], "Nonce used");
        usedNonces[nonceHash] = true;

        // Verify signature from backend
        bytes32 structHash = keccak256(
            abi.encode(CLAIM_TYPEHASH, msg.sender, amount, nonce, deadline)
        );
        bytes32 hash = _hashTypedDataV4(structHash);
        address recovered = ECDSA.recover(hash, signature);
        require(recovered == claimSigner, "Invalid signature");

        // Update streak
        if (block.timestamp <= users[msg.sender].lastClaimTime + 48 hours) {
            users[msg.sender].streak++;
        } else {
            users[msg.sender].streak = 1;
        }

        users[msg.sender].lastClaimTime = block.timestamp;
        users[msg.sender].totalClaimed += amount;

        _mint(msg.sender, amount);
        emit Claimed(msg.sender, amount, users[msg.sender].streak);
    }

    function getClaimAmount(address user) public view returns (uint256) {
        uint256 streak = users[user].streak;
        uint256 base = DAILY_BASE_AMOUNT;

        if (streak >= 30) return (base * STREAK_BONUS_30) / 100;
        if (streak >= 7) return (base * STREAK_BONUS_7) / 100;
        return base;
    }

    function canClaim(address user) external view returns (bool) {
        return block.timestamp >= users[user].lastClaimTime + CLAIM_COOLDOWN;
    }

    function timeUntilClaim(address user) external view returns (uint256) {
        uint256 nextClaim = users[user].lastClaimTime + CLAIM_COOLDOWN;
        if (block.timestamp >= nextClaim) return 0;
        return nextClaim - block.timestamp;
    }

    function setClaimSigner(address _signer) external onlyOwner {
        claimSigner = _signer;
    }
}
