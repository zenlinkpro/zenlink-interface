export const zenlinkStableSwap = [
  {
    inputs: [],
    name: 'getTokens',
    outputs: [
      {
        internalType: 'contract IERC20[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTokenBalances',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'swapStorage',
    outputs: [
      {
        internalType: 'contract LPToken',
        name: 'lpToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'adminFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'initialA',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'futureA',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'initialATime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'futureATime',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getA',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVirtualPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
