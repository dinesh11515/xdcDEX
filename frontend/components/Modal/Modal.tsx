import Image from "next/image";
import React, { useRef, useState,useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import { contract_address, contract_abi } from "../../constants/index";

const Backdrop: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div
      onClick={onClose}
      className="fixed top-0 left-0  h-screen w-screen bg-black/80"
    ></div>
  );
};

interface Payment {
  appName : string;
  userId : string;
}
const Modal: React.FC<{
  onClose: () => void;
  tokenName: string;
  tokenPrice: string;
  tokenQuantity: string;
  seller:string;
  id:number;

  buyItem: (id: number, amount: BigNumber, name: string) => void;
}> = ({ tokenName, tokenPrice, tokenQuantity, onClose ,buyItem,seller,id}) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const quantitynputRef = useRef<HTMLInputElement>(null);
  const [price,setPrice] = useState<string>("0");
  const [data, setData] = useState<Payment[]>([]);

  const getData = async () => {
    try{
      const provider = new ethers.providers.JsonRpcProvider("https://erpc.apothem.network/");
      const contract = new ethers.Contract(
        contract_address,
        contract_abi,
        provider
      );
      const data = await contract.sellerPayments(seller);
      console.log(data);
      setData(data);
    }
    catch(e){
      alert(e);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const modalSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    let enteredName = nameInputRef.current!.value;
    let enteredQuantity = quantitynputRef.current!.value;

    if (!enteredName || !enteredQuantity)
      return alert("Please enter input fields");
    console.log(id)
    buyItem(id,ethers.utils.parseEther(enteredQuantity as string),enteredName);
  };

  const handleTokenQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    let enteredQuantity = event.target.value;
    let enteredPrice = tokenPrice;
    let total = Number(enteredQuantity) * Number(enteredPrice);
    setPrice(total.toString());
  };



  return (
    <>
      <Backdrop onClose={onClose} />
      <section className="rounded-2xl bg-gray-200/30 backdrop-blur-xl p-8 w-[30rem] max-h-[33rem] overflow-scroll fixed left-[50%] top-[55%] -translate-x-[50%] -translate-y-[50%]  mx-auto">
        <div className="bg-[#1e1e1e] rounded-lg py-3 px-5">
          <h2 className="text-gray-400 font-semibold mb-2">
            Token Name:{" "}
            <span className="text-lg text-white ml-2">{tokenName}</span>{" "}
          </h2>
          <h2 className="text-gray-400 font-semibold mb-2">
            Token Price:{" "}
            <span className="text-lg text-white ml-2">{tokenPrice}</span>{" "}
          </h2>
          <h2 className="text-gray-400 font-semibold ">
            Available Tokens:{" "}
            <span className="text-lg text-white ml-2">{tokenQuantity}</span>
          </h2>
        </div>

        <form>
          <div className="flex flex-col mt-6">
            <label className="font-sm text-white font-Grotesk">Name</label>
            <input
              required
              ref={nameInputRef}
              className="p-3 rounded-lg text-gray-700"
              type="text"
              placeholder="John Doe"
            />
          </div>

          <div className="flex flex-col my-3">
            <label className="font-sm text-white font-Grotesk">
              Token Quantity
            </label>
            <input
              required
              ref={quantitynputRef}
              className="p-3 rounded-lg text-gray-700"
              type="number"
              placeholder="0"
              onChange={handleTokenQuantity}
            />
          </div>

          <div className="flex flex-col my-3">
            <label className="font-sm text-white font-Grotesk">
              Price
            </label>
            <input
              className="p-3 rounded-lg text-gray-700 bg-gray-300 cursor-not-allowed"
              type="text"
              disabled
              placeholder="0"
              value={price + " $"}
              readOnly
            />
          </div>

          <div>
            <p className="font-sm text-white font-Grotesk">Payments</p>
            { data && data.map((item,index) => {
              return(
                <div key={index} className="flex flex-wrap items-center mt-5 gap-6">
                  <div className="cursor-pointer border border-gray-300 py-1 px-6 bg-gray-200 rounded-lg hover:bg-white">
                    <Image src={`/${item.appName}.png`} width={30} height={30} alt="gpay" />
                  </div>
                  <p className="text-lg text-gray-300">{item.userId}</p>
                </div>
              )
            })}
            
          </div>
          <div className="mt-4">
            <p className="text-white">After paying the seller you can request the tokens</p>
          </div>
      
          <button
            type="submit"
            className="w-full bg-[#1e1e1e] text-gray-300 uppercase font-Grotesk tracking-wider py-3 mt-5 rounded-xl"
            onClick={modalSubmitHandler}
          >
            Request
          </button>
        </form>
      </section>
    </>
  );
};

export default Modal;
