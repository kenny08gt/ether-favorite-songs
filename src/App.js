import React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/EtherFavoriteSongs.json";

class App  extends React.Component {


  constructor(props) {
    super(props);
    this.contractAddress = "0x03b1b7dD8aFC15979acFBCE3d27221a52C4109db";
    this.contractABI = abi.abi;
    this.total = 0;
  
    // const [currentAccount, setCurrentAccount] = useState("");
    this.state = {url: 'https://open.spotify.com/track/1zdsOgv1hdGGGe9CK1QPY7?si=0a7b6acefd8d4dc5',
    account: null,
    total: 0,
    mining: false};
     this.handleChange = this.handleChange.bind(this);

    this.checkIfWalletIsConnected();
  }

  handleChange(event) {
    this.setState({url: event.target.value});
  }

  setCurrentAccount = (account) => {
    console.log(account);
    this.setState({ account: account });
  }
   
  checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        this.setCurrentAccount(account);
        this.getTotal();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      this.setCurrentAccount(accounts[0]); 
      this.getTotal();
    } catch (error) {
      console.log(error)
    }
  }

  getTotal = async () => {
    console.log('get total');
    const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const favoriteSongsPortalContract = new ethers.Contract(this.contractAddress, this.contractABI, signer);

        let count = await favoriteSongsPortalContract.getTotalSongs();
        this.setState({total: count.toNumber()});
        console.log(this.state.total);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
  }
  
  wave = async () => {
     try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const favoriteSongsPortalContract = new ethers.Contract(this.contractAddress, this.contractABI, signer);

        let count = await favoriteSongsPortalContract.getTotalSongs();
        console.log("Retrieved total wave count...", count.toNumber());

                /*
        * Execute the actual wave from your smart contract
        */
        this.setState({ minign: true });
        const waveTxn = await favoriteSongsPortalContract.addSong(this.state.url);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        this.setState({ minign: false });

        count = await favoriteSongsPortalContract.getTotalSongs();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  render = ()=>{
    let buttonsClasses = "waveButton";
    if(this.state.minign) {
      buttonsClasses += " loading";
    }
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        Hello there you human being with super good music taste
        </div>

        <div className="bio">
        Let's build something great together!. Add your favorite song in spotify. <br/>
        Let's build the greatest playlist of all time.
        </div>

        <input type="url" name="url" value={this.state.url} onChange={this.handleChange} placeholder="link to the super cool song"/>
       
        <button className={buttonsClasses} onClick={this.wave}>
          Share my song to the blockchain!
        </button>
        {/*
        * If there is no currentAccount render this button
        */}
        {!this.state.account && (
          <button className="waveButton" onClick={this.connectWallet}>
            Connect Wallet
          </button>
        )}
        {this.state.minign && (
          <strong>Loading...</strong>
        )}
        <div>
          <h2>Songs added: {this.state.total}</h2>
        </div>
      </div>
    </div>
  );
  }
}

export default App;
