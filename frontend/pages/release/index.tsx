import React from "react";
import ReleaseItem from "../../components/ReleaseItem/ReleaseItem";
import { useContext, useState, useEffect } from "react";
import { dexContext } from "../../components/Layout/Layout";
import { ethers } from "ethers";
import { contract_address, contract_abi } from "../../constants/index";
import Loader from "../../components/Loader/Loader";

interface Data {
  buyerName: string;
  tokenName: string;
  amount: number;
  price: number;
}

const ReleasePage = () => {
  const { contract, signer, account }: any = useContext(dexContext);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getData = async () => {
    try {
      setIsLoading(true);
      const data = await contract.getRequests(account);

      setData(Object.entries(data));
      console.log(data);
    } catch (e) {
      alert(e);
    }

    setIsLoading(false);
  };

  const releaseItem = async (id: number) => {
    try {
      const tx = await contract.release(id);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    if (contract) {
      getData();
    }
  }, [account]);
  return (
    <section className="h-screen bg-[#1e1e1e] bg-[url('/bg2.png')] bg-center overflow-hidden">
      <div className="w-[90%] mx-auto py-28">
        <h2 className="font-Grotesk text-3xl font-semibold mb-8 text-center bg-gradient-to-r text-transparent bg-clip-text from-[#FD42FB] via-[#CD9ECD] to-[#753FF3]">
          Release your crypto here!
        </h2>
        <div className="w-[80%] h-full mx-auto border border-gray-400 rounded-xl p-2 ">
          <div className="flex justify-around py-5 font-Grotesk text-lg text-gray-400 bg-blur bg-[#313131]/10 uppercase tracking-wider">
            <h2>Token</h2>
            <h2>Quantity</h2>
            <p>Price</p>
            <p>Release</p>
          </div>

          {isLoading && <Loader />}

          <div className="">
            {account ? (
              data.map(
                (item, index) =>
                  !item[1].fulfilled && (
                    <ReleaseItem
                      key={index}
                      sellerName={item[1].buyerName}
                      tokenName={item[1].tokenName}
                      price={item[1].price}
                      quantity={item[1].amount}
                      id={item[1].orderId}
                      releaseItem={releaseItem}
                    />
                  )
              )
            ) : (
              <div className="text-center text-white font-Grotesk text-2xl mt-4">
                Please connect your wallet
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReleasePage;
