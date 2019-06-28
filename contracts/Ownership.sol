pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract ContentShare {
    uint filecount;

    struct FileMap {

        uint timestamp;
        address owner;
        string contentName;
        string ownerName;
        uint price;
        // address[] customer;
    }

    struct Customer {

        string customerName;
        uint balance;
        // FileMap booksBought;
    }

    struct Owner {

        string ownerName;
        uint balance;
        // FileMap booksUploaded;
    }

    mapping (string => FileMap) allFiles;
    mapping (address => Customer) customerDetails;
    mapping (address => Owner) ownerDetails;

    event FileLogStatus(bool status, uint timestamp, address owner, string ipfsHash);
    event BookPurchase(uint customerBalance, uint ownerBalance);
    event TokenPurchase(uint customerBalance, address tokenBuyer);
    
    string[] public hashValues;
    string[] public authors;
    string[] public bookNames;
    string[] public prices;
    string[][] public bookDetails;  
    
    function uploadContent(string memory ipfsHash, string memory contentName, string memory ownerName, uint price) public {
        
        if(allFiles[ipfsHash].timestamp == 0)
        {
            allFiles[ipfsHash] = FileMap(block.timestamp, msg.sender, contentName, ownerName, price);
            emit FileLogStatus(true, block.timestamp, msg.sender, ipfsHash);
            // allHashes[filecount] = ipfsHash;
            // filecount++;
            hashValues.push(ipfsHash) -1;
            authors.push(ownerName) -1;
            bookNames.push(contentName) -1;
            prices.push(uint2str(price)) -1;
            bookDetails.push([ownerName, contentName, uint2str(price), ipfsHash]) ;
        }

        else
        {
            emit FileLogStatus(true, block.timestamp, msg.sender, ipfsHash);
        }
    }

    function search(string memory fileHash) public view returns (uint timestamp, address owner, uint price, string memory ownerName) {
        return (allFiles[fileHash].timestamp, allFiles[fileHash].owner, allFiles[fileHash].price, allFiles[fileHash].ownerName);
    }

    function purchase(string memory fileHash, string memory custName) public {

        address owner = allFiles[fileHash].owner;
        uint unitPrice = allFiles[fileHash].price;
        uint custBalance;
        uint ownerBalance;
        
        Owner memory author = ownerDetails[owner];
        Customer memory customer = customerDetails[msg.sender];
        customer.customerName = custName;
        
        custBalance = customer.balance - unitPrice;
        ownerBalance = author.balance + unitPrice;

        ownerDetails[owner] = Owner(author.ownerName, ownerBalance);
        customerDetails[msg.sender] = Customer(custName, custBalance);

        emit BookPurchase(customer.balance, author.balance);
    }
    
    function rent(string memory fileHash, uint validDays) public view returns(bool) {
        
        currentTime = block.timestamp;
        finalTime = currentTime + days;
        
        if(currentTime >= finalTime + validDays * 1 days ) {
            
        }
        
    }
    function buyTokens(string memory name, uint tokens) public {
        
        Customer memory customer = customerDetails[msg.sender];
        uint totalBalance = customer.balance + tokens;
                    
        customerDetails[msg.sender] = Customer(name, totalBalance);

        emit TokenPurchase(customer.balance, msg.sender);
        
    }
    
    function getCustomer(address custAddress) public view returns (string memory customerName, uint customerBalance) {
        return (customerDetails[custAddress].customerName, customerDetails[custAddress].balance);
    }
    
    function compareStrings (string memory a, string memory b) public view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }
    
    
    function getBooks(string memory bookName) public view returns (string memory) {
        for(uint i=0; i<=hashValues.length; i++){
            string memory name = allFiles[hashValues[i]].contentName;
            if(compareStrings(name, bookName)){
                return (hashValues[i]);
                // foundIpfs.push(hashValues[i]);
            }
            // return (foundIpfs);
        }
    }
    
    function getAllBooks() public view returns (string[][] memory) {
        return(bookDetails);
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
