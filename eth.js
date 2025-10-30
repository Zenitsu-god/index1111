require('dotenv').config();
const crypto = require('crypto');
const { ethers } = require('ethers');

const ETH_RPC = process.env.ETH_RPC; // e.g., Goerli or Sepolia testnet
const provider = new ethers.providers.JsonRpcProvider(ETH_RPC);

function genPrivateKeyHex() {
  return crypto.randomBytes(32).toString('hex');
}

async function checkWallet() {
  while (true) {
    const priv = '0x' + genPrivateKeyHex();
    const wallet = new ethers.Wallet(priv);
    try {
      const balance = await provider.getBalance(wallet.address);
      const ethBal = ethers.utils.formatEther(balance);

      if (parseFloat(ethBal) > 0) {
        console.log('✅ Found wallet with balance!');
        console.log('Priv:', wallet.privateKey);
        console.log('Address:', wallet.address);
        console.log('Balance:', ethBal, 'ETH');
        break; // stop bot
      } else {
        console.log('Checked', wallet.address, 'Balance:', ethBal);
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
}

checkWallet();
