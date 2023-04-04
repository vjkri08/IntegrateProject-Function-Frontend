import {useState, useEffect} from "react";
import {ethers} from "ethers";
import bank_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [metWallet, setMetWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [bank, setBank] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const bankABI = bank_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setMetWallet(window.ethereum);
    }

    if (metWallet) {
      const account = await metWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!metWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await metWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(metWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, bankABI, signer);
 
    setBank(atmContract);
  }

  const getBalance = async() => {
    if (bank) {
      setBalance((await bank.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (bank) {
      let tx = await bank.deposit(2);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (bank) {
      let tx = await bank.withdraw(2);
      await tx.wait()
      getBalance();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!metWallet) {
      return <p>Please install Metamask in order to use this Bank.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account address: {account}</p>
        <p>Your Account Balance: {balance}</p>
        <button onClick={deposit}>Deposit 2 ETH</button>
        <button onClick={withdraw}>Withdraw 2 ETH</button>
      </div>
    )
  }

  useEffect(() => {getWallet(); getBalance();}, [balance]);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters Digital Bank!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: left
        }
      `}
      </style>
    </main>
  )
}
