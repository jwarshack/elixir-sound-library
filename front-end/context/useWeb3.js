import { createContext, useContext, useState } from 'react';

const Web3Context = createContext()


export function Web3ContextProvider({ children }) {

  const [web3Provider, setWeb3Provider] = useState()

  
  
    return (
      <Web3Context.Provider value={{ web3Provider, setWeb3Provider }}>
        {children}
      </Web3Context.Provider>
    );
  }
  
export function useWeb3() {
    return useContext(Web3Context);
  }

