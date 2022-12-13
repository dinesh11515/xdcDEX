import React, { useState } from "react";
import { BigNumber, ethers } from "ethers";
import Modal from "../Modal/Modal";
import { useContext, useEffect } from "react";
import { dexContext } from "../../components/Layout/Layout";
import {Web3Storage} from "web3.storage";

const BuyingItem: React.FC<{
  name: string;
  quantity: number;
  price: number;
  seller: string;
  id: number;
  matic: boolean;
}> = ({ name, quantity, price, seller, id, matic }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { contract, signer, account }: any = useContext(dexContext);
  const [dataUrl,setDataUrl] = useState<string>("");


  const buyItemHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  function getFormatedAmount(amount: number) {
    return ethers.utils.formatEther(amount).toString();
  }
  function makeFileObjects (data :any) {
    const obj = data;
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
  
    const files = [
      new File([blob], 'data.json')
    ]
    return files
  }

  //uploadig data to IPFS
  const storeContent = async (data : any) => {
    const web3storage_key = process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY;
    const client = new Web3Storage({ token: web3storage_key || ""});
    const files = makeFileObjects(data);
    const cid = await client.put([files[0]]);
    const url = ("ipfs://"+cid+"/data.json");
    setDataUrl(url);
    return cid;
  };

  const buyItem = async (id: number, amount: BigNumber, name: string) => {
    try {
      let data : any = [];
      data.push({name: name, amount: amount.toString(), seller: seller, buyer: account});
      const cid = await storeContent(data);
      console.log(cid);
      if (matic) {
        const tx = await contract.buyMaticRequest(id, amount, name);
        await tx.wait();
      } else {
        const tx = await contract.buyTokenRequest(id, amount, name);
        await tx.wait();
      }
      alert("Item bought successfully!");
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="flex items-center text-gray-400 py-3  rounded mt-2 bg-blur bg-[#474747]/30">
      <h2 className=" flex-[0.25] text-center font-semibold text-white">
        {name}
      </h2>
      <p className="flex-[0.25] text-center">{getFormatedAmount(quantity)}</p>
      <p className="flex-[0.25] text-center text-white font-Grotesk">
        <span className="text-green-400 font-semibold">$</span>{" "}
        {getFormatedAmount(price)}
      </p>
      <button
        className="py-2 flex-[0.2] w-[8rem] rounded-lg text-white text-lg font-semibold bg-gray-700 hover:bg-gray-500"
        onClick={buyItemHandler}
      >
        Buy
      </button>

      {showModal && (
        <Modal
          onClose={closeModalHandler}
          tokenName={name}
          tokenPrice={getFormatedAmount(price)}
          tokenQuantity={getFormatedAmount(quantity)}
          buyItem={buyItem}
          seller={seller}
          id={id}
        />
      )}
    </div>
  );
};

export default BuyingItem;
