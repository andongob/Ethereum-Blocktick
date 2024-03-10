// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EventNFTManager is ERC721URIStorage, Ownable {

    string public eventName;
    string public eventOrganizer;
    string public eventCategory;
    address public eventOwner;
    uint256 public ticketPrice;

    constructor(
        string memory _eventName,
        string memory _eventOrganizer,
        string memory _eventCategory,
        address _owner,
        uint256 _ticketPrice
    ) ERC721(string.concat(_eventName," TicketNFT"), "TICKET") Ownable() {
        eventName = _eventName;
        eventOrganizer = _eventOrganizer;
        eventCategory = _eventCategory;
        eventOwner = _owner;
        ticketPrice = _ticketPrice;

        transferOwnership(eventOwner);
    }

    function getPrice() public view returns (uint256) {
        return ticketPrice;
    }


    using Counters for Counters.Counter;
    Counters.Counter private tokenIdCounter;

    
    mapping(address => uint256[]) public ticketHolders;


    function changeTicketPriceTest(uint _newPrice) onlyOwner public {
       ticketPrice = _newPrice;
    }
   
   function buyTickets(address _user, uint256 _amount) payable public {
    //el hecho de que el propietario del tiquet lo pases por parámetro permite que tu puedas comprar tiquets para otro,
    //entiendo que es el objetivo y estla permitido, de lo contrario _user debería ser msg.sender, para que restringir a que uno solo pueda comprar sus tiquets 
        require(msg.value >= ticketPrice * _amount, "Saldo insuficiente");
        require(_amount == 1, "Lo sentimos, solo puedes comprar un ticket");
        require(ticketHolders[msg.sender].length == 0, "Vaya ya tienes un ticket, no es posible comprar mas");
        uint256[] memory tokenIds = _mintNFTs(_user, _amount);
        ticketHolders[_user] = tokenIds;
    }

    function  buyOneTicketForMe() payable public {
    //si queremos acotar a que solo puede comprar un tiquet y es para esa persona, no le daría opción en la función a otras cosas 
        require(msg.value >= ticketPrice , "Saldo insuficiente");   // _amount = 1
        require(ticketHolders[msg.sender].length == 0, "Vaya ya tienes un ticket, no es posible comprar mas");
        uint256[] memory tokenIds = _mintNFTs(msg.sender, 1);
        ticketHolders[msg.sender] = tokenIds;
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

        string memory ipfsUrl = "https://blocktick.infura-ipfs.io/ipfs/QmTp7Zdmk4ESqCDMzZHY8NgnK3pUvrymq9BYxZZBnNPVmt";

        for (uint256 i = 0; i < _amount; i++) {
            uint256 tokenId = tokenIdCounter.current();
            _mint(_user, tokenId);
            _setTokenURI(tokenId, ipfsUrl);
            tokenIdCounter.increment();
            newTokenIds[i] = tokenId;
        }
        
        return newTokenIds;
    }

}

contract EventFactory is Ownable {
    address[] public eventsCreated;

    function createEvent(string memory _eventName, string memory _eventOrganizer, string memory _eventCategory, uint256 _ticketPrice) public onlyOwner {
        EventNFTManager newEvent = new EventNFTManager(_eventName, _eventOrganizer, _eventCategory, msg.sender, _ticketPrice);
        eventsCreated.push(address(newEvent));
    }

    function getEventPrice(uint index) public view returns (uint) {
        return EventNFTManager(eventsCreated[index]).getPrice();
    }

    constructor() Ownable() {
        // El constructor de Ownable se llama sin argumentos
    }
}


