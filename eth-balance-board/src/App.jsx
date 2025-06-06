import { useEffect, useState } from 'react';
import './App.css'
import Table from './components/table'
import { accounts } from './data/accounts';
import { formatEther } from 'ethers'

const GET_ETH_API = 'https://mainnet.gateway.tenderly.co/1rOBmh8SJuLUfq9Iq6xOuJ'
const ETH_TO_USD_API = 'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=ethereum'

function App() {

  const [data, setData] = useState([])

  useEffect(() => {
    const getEth = async (address) => {
      try{
        const res = await fetch( GET_ETH_API, 
          {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_getBalance',
            params: [address, 'latest'],
          }),
        });
        if (!res.ok) {
          throw new Error(`Response status: ${res.status}`);
        }
        const data = await res.json();
        return data.result
      }
      catch(err){
        console.error(err)
      }
    }

    const ethToUsd = async () => {
      try {
        const res = await fetch(ETH_TO_USD_API, {method: 'GET', headers: {accept: 'application/json'}});
        if(!res.ok) throw new Error(`Response status: ${res.status}`);
        const data = await res.json()
        return data.ethereum.usd;

      } catch (err) {
        console.error(err)
      }
    }

    const fetchBalances = async () => {
      const usd = await ethToUsd();
      const balances = await Promise.all(accounts.map(async account => {
        const hex = await getEth(account.address)
        const eth = formatEther(hex)
        const usdBalance = Number(eth) * Number(usd)
        return { ...account, eth, usdBalance }
      }))
      setData(balances)
    }

    fetchBalances()
    
  },[])

  return (
    <div className='flex min-h-screen justify-center items-center'>
      <Table data={data}/>
    </div>
  )
}

export default App
