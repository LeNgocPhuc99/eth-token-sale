import React, { useState, useEffect } from "react";
import Web3 from "web3";

import { Button, FormControl, InputGroup, ProgressBar } from "react-bootstrap";

function App() {
  const [web3, setWeb3] = useState();
  const [tokenPrice, setPrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [tokensSold, setTokenSold] = useState(0);
  const [tokensAvailable, setTokenAvailable] = useState(0);
  const [account, setAccount] = useState("");
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
      setWeb3(web3);

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } else if (!window.web3) {
      window.alert("Metamask is not detected");
    }
  };

  const handleFormChange = (e) => {
    setAmount(e.target.value);
  };

  const handleOnClick = () => {
    console.log(amount);
  };

  return (
    <div className="container" style={{ width: 650 }}>
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
        <FormControl type="text" required onChange={handleFormChange} />
        <Button onClick={handleOnClick}>Buy Tokens</Button>
      </InputGroup>
      <br />
      <ProgressBar min={0} max={100} now={10} />
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
