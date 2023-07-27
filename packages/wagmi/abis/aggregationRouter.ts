export const aggregationRouter = [
  {
    inputs: [],
    name: 'ERC20TransferFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EmptyRouteData',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EthDepositRejected',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidCaller',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidMsgValue',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MinimalOutputBalanceViolation',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NativeTransferFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotCandidate',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroMinReturnAmount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'Candidate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'oldOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnerChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'Currency',
        name: 'srcToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'Currency',
        name: 'dstToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'dstReceiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'returnAmount',
        type: 'uint256',
      },
    ],
    name: 'Swap',
    type: 'event',
  },
  {
    inputs: [],
    name: 'candidateConfirm',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ownerCandidate',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'Currency',
        name: 'currency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'rescueFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_candidate',
        type: 'address',
      },
    ],
    name: 'setOwnerCandidate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IAggregationExecutor',
        name: 'executor',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'Currency',
            name: 'srcToken',
            type: 'address',
          },
          {
            internalType: 'Currency',
            name: 'dstToken',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'dstReceiver',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minReturnAmount',
            type: 'uint256',
          },
        ],
        internalType: 'struct AggregationRouter.SwapDescription',
        name: 'desc',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'route',
        type: 'bytes',
      },
    ],
    name: 'swap',
    outputs: [
      {
        internalType: 'uint256',
        name: 'returnAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'spentAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
