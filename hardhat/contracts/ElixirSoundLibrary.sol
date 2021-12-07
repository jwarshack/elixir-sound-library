// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ElixirSoundLibrary is ERC721 {
    
    uint public soundCount;
    
    struct Sound {
        uint id;
        string uri;
        uint price;
        address payable creator;
        address[] licensees;
    }

    event SoundCreated (
        uint indexed id,
        string uri,
        uint price,
        address creator
    );

    event SoundLicensed (
        uint indexed id,
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
    
    function mintSound(string memory _uri, uint _price) public {
        uint _currentId = soundCount;
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
    
    function licenseSound(uint _id) public payable {
        require(!isLicensed[_id][msg.sender], "Sound is already licensed");
        uint _price = sounds[_id].price;
        uint _fee = _price / 50;
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
    
    function sound(uint _id) public view returns (Sound memory) {
        return sounds[_id];
    }

    function creatorSounds(address _creator) public view returns (uint[] memory) {
        return creatorToSound[_creator];
    }

    function licenses() public view returns (uint[] memory) {
        return licenseeToSound[msg.sender];
    }

}
