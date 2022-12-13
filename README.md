## polyDex

A Peer to peer decentralised crypto marketplace where user can sell and buy polygon chain cryptocurrencies using any payment method.

[Demo link](https://poly-dex.vercel.app/)

[Demo Video](https://youtu.be/L6UVnMeqW-A)

### Technologies Used :

#### IPFS :
-> Data was uploaded to IPFS  ([code1](https://github.com/dinesh11515/polyDEX/blob/main/frontend/components/BuyingItem/BuyingItem.tsx#L42)) 
([code2](https://github.com/dinesh11515/polyDEX/blob/main/frontend/pages/sell/index.tsx#L38))
([code3](https://github.com/dinesh11515/polyDEX/blob/main/frontend/pages/register/index.tsx#L46))

-> polyDex was deployed on Filecoin using Spheron


#### Polygon :
Smarts contracts are deployed to polygon mumbai testnet ([contract link](https://mumbai.polygonscan.com/address/0x91bc266aa852340cBCEF51DDb2D63C523d96F8A0#code))

#### Chainlink Services :
Used Chainlink datafeeds for getting price data of Polygon ([code](https://github.com/dinesh11515/polyDEX/blob/main/contracts/polyDEX.sol#L4))

## What it does
polyDex enables users to sell and buy polygon chain cryptocurrencies using any payment method like paytm,paypal,phonepe and google pay etc.

## How we built it
polyDex was built by using Next and TailwindCSS for frontend
* Solidity for smart contracts and hardhat for testing and deploying the smart contracts to Mumbai testnet
* It uses web3.storage for storing data in IPFS 
* polyDex was hosted on Filecoin using Spheron

## What we learned
* Uploading and retrieving the data From IPFS.
* Learnt integration of chianlink data feeds in smart contract
## What's next for polyDex
Right now  polyDex was only available in Polygon chain,adding more chains was the future plan