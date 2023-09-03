// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Ticket is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIdCounter;

    uint256 public ticketPrice = 0.000000000000000001 ether; //1 wei
    mapping(address => uint256[]) public ticketHolders;

    constructor() ERC721("BlocktickNFT", "BKT") {
    }

    function buyTickets(address, uint256 _amount) payable public {
        require(msg.value >= ticketPrice * _amount, "Saldo insuficiente");
        require(_amount == 1, "Lo sentimos, solo puedes comprar un ticket");
        require(ticketHolders[msg.sender].length == 0, "Vaya ya tienes un ticket, no es posible comprar mas");
        uint256[] memory tokenIds = _mintNFTs(msg.sender, _amount);
        ticketHolders[msg.sender] = tokenIds;
    }

    function useTickets(address _user, uint256 _amount) public {
        require(ticketHolders[msg.sender].length >= _amount, "No tienes tickets suficientes");
        
        for (uint256 i = 0; i < _amount; i++) {
            uint256 tokenId = ticketHolders[_user][ticketHolders[_user].length - 1];
            ticketHolders[msg.sender].pop();
            _burn(tokenId);
        }
    }


    function _mintNFTs(address, uint256 _amount) internal returns (uint256[] memory) {
        require(_amount == 1, "Lo sentimos, solo puedes comprar un ticket"); 
        uint256[] memory newTokenIds = new uint256[](_amount);

        string memory ipfsUrl = "https://blocktick.infura-ipfs.io/ipfs/QmTp7Zdmk4ESqCDMzZHY8NgnK3pUvrymq9BYxZZBnNPVmt";

        for (uint256 i = 0; i < _amount; i++) {
            uint256 tokenId = tokenIdCounter.current();
            _mint(msg.sender, tokenId);
            //_setTokenURI(tokenId, string(abi.encodePacked(tokenId)));
            _setTokenURI(tokenId, ipfsUrl);
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
