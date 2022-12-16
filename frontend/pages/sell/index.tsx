import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { dexContext } from "../../components/Layout/Layout";
import { ethers, Signer } from "ethers";
import {
  erc20abi,
  contract_address,
  contract_abi,
} from "../../constants/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SellingFrom: React.FC = () => {
  const { contract, connect, connected, signer }: any = useContext(dexContext);

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [price, setPrice] = useState<string>();
  const tokenAddressInputRef = useRef<HTMLInputElement>(null);
  const tokenNameInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const [dataUrl, setDataUrl] = useState<string>("");
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const checkboxHandler = () => {
    setIsChecked(!isChecked);
  };
  

 
  const registerHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    let enteredPrice = priceInputRef.current!.value;
    let enteredAmount = amountInputRef.current!.value;
    let enteredTokenAdd = tokenAddressInputRef.current?.value;
    let enteredTokenName = tokenNameInputRef.current?.value;

    if (enteredPrice.length === 0 || enteredAmount.length === 0) return;

    if (!isChecked && !enteredTokenAdd && !enteredTokenName)
      return alert("Enter Token Address and Token Name or use Matic Token");

    try {
      if (isChecked) {
        const price = ethers.utils.parseEther(enteredPrice);
        const amount = ethers.utils.parseEther(enteredAmount);
        const tx = await contract.sellMatic(amount, price, { value: amount });
      } else {
        const price = ethers.utils.parseEther(enteredPrice);
        const amount = ethers.utils.parseEther(enteredAmount);
        const tokenContract = new ethers.Contract(
          enteredTokenAdd as string,
          erc20abi,
          signer
        );
        let tx = await tokenContract.approve(contract_address, amount);
        tx = await contract.sellToken(
          enteredTokenAdd,
          enteredTokenName,
          amount,
          price
        );
      }
      toast.success("Token Listed Successfully");
    } catch (error) {
      alert(error);
    }
  };

  

  

  const labelStyle: string =
    "font-semibold text-sm mb-1 text-gray-300  w-full flex items-center ";
  const inputStyle: string =
    "border border-gray-400 p-2 w-full rounded-lg mb-3";

  return (
    <div className="w-full  flex flex-col bg-[#1e1e1e]   items-center h-screen bg-[url('/bg2.png')] bg-center  justify-center   gap-10">
      <div className="flex-[0.67]  p-8 rounded-xl mt-24 border border-gray-500 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]">
        <p className="text-4xl font-Grotesk font-semibold mb-8 bg-gradient-to-r text-transparent bg-clip-text from-[#FD42FB] via-[#CD9ECD] to-[#753FF3]">
          Sell any XDC Chain Token
        </p>

        {/* Form */}
        <form onSubmit={registerHandler}>
          <p className="mb-1 text-gray-300">
            👇 Select this if you are selling XDC token
          </p>
          <div className="py-3 ">
            <label
              className={`${labelStyle} font-Grotesk cursor-pointer w-fit `}
            >
              <input
                onChange={checkboxHandler}
                className="inline-block h-4 w-4 mr-2 rounded-lg "
                type="checkbox"
                id="btt"
                value="btt"
                checked={isChecked}
              />
              XDC Token
            </label>
          </div>

          <label htmlFor="token-address" className={labelStyle}>
            Token Address
          </label>
          <input
            ref={tokenAddressInputRef}
            className={inputStyle}
            type="text"
            id="token-address"
            placeholder="0x000000000000000"
          />
          <label htmlFor="token-name" className={labelStyle}>
            Token Name
          </label>
          <input
            ref={tokenNameInputRef}
            className={inputStyle}
            type="text"
            id="token-name"
            placeholder="XDC"
          />
          <div className="flex gap-10">
            <div className="flex flex-col ">
              <label htmlFor="price" className={labelStyle}>
                Price
              </label>
              <input
                required
                ref={priceInputRef}
                className={`border border-gray-400 p-2 w-[18rem] rounded-lg`}
                id="price"
                type="text"
                placeholder="0.12"
              />
            </div>

            <div className="flex flex-col ">
              <label htmlFor="amount" className={labelStyle}>
                Amount
              </label>
              <input
                required
                ref={amountInputRef}
                className={`border border-gray-400 p-2 w-[18rem] rounded-lg`}
                type="text"
                id="amount"
                placeholder="2"
              />
            </div>
          </div>
          {showWarning && (
            <p className="text-red-500 font-medium mt-2">
              Warning: Your price of token should range between{" "}
              {(Number(price) - 0.1).toFixed(2)} to{" "}
              {(Number(price) + 0.1).toFixed(2)}
            </p>
          )}
          {connected ? (
            <button
              className="mt-10  bg-gray-600 text-white text-lg px-20 uppercase py-2 rounded-md font-Grotesk font-medium hover:scale-105 hover:bg-gray-300 hover:text-black"
              type="submit"
            >
              Sell
            </button>
          ) : (
            <button
              className="mt-10  bg-gray-600 text-white text-lg px-20 uppercase py-2 rounded-md font-Grotesk font-medium hover:scale-105 hover:bg-gray-300 hover:text-black"
              type="button"
              onClick={connect}
            >
              Connect Wallet
            </button>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SellingFrom;
