"use client";

import { useState, useEffect, useRef } from "react";
import { Contract, ethers } from 'ethers';
import styles from './page.module.css'
import { NFT_CONTRACT_ADDRESS, abi } from "../../constants"
import Head from "next/head";
import Web3Modal from "web3modal";
import Image from "next/image";


export default function Home() {
  /* `const [walletConnected, setWalletConnected] = useState(false);` is using the `useState` hook to
  declare a state variable called `walletConnected` and its corresponding setter function
  `setWalletConnected`. The initial value of `walletConnected` is set to `false`. This state
  variable can be used to keep track of whether a wallet is connected or not in the component. */
  const [walletConnected, setWalletConnected] = useState(false);
  /* `const [loading, setLoading] = useState(false);` is using the `useState` hook to declare a state
  variable called `loading` and its corresponding setter function `setLoading`. The initial value of
  `loading` is set to `false`. This state variable can be used to keep track of whether the
  component is currently loading or not. It can be updated using the `setLoading` function. */
  const [loading, setLoading] = useState(false);
  // tokenIdsMinted keeps track of the number of tokenIds that have been minted
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  /* `const web3ModalRef = useRef();` is declaring a variable called `web3ModalRef` using the `useRef`
  hook. This hook returns a mutable ref object whose `.current` property is initialized to the passed
  argument (in this case, `undefined`). This ref can be used to store any mutable value that needs to
  persist between renders, similar to an instance property on a class component. In this specific
  case, it is likely being used to reference the Web3Modal instance used for connecting to a wallet. */
  const web3ModalRef = useRef();

  /**
   * @dev This function is used a get a signer or provider from Web3Modal.
   * @param needSigner {boolean} - Whether or not a signer is needed.
   * @returns {Promise<ethers.providers.Web3Provider | ethers.Signer>} - A Provider or Signer
   */
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change to the Polygon Mumbai Network");
      throw new Error("Change to the Polygon Mumbai Network");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider
  }

  /**
   * @dev This function is used to mint an LW3Punk NFT.
   * @returns {Promise<void>}
   * 
   */
  const publicMint = async () => {
    try {
      console.log("Public Mint");
      // Get a signer for the transaction
      const signer = await getProviderOrSigner(true);
      // Get the LW3Punks contract
      const lw3Punks = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      const tx = await lw3Punks.mint({
        value: ethers.utils.parseEther("0.001")
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      alert("LW3Punk Minted Successfully");
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @dev This function is used to get the number of tokenIds that have been minted.
   * @returns {Promise<void>}
   */
  const getTokenIdsMinted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const lw3Punks = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      const _tokenIds = await lw3Punks.tokenIds();
      setTokenIdsMinted(_tokenIds.toString());
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * @dev This function is used to connect to a wallet.
   * @returns {Promise<void>}
   */
  const connectWallet = async () => { 
    try {
      // Get a provider or signer
      await getProviderOrSigner();
      // Set walletConnected to true
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  }

  const renderButton = () => {
    // If wallet is not connected, return a button which allows them to connect their wallet
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }

    // If we are currently waiting for something, return a loading button
    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }

    return (
      <button className={styles.button} onClick={publicMint}>
        Public Mint 🚀
      </button>
    );
  };

  useEffect(() => {
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
      getTokenIdsMinted();

      // set an interval to get the number of token Ids minted every 5 seconds
      setInterval(async function () {
        await getTokenIdsMinted();
      }, 5 * 1000);

      window.ethereum.on("accountsChanged", (accounts) => { 
        console.log(accounts);
      });
    }
  }, []);

  return (
    <div>
      <Head>
        <title>LW3Punks</title>
        <meta name="description" content="LW3Punks-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to LW3Punks!</h1>
          <div className={styles.description}>
            {/* Using HTML Entities for the apostrophe */}
            It&#39;s an NFT collection for LearnWeb3 students.
          </div>
          <div className={styles.description}>
            {tokenIdsMinted}/10 have been minted
          </div>
          {renderButton()}
        </div>
          <Image className={styles.image} src="/LW3Punks/1.png" alt="NFT Image" width={500} height={400} placeholder="blur" blurDataURL="/LW3Punks/1.png" />
     
      </div>

      <footer className={styles.footer}>Made with &#10084; by LW3Punks</footer>
    </div>
  );
}
