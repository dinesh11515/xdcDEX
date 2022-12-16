import React, { useEffect } from "react";
import BuyingItem from "../../components/BuyingItem/BuyingItem";
import { useContext, useState } from "react";
import { dexContext } from "../../components/Layout/Layout";
import { ethers } from "ethers";
import { contract_address, contract_abi } from "../../constants/index";
import Loader from "../../components/Loader/Loader";

interface Data {
  tokenName: string;
  tokenAddress: string;
  amount: number;
  price: number;
  seller: string;
  matic: boolean;
}

const BuyingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<Data[]>([]);

  const getData = async () => {
    try {
      setIsLoading(true);
      const provider = new ethers.providers.JsonRpcProvider(
        "https://erpc.apothem.network/"
      );
      const contract = new ethers.Contract(
        contract_address,
        contract_abi,
        provider
      );
      const data = await contract.allListings();
      console.log(data);
      setData(data);
    } catch (e) {
      alert(e);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="h-screen bg-[#1e1e1e] bg-[url('/bg2.png')] bg-center overflow-hidden">
      <div className="w-[90%] mx-auto py-28">
        <h2 className="font-Grotesk text-3xl font-semibold mb-8 text-center bg-gradient-to-r text-transparent bg-clip-text from-[#FD42FB] via-[#CD9ECD] to-[#753FF3]">
          Get Your Required Crypto with a Single Click.
        </h2>
        <div className="w-[80%] h-full mx-auto border border-gray-400 rounded-xl p-2 ">
          <div className="flex gap-40 justify-center py-5 font-Grotesk text-lg text-gray-400 bg-blur bg-[#313131]/10 uppercase tracking-wider">
            <h2 className="-ml-8">Name</h2>
            <h2>Quantity</h2>
            <p>Price</p>
            <p>Buy</p>
          </div>

          {isLoading && <Loader />}

          <div className="">
            {data &&
              data.map(
                (item, index) =>
                  item.amount > 0 && (
                    <BuyingItem
                      key={index}
                      name={item.tokenName}
                      price={item.price}
                      quantity={item.amount}
                      seller={item.seller}
                      id={index}
                      matic={item.matic}
                    />
                  )
              )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyingPage;
