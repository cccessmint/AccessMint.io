// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AccessMintDynamicMulti is ERC721Enumerable, Ownable {
    struct TicketType {
        string typeName;
        uint256 price;
        uint256 maxSupply;
        uint256 sold;
        string metadataURI;
    }

    mapping(uint256 => TicketType) public ticketTypes;
    uint256 public ticketTypeCount;

    string public baseURI;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        address initialOwner
    ) ERC721(_name, _symbol) Ownable(initialOwner) {
        baseURI = _baseURI;
    }

    function addTicketType(
        string memory typeName,
        uint256 price,
        uint256 maxSupply,
        string memory metadataURI
    ) external onlyOwner {
        ticketTypeCount++;
        ticketTypes[ticketTypeCount] = TicketType(
            typeName,
            price,
            maxSupply,
            0,
            metadataURI
        );
    }

    function mint(uint256 ticketTypeId) public payable {
        TicketType storage ticket = ticketTypes[ticketTypeId];

        require(ticket.price > 0, "Invalid ticket type");
        require(msg.value >= ticket.price, "Insufficient funds");
        require(ticket.sold < ticket.maxSupply, "Max supply reached");

        ticket.sold++;
        uint256 tokenId = totalSupply() + 1;
        _safeMint(msg.sender, tokenId);
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenId > 0 && tokenId <= totalSupply(), "Token does not exist");
        return string(abi.encodePacked(baseURI, uint2str(tokenId)));
    }

    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;
        while (j != 0) { length++; j /= 10; }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) { bstr[--k] = bytes1(uint8(48 + j % 10)); j /= 10; }
        str = string(bstr);
    }
}

