pragma solidity 0.5.8;

contract Ownership {
    struct FileMap 
        {
            uint timestamp;
            string owner;
        }

    mapping (string => FileMap) allFiles;

    event FileLogStatus(bool status, uint timestamp, string owner, string ipfsHash);

    function set(string memory owner, string memory ipfsHash) public
    {
        if(allFiles[ipfsHash].timestamp == 0)
        {
            allFiles[ipfsHash] = FileMap(block.timestamp, owner);
            emit FileLogStatus(true, block.timestamp, owner, ipfsHash);
        }

        else
        {
            emit FileLogStatus(true, block.timestamp, owner, ipfsHash);
        }
    }

    function get(string memory ipfsHash) internal view returns (uint timestamp, string memory owner)
    {
        return (allFiles[ipfsHash].timestamp, allFiles[ipfsHash].owner);
    }
}