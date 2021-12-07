// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ElixirSoundLibrary is ERC721 {
    
    uint public tokenCount;
    
    struct Sound {
        uint tokenId;
        string tokenURI;
        uint price;
        address payable creator;
        address[] licensees;
    }

    event SoundCreated (
        uint indexed tokenId,
        string tokenURI,
        uint price,
        address creator
    );

    event SoundLicensed (
        uint indexed tokenId,
        uint price,
        address creator,
        address licensee
    );
    
    mapping(uint => Sound) private sounds;
    mapping(address => uint[]) private creatorToSound;
    mapping(address => uint[]) private licenseeToSound;
    mapping(uint256 => mapping(address => bool)) isLicensed;
    
    address owner;
    
    constructor() ERC721("Elixir", "ELIX") {
        owner = msg.sender;
    }
    
    function mintSound(string memory tokenURI, uint price) public {
        require(bytes(tokenURI).length >= 46, "Invalid token URI");
        uint tokenId = tokenCount;
        Sound memory newSound;
        newSound.tokenId = tokenId;
        newSound.tokenURI = tokenURI;
        newSound.price = price;
        newSound.creator = payable(msg.sender);
        sounds[tokenId] = newSound;
        creatorToSound[msg.sender].push(tokenId);    
        _safeMint(msg.sender, tokenId);
        tokenCount++;        

        emit SoundCreated(tokenId, tokenURI, price, msg.sender);
    }
    
    function addLicensee(uint tokenId) public payable {
        require(!isLicensed[tokenId][msg.sender], "Sound is already licensed");
        uint price = sounds[tokenId].price;
        uint takeFee = price / 50;
        address creator = sounds[tokenId].creator;
        require(msg.sender != creator, "Licensee cannot be the creator.");
        require(msg.value == price + takeFee, "Please submit the correct amount of ether");
        sounds[tokenId].licensees.push(msg.sender);
        licenseeToSound[msg.sender].push(tokenId);
        isLicensed[tokenId][msg.sender] = true;

        payable(creator).transfer(price);
        payable(owner).transfer(takeFee);

        emit SoundLicensed(tokenId, price, creator, msg.sender);
    }
    
    function sound(uint tokenId) public view returns (Sound memory) {
        return sounds[tokenId];
    }

    function creatorSounds(address creator) public view returns (uint[] memory) {
        return creatorToSound[creator];
    }

    function licenses() public view returns (uint[] memory) {
        return licenseeToSound[msg.sender];
    }

}
