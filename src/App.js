function getErrorMessage(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err.message) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    if (err.toString) return err.toString();
    return "Unknown error object";
  }
}

const connectWallet = async () => {
  try {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWallet(accounts[0]);
    } else {
      alert("Please install MetaMask!");
    }
  } catch (err) {
    let msg = getErrorMessage(err);
    setStatus("Error: " + msg);
    alert("Error: " + msg);
    console.error("Full error object:", err);
  }
};

// Helper to upload a file to Pinata
async function uploadFileToPinata(file) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();
  data.append("file", file);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
    },
    body: data,
  });

  if (!res.ok) throw new Error("Failed to upload file to Pinata");
  const result = await res.json();
  return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
}

// Helper to upload metadata JSON to Pinata
async function uploadJSONToPinata(json) {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
    },
    body: JSON.stringify(json),
  });

  if (!res.ok) throw new Error("Failed to upload JSON to Pinata");
  const result = await res.json();
  return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
}

const uploadToIPFS = async () => {
  try {
    setStatus("🚀 Uploading to Pinata...");
    // 1. Upload image
    const imageUrl = await uploadFileToPinata(file);
    // 2. Create metadata
    const metadata = {
      name,
      description,
      image: imageUrl,
      contentType,
    };
    // 3. Upload metadata
    const metadataUrl = await uploadJSONToPinata(metadata);
    setStatus("✨ Uploaded to Pinata!");
    return metadataUrl;
  } catch (err) {
    let msg = getErrorMessage(err);
    setStatus("Error: " + msg);
    alert("Error: " + msg);
    console.error("Full error object:", err);
    throw err;
  }
};

const mintNFT = async (tokenURI) => {
  try {
    setStatus("🦄 Connecting wallet...");
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
    setStatus("🎨 Minting your funky NFT...");
    setLoading(true);
    const tx = await contract.createFeetPicNFT(tokenURI, contentType);
    await tx.wait();
    setTxHash(tx.hash);
    setStatus("🌈 NFT Minted Successfully! Check your wallet!");
  } catch (err) {
    let msg = getErrorMessage(err);
    setStatus("Error: " + msg);
    alert("Error: " + msg);
    console.error("Full error object:", err);
  }
  setLoading(false);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file || !name || !description || !contentType) {
    setStatus("⚠️ Please fill all fields!");
    return;
  }
  setLoading(true);
  try {
    const tokenURI = await uploadToIPFS();
    await mintNFT(tokenURI);
  } catch (err) {
    let msg = getErrorMessage(err);
    setStatus("Error: " + msg);
    alert("Error: " + msg);
    console.error("Full error object:", err);
  }
  setLoading(false);
};