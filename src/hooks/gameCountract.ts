import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import CounterAbi from '~/abi/counter.json'

export function useGameContract() {
  return useContract({
    abi: CounterAbi as Abi,
    address: '0x15ec365eb8e3340c7877b33f6ce7b6bef9cd0683d8a0d36501449a10fc4d1af',//'0x4661c5e30d2f861aad428f20ee876c2b010479e9f6fa62ba4bbe17f9e8d34c3',
  })
}
