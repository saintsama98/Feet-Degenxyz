module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      gas: 8000000, // Increase if necessary
      gasPrice: 20000000000, // Optional: Adjust gas price
    }
  },
  compilers: {
    solc: {
      version: "0.8.20"
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'USD',
      gasPrice: 20
    }
  }
};
