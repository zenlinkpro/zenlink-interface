export const treasury = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_feeTo',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_reserveFeePercent',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addWhitelistDistributor',
    inputs: [
      {
        name: 'distributor',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'feeTo',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAccumulatedAmount',
    inputs: [
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'token',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'wTime',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'maxReserveFeePercent',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'pendingOwner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'redeemSyToToken',
    inputs: [
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'output',
        type: 'tuple',
        internalType: 'struct TokenOutput',
        components: [
          {
            name: 'tokenOut',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'minTokenOut',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'tokenRedeemSy',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'zenlinkSwap',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'swapData',
            type: 'tuple',
            internalType: 'struct SwapData',
            components: [
              {
                name: 'swapType',
                type: 'uint8',
                internalType: 'enum SwapType',
              },
              {
                name: 'executor',
                type: 'address',
                internalType: 'contract IAggregationExecutor',
              },
              {
                name: 'route',
                type: 'bytes',
                internalType: 'bytes',
              },
            ],
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'redeemToken',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'to',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removeWhitelistDistributor',
    inputs: [
      {
        name: 'distributor',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'reserveFeePercent',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setFeeToAndFeeReserve',
    inputs: [
      {
        name: 'newFeeTo',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'newReserveFeePercent',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'direct',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'renounce',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint8',
        indexed: false,
        internalType: 'uint8',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RedeemSyToToken',
    inputs: [
      {
        name: 'market',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'tokenOut',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'wTime',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'RouterInsufficientTokenOut',
    inputs: [
      {
        name: 'actualTokenOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredTokenOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
] as const
