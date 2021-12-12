// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ElixirSoundLibrary is ERC721 {
    
    uint256 public soundCount;
    
    struct Sound {
        uint256 id;
        string uri;
        uint256 price;
        address payable creator;
        address[] licensees;
    }

    event SoundCreated (
        uint256 indexed id,
        string uri,
        uint256 price,
        address creator
    );

    event SoundLicensed (
        uint256 indexed id,
        uint256 price,
        address creator,
        address licensee
    );

    event PriceUpdated (
        uint256 indexed id,
        uint256 price,
        address creator
    );
    
    mapping(uint256 => Sound) private sounds;
    mapping(address => uint256[]) private creatorToSound;
    mapping(address => uint256[]) private licenseeToSound;
    mapping(uint256 => mapping(address => bool)) isLicensed;
    
    address owner;
    
    constructor() ERC721("Elixir", "ELIX") {
        owner = msg.sender;
    }
    
    function mintSound(string memory _uri, uint256 _price) public {
        uint256 _currentId = soundCount;
        Sound memory _newSound;
        _newSound.id = _currentId;
        _newSound.uri = _uri;
        _newSound.price = _price;
        _newSound.creator = payable(msg.sender);
        sounds[_currentId] = _newSound;
        creatorToSound[msg.sender].push(_currentId);    
        _safeMint(msg.sender, _currentId);
        soundCount++;        

        emit SoundCreated(_currentId, _uri, _price, msg.sender);
    }
    
    function licenseSound(uint256 _id) public payable {
        require(!isLicensed[_id][msg.sender], "Sound is already licensed");
        uint256 _price = sounds[_id].price;
        uint256 _fee = _price / 50;
        address _creator = sounds[_id].creator;
        require(msg.sender != _creator, "Licensee cannot be the creator.");
        require(msg.value == _price, "Please submit the correct amount of ether");
        sounds[_id].licensees.push(msg.sender);
        licenseeToSound[msg.sender].push(_id);
        isLicensed[_id][msg.sender] = true;

        payable(_creator).transfer(_price - _fee);
        payable(owner).transfer(_fee);

        emit SoundLicensed(_id, _price, _creator, msg.sender);
    }
    
    function sound(uint256 _id) public view returns (Sound memory) {
        return sounds[_id];
    }

    function creatorSounds(address _creator) public view returns (uint256[] memory) {
        return creatorToSound[_creator];
    }

    function licenses() public view returns (uint256[] memory) {
        return licenseeToSound[msg.sender];
    }

    function updatePrice(uint256 _id, uint256 _price) public {
        require(msg.sender == sounds[_id].creator, "Only the creator can update the price.");
        sounds[_id].price = _price;

        emit PriceUpdated(_id, _price, msg.sender);
    }

    function tokenURI(uint256 _id) public view virtual override returns (string memory) {
        require(_exists(_id), "ERC721Metadata: URI query for nonexistent token");
        return sounds[_id].uri;
    }
    

}
