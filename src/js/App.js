import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DappTokenSale from "../abis/DappTokenSale.json";
import DappToken from "../abis/DappToken.json";

import { Button, FormControl, InputGroup, ProgressBar } from "react-bootstrap";

function App() {
  const tokensAvailable = 750000;
  const [tokenPrice, setPrice] = useState("");
  const [balance, setBalance] = useState(0);
  const [tokensSold, setTokenSold] = useState(0);
  const [account, setAccount] = useState("");
  const [tokenContract, setTokenContract] = useState();
  const [saleContract, setSaleContract] = useState();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      window.web3 = new Web3(window.ethereum);
      // connect to metamask
      let web3 = window.web3;

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const saleContractData = DappTokenSale.networks[networkId];
      const tokenContractData = DappToken.networks[networkId];
      // load token contract
      if (tokenContractData) {
        let web3 = window.web3;
        const tokenContract = new web3.eth.Contract(
          DappToken.abi,
          tokenContractData.address
        );
        setTokenContract(tokenContract);
        const balance = await tokenContract.methods
          .balanceOf(accounts[0])
          .call();
        setBalance(balance);
      } else {
        window.alert("Dapp Token contract is not deployed on this network");
      }
      // load token sale contract
      if (saleContractData) {
        let web3 = window.web3;
        const saleContract = new web3.eth.Contract(
          DappTokenSale.abi,
          saleContractData.address
        );
        setSaleContract(saleContract);
        const price = await saleContract.methods.tokenPrice().call();
        setPrice(price);
        const tokenSole = await saleContract.methods.tokensSold().call();
        setTokenSold(tokenSole);
      } else {
        window.alert(
          "Dapp Token Sale contract is not deployed on this network"
        );
      }
    } else if (!window.web3) {
      window.alert("Metamask is not detected");
    }
  };

  const handleFormChange = (e) => {
    setAmount(e.target.value);
  };

  const handleOnClick = () => {
    console.log(amount);
    console.log(saleContract);
  };

  return (
    <div className="container" style={{ width: 650 }}>
      <div className="col-lg-12">
        <h1 className="text-center">DAPP TOKEN ICO SALE</h1>
        <hr />
        <br />
      </div>
      <p>
        DAPP token price is{" "}
        <span className="token-price">
          {Web3.utils.fromWei(tokenPrice, "ether")}
        </span>{" "}
        Ether.
        <br />
        You currently have <span className="dapp-balance">{balance}</span> DAPP.
      </p>
      <InputGroup>
        <FormControl type="text" required onChange={handleFormChange} />
        <Button onClick={handleOnClick}>Buy Tokens</Button>
      </InputGroup>
      <br />
      <ProgressBar min={0} max={100} now={tokensSold / tokensAvailable} />
      <br />
      <p>
        <span className="tokens-sold">{tokensSold}</span> /{" "}
        <span className="tokens-available">{tokensAvailable}</span> tokens sold
      </p>
      <p>Your's account: {account}</p>
    </div>
  );
}

export default App;
