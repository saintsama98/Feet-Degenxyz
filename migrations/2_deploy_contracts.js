const MyNFT = artifacts.require("MyNFT");

module.exports = async function (deployer) {
  try {
    console.log("Starting deployment of MyNFT contract...");
    await deployer.deploy(MyNFT);
    const deployedContract = await MyNFT.deployed();
    console.log("MyNFT contract deployed successfully!");
    console.log("Contract Address:", deployedContract.address);
  } catch (error) {
    console.error("Error during deployment:", error.message);
    console.error("Stack Trace:", error.stack);
  }
};
