var Ownership = artifacts.require("./Ownership.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownership);
};
