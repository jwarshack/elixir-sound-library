// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Elixir Sound Library
 * @notice Modified ERC721 contract that allows for token licensing
 */
contract ElixirSoundLibrary is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter public tokenCounter;

    struct SoundData {
        uint256 price;
        string tokenURI;
    }

    event SoundCreated (
        uint256 indexed tokenId,
        string tokenURI,
        uint256 price,
        address indexed tokenOwner
    );

    event SoundLicensed (
        uint256 indexed tokenId,
        uint256 price,
        address tokenOwner,
        address indexed licensee
    );

    event PriceUpdated (
        uint256 indexed tokenId,
        uint256 price,
        address indexed tokenOwner
    );
    
    mapping(uint256 => uint256) private tokenIdToPrice;
    mapping(uint256 => address[]) private tokenIdToLicensees;
    mapping(address => uint256[]) private licenseeToTokenIds;
    mapping(uint256 => mapping(address => bool)) public isLicensed;
    
    address private owner;
    
    constructor() ERC721("Elixir", "ELIX") {
        owner = msg.sender;
    }
    
    /**
     * @notice Mints sound 
     * @param _data SoundData containing price and tokenURI
     * @dev tokenURI should be of the form `ipfs/<CID>`
     */
    function mintSound(SoundData memory _data) external {
        uint256 currentId = tokenCounter.current();
        tokenIdToPrice[currentId] = _data.price;
        
        _safeMint(msg.sender, currentId);
        _setTokenURI(currentId, _data.tokenURI);

        tokenCounter.increment();

        emit SoundCreated(currentId, _data.tokenURI, _data.price, msg.sender);
    }

    /**
     * @notice Licenses sound
     * Licensee's address is tracked -- No transfer of token ownership
     */
    function licenseSound(uint256 _tokenId) external payable {
        require(!isLicensed[_tokenId][msg.sender], "Sound is already licensed");

        address _tokenOwner = ownerOf(_tokenId);
        require(msg.sender != _tokenOwner, "Licensee cannot be the owner");

        uint256 _price = tokenIdToPrice[_tokenId];
        require(msg.value == _price, "Please submit the correct amount of ether");

        tokenIdToLicensees[_tokenId].push(msg.sender);
        licenseeToTokenIds[msg.sender].push(_tokenId);
        isLicensed[_tokenId][msg.sender] = true;

        // Platform takes 4% fee
        uint256 _fee = _price / 25; 

        // Transfer ether to token owner and platform owner
        payable(_tokenOwner).transfer(_price - _fee);
        payable(owner).transfer(_fee);

        emit SoundLicensed(_tokenId, _price, _tokenOwner, msg.sender);
    }

    /**
     * @notice Allows token owner to update price of sound
     */
    function updatePrice(uint256 _tokenId, uint256 _price) external {
        require(msg.sender == ownerOf(_tokenId), "Only the owner can update the price");
        tokenIdToPrice[_tokenId] = _price;

        emit PriceUpdated(_tokenId, _price, msg.sender);
    }

    /**
     * @notice Returns sound for a given token id
     */
    function sound(uint256 _tokenId) external view returns (uint256 tokenId, uint256 price, string memory uri, address tokenOwner, address[] memory licensees) {
        return (_tokenId, tokenIdToPrice[_tokenId], tokenURI(_tokenId), ownerOf(_tokenId), tokenIdToLicensees[_tokenId]);
    }

    /**
     * @notice Returns licenses of caller
     */
    function licenses() external view returns (uint256[] memory) {
        return licenseeToTokenIds[msg.sender];
    }

}
