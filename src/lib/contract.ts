import { ethers } from "ethers";
import { erc721Abi } from "viem";

const RPC_URL = "https://rpc.mantle.xyz"; // Mantle RPC URL
const CONTRACT_ADDRESS = "0x38BeD286A1EbaB9BA4508A6aF3937A5458f03198"; // Mantle Monks Contract



export const checkOwnership = async (tokenId: string, walletAddress: string) => {
    try {
        // Connect to Ethereum provider (uses MetaMask or any injected provider)
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, erc721Abi, provider);

        // Call the `ownerOf` function
        const owner = await contract.ownerOf(tokenId);

        // Compare with connected wallet address
        if (owner.toLowerCase() !== walletAddress.toLowerCase()) {
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error checking ownership:", error);
        return false;
    }
};
