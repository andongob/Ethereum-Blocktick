// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Ticket is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIdCounter;

    uint256 public ticketPrice = 1 ether;
    mapping(address => uint256[]) public ticketHolders;

    constructor() ERC721("TicketNFT", "TICKET") {
    }

    function buyTickets(address _user, uint256 _amount) payable public {
        require(msg.value >= ticketPrice * _amount, "Saldo insuficiente");
        require(_amount == 1, "Lo sentimos, solo puedes comprar un ticket");
        require(ticketHolders[msg.sender].length == 0, "Vaya ya tienes un ticket, no es posible comprar mas");
        uint256[] memory tokenIds = _mintNFTs(_user, _amount);
        ticketHolders[_user] = tokenIds;
    }

    function useTickets(address _user, uint256 _amount) public {
        require(ticketHolders[_user].length >= _amount, "No tienes tickets suficientes");
        
        for (uint256 i = 0; i < _amount; i++) {
            uint256 tokenId = ticketHolders[_user][ticketHolders[_user].length - 1];
            ticketHolders[_user].pop();
            _burn(tokenId);
        }
    }

    function _mintNFTs(address _user, uint256 _amount) internal returns (uint256[] memory) {
        require(_amount == 1, "Lo sentimos, solo puedes comprar un ticket"); 
        uint256[] memory newTokenIds = new uint256[](_amount);
        
        for (uint256 i = 0; i < _amount; i++) {
            uint256 tokenId = tokenIdCounter.current();
            _mint(_user, tokenId);
            _setTokenURI(tokenId, string(abi.encodePacked(tokenId)));
            tokenIdCounter.increment();
            newTokenIds[i] = tokenId;
        }
        
        return newTokenIds;
    }
}

contract TicketAsset {
    string public eventName;
    string public eventOrganizer;
    string public eventCategory;
    address public eventOwner;
    uint256 public price;

    constructor(
        string memory _eventName,
        string memory _eventOrganizer,
        string memory _eventCategory,
        address _owner,
        uint256 _price
    ) {
        eventName = _eventName;
        eventOrganizer = _eventOrganizer;
        eventCategory = _eventCategory;
        eventOwner = _owner;
        price = _price;
    }

    function buyTicket() public payable returns (bool) {
        require(msg.value == price, "Invalid payment");
        payable(eventOwner).transfer(msg.value);
        eventOwner = msg.sender;
        return true;
    }

    function getPrice() public view returns (uint256) {
        return price;
    }
}
