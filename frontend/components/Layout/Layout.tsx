import { createContext, useState } from "react";
import NavBar from "../Navbar/Navbar";
import { ReactNode } from "react";
import { ethers } from "ethers";
import { contract_address, contract_abi } from "../../constants/index";
interface Prop {
  children?: ReactNode;
}



export const dexContext: any = createContext({});

export default function Layout({ children }: Prop) {
  const [connected, setConnected] = useState(false);
  const [contract, setContract] = useState<any>();
  const [signer, setSigner] = useState<any>();
  const [account, setAccount] = useState<string>("");
  const networks = {
    mumbai: {
      chainId: `0x${Number(80001).toString(16)}`,
      chainName: "Mumbai Testnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
      },
      rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
      blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
    }
} 
  const connect = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      if ((await signer.getChainId()) != 80001) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...networks["mumbai"],
            },
          ],
        });
      }
      const contract = new ethers.Contract(
        contract_address,
        contract_abi,
        signer
      );
      setSigner(signer);
      setContract(contract);
      setConnected(true);
      setAccount(await signer.getAddress());

    } catch (e) {
      alert(e);
    }
  };
  return (
    <dexContext.Provider
      value={{
        connect,
        contract,
        connected,
        signer,
        account
      }}
    >
      <NavBar />
      {children}
    </dexContext.Provider>
  );
}

