//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract  polyDEX {

    uint256 orderId;
    uint256 listId;

    struct payment {
        string appName;
        string userId;
    }

    struct Seller{
        address payable seller;
        string name;
        string email;
    }

    struct buyRequest{
        address payable buyer;
        address payable seller;
        address tokenAddress;
        bool matic;
        bool fulfilled;
        bool paid;
        bool cancelled;
        bool report;
        uint256 amount;
        uint256 price;
        uint256 orderId;
        string buyerName;
        string tokenName;
    }

    struct SellerList {
        address payable seller;
        address tokenAddress;
        string tokenName;
        bool matic;
        uint256 listId;
        uint256 amount;
        uint256 locked;
        uint256 price;
        uint256 time;
    }

    mapping (address => Seller) public sellers;
    mapping (address => mapping (address => SellerList)) public tokenSellerList;
    mapping (address => SellerList) public sellerList;
    mapping (address => payment[]) public paymentsOfSeller;
    mapping (address => buyRequest[]) public buyRequests;
    mapping (uint256 => buyRequest) public orders;
    mapping (address => buyRequest[]) public userRequests;
    
    event request(address indexed seller,string buyerName,string tokenName, uint256 amount, uint256 price, uint256 orderId);
    
    SellerList[] public listings;

    AggregatorV3Interface internal priceFeed;

    constructor(){
        priceFeed = AggregatorV3Interface(0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada);
    }
    
    function register(string memory _name, string memory _email,payment[] memory _payments) public {
        require (sellers[msg.sender].seller == address(0), "You are already registered");
        sellers[msg.sender] = Seller(payable(msg.sender),_name,_email);
        for(uint8 i = 0; i < _payments.length; i++){
            paymentsOfSeller[msg.sender].push(_payments[i]);
        }
    }

    function sellMatic(uint256 amount,uint256 price) public payable {
        require(msg.value == amount, "You must send the exact amount");
        if(sellerList[msg.sender].seller != msg.sender){
            sellerList[msg.sender] = SellerList(payable(msg.sender), address(0),"MATIC",true,listId, amount,0, price, block.timestamp);
            listings.push(sellerList[msg.sender]);
            listId++;
        }
        else{
            sellerList[msg.sender].amount += amount;
            sellerList[msg.sender].price = price;
            sellerList[msg.sender].time = block.timestamp;
            listings[sellerList[msg.sender].listId] = sellerList[msg.sender];
        }
    }

    function sellToken(address tokenAddress,string memory tokenName, uint256 amount,uint256 price) public {
        IERC20 token = IERC20(tokenAddress);
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        if(tokenSellerList[msg.sender][tokenAddress].seller != msg.sender){
            tokenSellerList[msg.sender][tokenAddress] = SellerList(payable(msg.sender), tokenAddress,tokenName,false,listId, amount,0, price, block.timestamp);
            listings.push(tokenSellerList[msg.sender][tokenAddress]);
            listId++;
        }
        else{
            tokenSellerList[msg.sender][tokenAddress].amount += amount;
            tokenSellerList[msg.sender][tokenAddress].price = price;
            tokenSellerList[msg.sender][tokenAddress].time = block.timestamp;
            listings[tokenSellerList[msg.sender][tokenAddress].listId] = tokenSellerList[msg.sender][tokenAddress];
        }
    }

    function buyMaticRequest(uint256 id,uint256 amount,string memory _name) public payable {
        require(listings[id].amount >= amount, "Not enough tokens");
        address payable seller = listings[id].seller;
        require(seller != address(0), "Seller not found");
        buyRequests[seller].push(buyRequest(payable(msg.sender),seller,address(0),true,false,true,false,false,amount,listings[id].price,orderId,_name,"MATIC"));
        orders[orderId] = buyRequests[seller][buyRequests[seller].length-1];
        userRequests[msg.sender].push(buyRequests[listings[id].seller][buyRequests[listings[id].seller].length - 1]);
        sellerList[listings[id].seller].amount -= amount;
        sellerList[listings[id].seller].locked += amount;
        listings[id] = sellerList[listings[id].seller];
        emit request(seller,_name,"MATIC",amount,listings[id].price,orderId);
        orderId++;
    }

    function buyTokenRequest(uint256 id,uint256 amount,string memory _name) public {
        require(listings[id].amount >= amount, "Not enough tokens");
        SellerList memory listing = tokenSellerList[listings[id].seller][listings[id].tokenAddress];
        require(listing.seller != address(0), "Seller not found");
        buyRequests[listing.seller].push(buyRequest(payable(msg.sender),listings[id].seller,listings[id].tokenAddress,false,false,true,false,false,amount,listing.price,orderId,_name,listings[id].tokenName));
        orders[orderId] = buyRequests[listing.seller][buyRequests[listing.seller].length - 1];
        userRequests[msg.sender].push(buyRequests[listing.seller][buyRequests[listing.seller].length - 1]);
        tokenSellerList[listings[id].seller][listings[id].tokenAddress].amount -= amount;
        tokenSellerList[listings[id].seller][listings[id].tokenAddress].locked += amount;
        listings[id] = tokenSellerList[listings[id].seller][listings[id].tokenAddress];
        emit request(listing.seller,_name,listing.tokenName,amount,listing.price,orderId);
        orderId++;
    }

    function release(uint256 id) public {
        require(orders[id].seller == msg.sender, "You are not the seller");
        require(orders[id].fulfilled == false, "Order fulfilled");
        if(orders[id].matic == true){
            orders[id].buyer.transfer(orders[id].amount);
            sellerList[orders[id].seller].locked -= orders[id].amount;
            listings[sellerList[orders[id].seller].listId] = sellerList[orders[id].seller];
            buyRequests[orders[id].seller][sellerList[orders[id].seller].listId].fulfilled = true;
        }
        else{
            IERC20 token = IERC20(orders[id].tokenAddress);
            require(token.transfer(orders[id].buyer, orders[id].amount), "Token transfer failed");
            tokenSellerList[orders[id].seller][orders[id].tokenAddress].locked -= orders[id].amount;
            listings[tokenSellerList[orders[id].seller][orders[id].tokenAddress].listId] = tokenSellerList[orders[id].seller][orders[id].tokenAddress];
            buyRequests[orders[id].seller][tokenSellerList[orders[id].seller][orders[id].tokenAddress].listId].fulfilled = true;
        }
        orders[id].fulfilled = true;
    }
    
    function sellerPayments(address seller) public view returns (payment[] memory){
        return paymentsOfSeller[seller];
    }

    function allListings() public view returns (SellerList[] memory){
        return listings;
    }

    function getRequests(address seller) public view returns (buyRequest[] memory){
        return buyRequests[seller];
    }

    function getLatestPrice() public view returns (int) {
        (,int price,,,) = priceFeed.latestRoundData();
        return price;
    }

    receive() external payable {}
}