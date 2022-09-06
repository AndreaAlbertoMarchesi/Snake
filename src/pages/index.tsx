import { useStarknetCall } from '@starknet-react/core'
import { debug } from 'console'
import type { NextPage } from 'next'
import { useMemo } from 'react'
import { ConnectWallet } from '~/components/ConnectWallet'
import Game from '~/components/Game'
import { SendMoves } from '~/components/SendMoves'
import { TransactionList } from '~/components/TransactionList'
import { useGameContract } from '~/hooks/gameCountract'
import { useStarknet } from '@starknet-react/core'
import React, { useState } from 'react';

class InitState {
  snakeDots: number[][];
  food: number[][];

  constructor(snakeDots: number[][], food: number[][]) {
    this.snakeDots = snakeDots;
    this.food = food;
  }
}


const Home: NextPage = () => {
  const { account } = useStarknet()
  const { contract: gameContract } = useGameContract()
  const { data: contractInitState } = useStarknetCall({
    contract: gameContract,
    method: 'showInitState',
    args: [],//[account],
  })

  const [moves, setMoves] = useState<Array<number>>([]);

  const setMovesCallback = (move: number) => {
    if (move == undefined)
      setMoves([]);
    else
      setMoves(list => [...list, move]);
  }

  const initState = useMemo(() => {
    if (contractInitState && contractInitState.length > 0) {
      let snakeDots = [[contractInitState[0].x.toNumber(), contractInitState[0].y.toNumber()]];
      let food = contractInitState[1].map((num: any) => [num.x.toNumber(), num.y.toNumber()])
      let initState = new InitState(snakeDots, food);
      return initState
    }
  }, [contractInitState])

  console.log(initState?.food[0])
  if (initState && account)
    return (
      <div>
        <h2>Wallet</h2>
        <ConnectWallet />
        <h2>Counter Contract</h2>
        <p>{moves.length} moves:</p>
        <p id="movesText">{moves.join(",")}</p>
        <p>Address: {gameContract?.address}</p>
        <SendMoves moves={moves} />

        <Game snakeDots={initState.snakeDots}
          food={initState.food} callback={setMovesCallback} />

        <h2>Recent Transactions</h2>
        <TransactionList />
      </div>
    )
  else {
    if (!account)
      return (
        <div>
          <ConnectWallet />
        </div>
      )
    else
      return (
        <div>
          <h2>Loading</h2>
        </div>
      )
  }

}

export default Home


