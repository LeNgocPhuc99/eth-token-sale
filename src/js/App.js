import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DappTokenSale from "../abis/DappTokenSale.json";
import DappToken from "../abis/DappToken.json";

import {
  Button,
  FormControl,
  InputGroup,
  ProgressBar,
  Navbar,
  Nav,
  Container,
} from "react-bootstrap";

function App() {
  const tokensAvailable = 750000;
  const [tokenPrice, setPrice] = useState("");
  const [balance, setBalance] = useState(0);
  const [tokensSold, setTokenSold] = useState(0);
  const [account, setAccount] = useState("");
  const [tokenContract, setTokenContract] = useState();
  const [saleContract, setSaleContract] = useState();
  const [amount, setAmount] = useState();

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
        let price = await saleContract.methods.tokenPrice().call();
        price = Web3.utils.fromWei(price.toString(), "ether");
        setPrice(price.toString());
        const tokensSold = await saleContract.methods.tokensSold().call();
        setTokenSold(tokensSold);
      } else {
        window.alert(
          "Dapp Token Sale contract is not deployed on this network"
        );
      }
    } else if (!window.web3) {
      window.alert("Metamask is not detected");
    }
  };

  const reloadData = async () => {
    const balance = await tokenContract.methods.balanceOf(account).call();
    setBalance(balance);
    const tokensSold = await saleContract.methods.tokensSold().call();
    setTokenSold(tokensSold);
  };

  const buyTokens = () => {
    saleContract.methods
      .buyTokens(amount)
      .send({
        value: window.web3.utils.toWei(String(amount * tokenPrice), "ether"),
        from: account,
      })
      .on("receipt", function () {
        reloadData();
      });
  };

  const handleFormChange = (e) => {
    setAmount(e.target.value);
  };

  return (
    <div className="container">
      <Navbar bg="dark" variant="dark">
        <Nav className="me-auto">
          <Nav.Link href="#">
            <span>Your're account: {account}</span>
          </Nav.Link>
        </Nav>
      </Navbar>
      <div className="col-lg-12">
        <h1 className="text-center">DAPP TOKEN ICO SALE</h1>
        <hr />
        <br />
      </div>
      <p>
        DAPP token price is <span className="token-price">{tokenPrice}</span>{" "}
        Ether.
        <br />
        You currently have <span className="dapp-balance">{balance}</span> DAPP.
      </p>
      <InputGroup>
        <FormControl
          type="text"
          required
          onChange={handleFormChange}
          placeholder="Number of tokens"
        />
        <Button onClick={buyTokens}>Buy Tokens</Button>
      </InputGroup>
      <br />
      <ProgressBar min={0} max={100} now={tokensSold / tokensAvailable} />
      <br />
      <p>
        <span className="tokens-sold">{tokensSold}</span> /{" "}
        <span className="tokens-available">{tokensAvailable}</span> tokens sold
      </p>
    </div>
  );
}

export default App;
