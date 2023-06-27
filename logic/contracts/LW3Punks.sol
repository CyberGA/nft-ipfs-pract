// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

contract LW3Punks is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string _baseTokenURI;

    // _price is the price of each NFT
    uint256 public _price = 0.001 ether;

    // _paused is used to pause the sale of the NFTs incase of emargency
    bool public _paused;

    // _maxSupply is the maximum number of NFTs that can be minted
    // constant is used to make sure that the value of maxTokenIds cannot be changed
    uint256 constant public maxTokenIds = 10;

    // _tokenIds is the number of NFTs that have been minted
    uint256 public tokenIds;

    modifier onlyWhenNotPaused {
        require(!_paused, "Sale is currently paused");
        _;
    }

    /**
     * @dev ERC721 constructor takes in a 'name' and a 'symbol' for the NFT
     * name is the name of the NFT, in our case 'LW3Punks'
     * symbol is the symbol of the NFT, in our case 'LW3P'
     * @param baseURI is the base URI for the NFTs to set _baseTokenURI for the collection
     */
    constructor(string memory baseURI) ERC721("LW3Punks", "LW3P") {
        _baseTokenURI = baseURI;
        _paused = false;
    }


    /**
     * @dev mint is a function that mints a new NFT and assigns it to the address of the caller (`msg.sender`)
     * @dev onlyWhenNotPaused is a modifier that checks if the sale is paused or not
     */
    function mint() public payable onlyWhenNotPaused {
        /**
         * @dev check if the number of NFTs that have been minted is less than the maximum number of NFTs that can be minted
         * @dev check if the amount of ether sent to the contract is greater than or equal to the price of each NFT
         * @param tokenIds is the token ID of the NFT to be minted
         * @param maxTokenIds is the maximum number of NFTs that can be minted
         * @param msg.value is the amount of ether sent to the contract
         * @param _price is the price of each NFT
         */
        require(tokenIds < maxTokenIds, "All tokens have been minted");
        require(msg.value >= _price, "Insufficient funds");

        
        /**
         * @dev _safeMint is a function that mints a new NFT and assigns it to the address of the caller (`msg.sender`)
         * @param msg.sender is the address of the caller
         * @param tokenIds is the token ID of the NFT to be minted
         * @notice tokenIds is incremented after each mint
         */
        _safeMint(msg.sender, tokenIds);
        tokenIds++;
    }

    /**
     * @dev _baseURI is a function that returns the base URI for the NFTs
     * @dev 'virtual override' is used to override the _baseURI function in Openzeppelin's ERC721.sol implementation
     * @return _baseTokenURI is the base URI for the NFTs
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev getBaseURI is a function that returns the base URI for the NFTs
     * @return _baseURI() is the base URI for the NFTs
     */
    function getBaseURI() external view returns(string memory) {
        return _baseURI();
    }

    /**
     * @dev tokenURI is a function that returns the URI for a given token ID
     *       overrides the Openzeppelin's ERC721 implementation of tokenURI
     * @param tokenId is the token ID of the NFT
     * @return string is the URI for the NFT
     */
    function tokenURI(uint256 tokenId) public view virtual override returns(string memory) {
        /**
         * @dev _exists is a function that checks if a given token ID exists
         */
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();

        /**
         * @dev bytes is a function that returns the length of a given string
         * @dev abi.encodePacked is a function that concatenates two strings
         * @dev tokenId.toString() is a function that converts a uint256 to a string
         * @dev string is a function that converts a bytes to a string
         * @dev Here it checks if the length of the baseURI is greater than 0, if it is,
         *      it concatenates the baseURI, the tokenId and the .json extension so that
         *      it knows the location of the metadata json file for a give tokenId stored
         *      on IPFS
         */
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
    }

    /**
     * @dev setAvailability is a function that sets the availability of the contract
     * @dev onlyOwner is a modifier that checks if the caller is the owner of the contract
     * @param _availability is the availability of the contract
     */
    function setAvailability(bool _availability) public onlyOwner {
        _paused = _availability;
    }

    /**
     * @dev setPrice is a function that sets the price of each NFT
     * @param _newPrice is the new price of each NFT
     */
    function setPrice(uint256 _newPrice) public onlyOwner {
        _price = _newPrice;
    }

    /**
     * @dev withdraw is a function that withdraws the ether in the contract to the owner of the contract
     * @dev onlyOwner is a modifier that checks if the caller is the owner of the contract
     */
    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Withdrawal failed");
    }

    /**
     * @dev receive is a function that receives ether, msg.data must be empty
     * @dev payable is a function that is called when msg.data is not empty to receive ether
     */
    receive() external payable {}
    fallback() external payable {}
}