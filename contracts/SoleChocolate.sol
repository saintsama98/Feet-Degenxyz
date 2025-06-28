// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract FeetPicNFT is ERC721URIStorage {
    uint256 public tokenCounter;

    event NFTCreated(uint256 tokenId, string tokenURI, string contentType);

    constructor() ERC721("FeetPicNFT", "FPNFT") {
        tokenCounter = 0;
    }

    function createFeetPicNFT(string memory tokenURI, string memory contentType) public returns (uint256) {
        require(
            keccak256(abi.encodePacked(contentType)) == keccak256(abi.encodePacked("feet")) ||
            keccak256(abi.encodePacked(contentType)) == keccak256(abi.encodePacked("nsfw")),
            "Only feet or NSFW content allowed"
        );
        uint256 newItemId = tokenCounter;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit NFTCreated(newItemId, tokenURI, contentType);
        tokenCounter++;
        return newItemId;
    }
}
