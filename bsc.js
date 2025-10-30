require('dotenv').config();
const crypto = require('crypto');
const { ethers } = require('ethers');

const BSC_RPC = process.env.BSC_RPC; // e.g., BSC Testnet RPC
const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);

function genPrivateKeyHex() {
  return crypto.randomBytes(32).toString('hex');
}

async function checkWallet() {
  while (true) {
    const priv = '0x' + genPrivateKeyHex();
    const wallet = new ethers.Wallet(priv);
    try {
      const balance = await provider.getBalance(wallet.address);
      const bnbBal = ethers.utils.formatEther(balance);

      if (parseFloat(bnbBal) > 0) {
        console.log('✅ Found wallet with balance!');
        console.log('Priv:', wallet.privateKey);
        console.log('Address:', wallet.address);
        console.log('Balance:', bnbBal, 'BNB');
        break; // stop bot
      } else {
        console.log('Checked', wallet.address, 'Balance:', bnbBal);
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
}

checkWallet();
