pragma solidity 0.5;

contract ContentShare {

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
        uint _balance;
        // FileMap booksBought;
    }

    struct Owner {

        string ownerName;
        uint _balance;
        // FileMap booksUploaded;
    }

    mapping (string => FileMap) allFiles;
    mapping (address => Customer) customerDetails;
    mapping (address => Owner) ownerDetails;

    event FileLogStatus(bool status, uint timestamp, address owner, string ipfsHash);
    event BookPurchase(uint customerBalance, uint ownerBalance);
    event TokenPurchase(uint customerBalance, address tokenBuyer);

    function uploadContent(address owner, string memory ipfsHash, string memory contentName, string memory ownerName, uint price) public {
        if(allFiles[ipfsHash].timestamp == 0)

        {
            allFiles[ipfsHash] = FileMap(block.timestamp, owner, contentName, ownerName, price);
            emit FileLogStatus(true, block.timestamp, owner, ipfsHash);
        }

        else
        {
            emit FileLogStatus(true, block.timestamp, owner, ipfsHash);
        }
    }

    function search(string memory fileHash) public view returns (uint timestamp, address owner) {
        return (allFiles[fileHash].timestamp, allFiles[fileHash].owner);
    }

    function purchase(string memory fileHash, string memory custName) public {

        address owner = allFiles[fileHash].owner;
        uint unitPrice = allFiles[fileHash].price;
        uint custBalance;
        uint ownerBalance;
        
        Owner memory author = ownerDetails[owner];
        Customer memory customer = customerDetails[msg.sender];
        customer.customerName = custName;
        
        custBalance = customer._balance - unitPrice;
        ownerBalance = author._balance + unitPrice;

        ownerDetails[owner] = Owner(author.ownerName, ownerBalance);
        customerDetails[msg.sender] = Customer(custName, custBalance);

        emit BookPurchase(customer._balance, author._balance);
    }

    function buyTokens(string memory name, uint tokens) public {
        
        Customer memory customer = customerDetails[msg.sender];
        uint totalBalance = customer._balance + tokens;
                    
        customerDetails[msg.sender] = Customer(name, totalBalance);

        emit TokenPurchase(customer._balance, msg.sender);
        
    }
    
    function getCustomer(address custAddress) public view returns (string memory customerName, uint customerBalance) {
        return (customerDetails[custAddress].customerName, customerDetails[custAddress]._balance);
    }
    
    // function getBooks() public view returns(string memory bookName) {
    //     return();
    // }
    
    // function getBookCustomers(string memory ipfsHash) public view returns (Customer memory customer){

    //     return (allFiles[ipfsHash].customers);

    // }

    // function getBooks(address memory customerAddress) public view returns (FileMap fileMap) {
    //     return()
    // }
}

