import Image from "next/image";
import React from "react";

const data = [
  {
    id: 1,
    img: "/register2.png",

    title: "Create an account",
    subtitle: "Generate a secure wallet in seconds.",
    text: "Or sign up with web3. polyDex supports all the ethereum wallets like Metamask and Ledger.",
  },
  {
    id: 2,
    img: "/buying.png",
    title: "See who's buying and selling",
    subtitle:
      "Anyone can post an ad to buy or sell crypto. Find a buyer or seller who suits you, or publish your own ad.",
    text: "You can filter offers by payment method, currency, price, location, and more.",
  },
  {
    id: 3,
    img: "/trade.png",
    title: "Open a trade",
    subtitle:
      "When you find an ad you're happy with, open a trade. Choose the amount you want to buy or sell, then lock in an exchange rate.",
    text: "The other party will receive a notification and you'll typically hear back in less than 120 seconds.",
  },
  {
    id: 4,
    img: "/exchange.png",
    title: "Make the exchange",
    subtitle:
      "After the seller puts the crypto in an escrow account, the buyer pays the seller outside the platform. Users discuss payment details using encrypted messages.",
    text: "A decentralized escrow account holds the crypto in trust until it's paid for. This ensures both sides hold up their end of the deal.",
  },
  // {
  //   id: 5,
  //   img: "/register.png",
  //   title: "Create an account",
  //   subtitle: "Generate a secure wallet in seconds.",
  //   text: "Or sign up with web3. BitTorrent Dex supports all the ethereum wallets like Metamask and Ledger.",
  // },
];

const AboutItem: React.FC<{
  id: number;
  img: string;
  title: string;
  subtitle: string;
  text: string;
}> = ({ id, img, title, subtitle, text }) => {
  return (
    <section className="border rounded-2xl bg-[#1e1e1e]/30 backdrop-blur-2xl border-gray-700 px-6 pb-5 w-[30rem] relative shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] ">
      <div className="absolute h-14 w-14 top-4 text-white font-Grotesk text-xl flex justify-center items-center  rounded-full bg-gray-500 ">
        {id}
      </div>
      <Image
        src={img}
        width={300}
        height={300}
        className="object-contain mx-auto"
        alt={title}
      />
      <h2 className="text-white font-Grotesk text-2xl mt-4">{title}</h2>
      <p className="text-gray-400 mb-2">{subtitle}</p>
      <p className="text-gray-500">{text}</p>
    </section>
  );
};

const About: React.FC = () => {
  return (
    <section className="bg-[#1e1e1e] min-h-screen bg-[url('/bg2.png')] bg-center bg-fixed py-10">
      <div className="w-[85%] mx-auto pt-20">
        <h2 className="text-center text-4xl font-Grotesk font-semibold mb-3 bg-gradient-to-r text-transparent bg-clip-text from-[#FD42FB] via-[#CD9ECD] to-[#753FF3]">
          How to Trade?
        </h2>

        <p className="text-center text-gray-300 font-Grotesk mb-12">
          Peer-to-peer trading has never been easier{" "}
        </p>

        {/* Right */}
        <div className=" flex flex-wrap justify-evenly gap-10">
          {data.map((item) => (
            <AboutItem
              key={item.id}
              id={item.id}
              img={item.img}
              title={item.title}
              subtitle={item.subtitle}
              text={item.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
