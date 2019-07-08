pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract ContentShare {

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
        string[][] booksRent;
        string[] uploadHash;
        mapping (string => rentAgreement) rentDetails;
    }

    struct rentAgreement {
        
        uint boughtOn;
        uint validFor;
    }
    
    struct totalBought {
        uint total;
        uint totalEarnings;
    }
    
    event FileLogStatus(bool status, uint timestamp, address owner, string ipfsHash);
    event BookPurchase(uint customerBalance, uint ownerBalance);
    event TokenPurchase(uint customerBalance, address tokenBuyer);
    
    string[] public hashValues;
    string[] public authors;
    string[] public bookNames;
    string[] public prices;
    string[][] public bookDetails;  

    mapping (string => FileMap) allFiles;
    mapping (address => Customer) customerDetails; 
    mapping (address => totalBought) bookStats;
    
    function uploadContent(string memory ipfsHash, string memory contentName, string memory ownerName, uint price, uint rentPrice, uint rentDays, string memory image) public {
        
        Customer storage customer = customerDetails[msg.sender];
        
        if(allFiles[ipfsHash].timestamp == 0)
        {
            allFiles[ipfsHash] = FileMap(block.timestamp, msg.sender, contentName, ownerName, price, rentPrice, rentDays, image);
            customer.uploadHash.push(ipfsHash);
            hashValues.push(ipfsHash) -1;
            bookDetails.push([ownerName, contentName, uint2str(price), ipfsHash, image, uint2str(rentPrice), uint2str(rentDays)]);
            
            emit FileLogStatus(true, block.timestamp, msg.sender, ipfsHash);
        }
        else
        {
            emit FileLogStatus(true, block.timestamp, msg.sender, ipfsHash);
        }
    }

    function searchName(string memory fileHash) public view returns (string memory contentName) {
        
        return (allFiles[fileHash].contentName);
    }
    
    function getUploads(address custAddress) public view returns (uint total, uint earnings) {
        
        return(bookStats[custAddress].total, bookStats[custAddress].totalEarnings);
    }
    
    function purchase(string memory fileHash) public {

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
        
        bookStats[owner].total = bookStats[owner].total + 1;
        bookStats[owner].totalEarnings = bookStats[owner].totalEarnings + unitPrice;
        
        customer.booksBought.push([fileHash, allFiles[fileHash].contentName, allFiles[fileHash].image]) -1;
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
        
        customer.booksRent.push([fileHash, allFiles[fileHash].contentName, allFiles[fileHash].image]) -1;
        customer.rentDetails[fileHash] = rentAgreement(currentTime, finalTime);
        
        bookStats[owner].total = bookStats[owner].total + 1;
        bookStats[owner].totalEarnings = bookStats[owner].totalEarnings + rentPrice;

    }
    
    function getRentUpdate(string memory fileHash) public view returns (bool) {
        
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
        return (customerDetails[custAddress].balance, customerDetails[custAddress].booksBought, customerDetails[custAddress].booksRent);
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
    
    function getBookTotal(string memory ipfsHash) public view returns (uint totalBought) {
        
        Customer storage customer = customerDetails[msg.sender];
        for(uint i=0; i<= customer.uploadHash.length; i++) {
            if(compareStrings(customer.uploadHash[i],ipfsHash)) {
                return totalBought;
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