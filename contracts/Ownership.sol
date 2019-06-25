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
    mapping (uint => string) allHashes;
    mapping (address => Customer) customerDetails;
    mapping (address => Owner) ownerDetails;

    event FileLogStatus(bool status, uint timestamp, address owner, string ipfsHash);
    event BookPurchase(uint customerBalance, uint ownerBalance);
    event TokenPurchase(uint customerBalance, address tokenBuyer);
    
    string[] public hashValues;
    string[] public authors;
    // string[] public foundIpfs;
    
    function uploadContent(string memory ipfsHash, string memory contentName, string memory ownerName, uint price) public {
        
        if(allFiles[ipfsHash].timestamp == 0)

        {
            allFiles[ipfsHash] = FileMap(block.timestamp, msg.sender, contentName, ownerName, price);
            emit FileLogStatus(true, block.timestamp, msg.sender, ipfsHash);
            allHashes[filecount] = ipfsHash;
            filecount++;
            hashValues.push(ipfsHash) -1;
            authors.push(ownerName) -1;
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
    
    function getAllBooks() public view returns (FileMap[] memory) {
        FileMap[] memory ret = new FileMap[](filecount);
        for ( uint i = 0; i < filecount; i++){
            ret[i] = allFiles[allHashes[i]];
        }
        return ret;
    }
 }
