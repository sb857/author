pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract ContentShare {
    uint filecount;

    struct FileMap {

        uint timestamp;
        address owner;
        string contentName;
        string ownerName;
        uint priceBuy;
        uint priceRent;
        uint rentDays;
        string image;
    }

    struct Customer {

        uint balance;
        string[][] booksBought;
        // string[] booksBoughtName;
        string[][] booksRent;
        // string[] booksRentName;
        mapping (string => rentAgreement) rentDetails;
    }

    struct rentAgreement {

        uint boughtOn;
        uint validFor;
    }
    
    mapping (string => FileMap) allFiles;
    mapping (address => Customer) customerDetails;

    event FileLogStatus(bool status, uint timestamp, address owner, string ipfsHash);
    event BookPurchase(uint customerBalance, uint ownerBalance);
    event TokenPurchase(uint customerBalance, address tokenBuyer);
    
    string[] public hashValues;
    string[] public authors;
    string[] public bookNames;
    string[] public prices;
    string[][] public bookDetails;  

    function uploadContent(string memory ipfsHash, string memory contentName, string memory ownerName, uint price, uint rentPrice, uint rentDays, string memory image) public {
        
        if(allFiles[ipfsHash].timestamp == 0)
        {
            allFiles[ipfsHash] = FileMap(block.timestamp, msg.sender, contentName, ownerName, price, rentPrice, rentDays, image);
            emit FileLogStatus(true, block.timestamp, msg.sender, ipfsHash);
            // allHashes[filecount] = ipfsHash;
            // filecount++;
            hashValues.push(ipfsHash) -1;
            // authors.push(ownerName) -1;
            // bookNames.push(contentName) -1;
            // prices.push(uint2str(price)) -1;
            bookDetails.push([ownerName, contentName, uint2str(price), ipfsHash, image]) ;
        }

        else
        {
            emit FileLogStatus(true, block.timestamp, msg.sender, ipfsHash);
        }
    }

    function search(string memory fileHash) public view returns (string memory contentName) {
        return (allFiles[fileHash].contentName);
    }

    function purchase(string memory fileHash, string memory custName) public {

        address owner = allFiles[fileHash].owner;
        uint unitPrice = allFiles[fileHash].priceBuy;
        uint custBalance;
        uint ownerBalance;

        Customer storage author = customerDetails[owner];
        Customer storage customer = customerDetails[msg.sender];
        
        require(customer.balance >= unitPrice, "Low Wallet Balance");
        custBalance = customer.balance - unitPrice;
        ownerBalance = author.balance + unitPrice;
        
        author.balance = ownerBalance;
        customer.balance = custBalance;
        customer.booksBought.push([fileHash,search(fileHash)]) -1;
        // customer.booksBoughtName.push(search(fileHash)) -1;
        emit BookPurchase(customer.balance, author.balance);
    }
    
    function rentTransaction(string memory fileHash) public {
        
        uint currentTime = block.timestamp;
        address owner = allFiles[fileHash].owner;
        uint rentDays = allFiles[fileHash].rentDays;
        uint finalTime = currentTime + rentDays * 1 days;
        uint rentPrice = allFiles[fileHash].priceRent;
        uint custBalance;
        uint ownerBalance;
        
        Customer storage author = customerDetails[owner];
        Customer storage customer = customerDetails[msg.sender];
        
        
        require(customer.balance >= rentPrice, "Low Wallet Balance");
        custBalance = customer.balance - rentPrice;
        ownerBalance = author.balance + rentPrice;
        
        author.balance = ownerBalance;
        customer.balance = custBalance;
        customer.booksRent.push([fileHash,search(fileHash)]) -1;
        // customer.booksRentName.push(search(fileHash)) -1;
        customer.rentDetails[fileHash] = rentAgreement(currentTime, finalTime);
    }
    
    function getRentUpdate(address customer, string memory fileHash) public view returns (bool) {
        
        Customer storage customer = customerDetails[msg.sender];
        if(now == customer.rentDetails[fileHash].validFor) {
            return false;
        }
        else {
            return true;
        }
    }
    
    function buyTokens(uint tokens) public {
        
        customerDetails[msg.sender].balance += tokens;
    }
    
    function getCustomer(address custAddress) public view returns (uint customerBalance, string[][] memory boughtBooks, string[][] memory rentBooks) {
        return (customerDetails[custAddress].balance, customerDetails[custAddress].booksBought, customerDetails[custAddress].booksRent );
    }
    
    function compareStrings (string memory a, string memory b) public view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }
    
    function getBooks(string memory bookName) public view returns (string memory) {
        for(uint i=0; i<=hashValues.length; i++) {
            string memory name = allFiles[hashValues[i]].contentName;
            if(compareStrings(name, bookName)){
                return (hashValues[i]);
            } 
        }
    }
    
    function getAllBooks() public view returns (string[][] memory) {
        return(bookDetails);
    }
    
    function allowComment(string memory ipfsHash) public view returns (bool) {
        Customer memory customer = customerDetails[msg.sender];
        for(uint i =0; i< customer.booksBought.length; i++) {
            if(compareStrings(ipfsHash, customer.booksBought[0][i])) {
                return true;
            }
        }
    }
    
    function uint2str(uint _i) public view returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
 }
