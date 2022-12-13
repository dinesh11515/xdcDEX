import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Overall testing", function () {
    let contract : Contract;
    let token : Contract;
    let owner : SignerWithAddress;
    let addr1 : SignerWithAddress;
    let addr2 : SignerWithAddress;

    before(async () => {
        const BttDex = await ethers.getContractFactory("BttDEX");
        contract = await BttDex.deploy();
        await contract.deployed();
        console.log('contract address: ', contract.address);
        const tempToken = await ethers.getContractFactory("token");
        token = await tempToken.deploy();
        await token.deployed();
        console.log('token address: ', token.address);
        [owner, addr1, addr2] = await ethers.getSigners();
    })

    it("registration", async function () {
        let name = "dinesh aitham";
        let email = "dineshaitham2@gmail.com";
        let payments = [{appName:"paytm",userId:"8897230284@apaytm"},{appName:"phonepe",userId:"8897230284@ybl"}];
        let tx = await contract.register(name,email,payments);
        await tx.wait();
        let user = await contract.sellerPayments(owner.address);
        console.log('user: ', user);
    })

    it("sell", async function () {
        let amount = ethers.utils.parseEther("100");
        let price = ethers.utils.parseEther("10");
        let tx = await contract.sellBtt(amount,price,{value:amount});
        await tx.wait();
        console.log("sell btt")
        let listings = await contract.listings(0);
        let id = listings.listId;
        console.log(id)
        tx = await contract.connect(addr1).buyBttRequest(id,amount,"dnesh");
        await tx.wait();
        console.log("buy btt request")
        let initialBal = await addr1.provider?.getBalance(addr1.address)
        console.log('before balance', {initialBal: ethers.utils.formatEther(initialBal?.toString() || '0').toString()})
        tx = await contract.release(id);
        await tx.wait();
        let finalBal = await addr1.provider?.getBalance(addr1.address)
        console.log('after balance', {finalBal: ethers.utils.formatEther(finalBal?.toString() || '0').toString()})
    })

    it("sellAgain", async function () {
        let amount = ethers.utils.parseEther("100");
        let price = ethers.utils.parseEther("10");
        let tx = await contract.sellBtt(amount,price,{value:amount});
        await tx.wait();
        console.log("sell btt")
        let details = await contract.sellerList(owner.address);
        console.log(details)
    })



    it("sellToken", async function () {
        let amount = ethers.utils.parseEther("100");
        let price = ethers.utils.parseEther("10");
        let tx = await token.approve(contract.address,amount);
        await tx.wait();
        tx = await contract.sellToken(token.address,"Test",amount,price);
        await tx.wait();
        console.log("sell token")
        let listings = await contract.listings(1);
        let id = listings.listId;
        console.log(id)
        tx = await contract.connect(addr1).buyTokenRequest(id,amount,"dinesh");
        await tx.wait();
        let initialBal = await token.balanceOf(addr1.address);
        console.log("buy token request")
        console.log('before balance', {initialBal: ethers.utils.formatEther(initialBal?.toString() || '0').toString()})
        
        tx = await contract.release(id);
        await tx.wait();
        let finalBal = await token.balanceOf(addr1.address);
        console.log('after balance', {finalBal: ethers.utils.formatEther(finalBal?.toString() || '0').toString()})
    })
})
