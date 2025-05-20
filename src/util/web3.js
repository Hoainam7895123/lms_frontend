import { Web3Modal } from "@web3modal/ethers";
import { ethers } from "ethers";

// Cấu hình Web3Modal
const web3Modal = new Web3Modal({
  cacheProvider: true, // Lưu trữ kết nối ví để không cần kết nối lại
  providerOptions: {}, // Có thể thêm các tùy chọn ví như WalletConnect nếu cần
  theme: {
    accentColor: "default",
    borderRadius: "medium",
  },
});

export async function connectWallet() {
  try {
    // Kết nối ví qua Web3Modal
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    return { provider, signer, walletAddress };
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw error;
  }
}
