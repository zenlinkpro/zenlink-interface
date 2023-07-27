export const universalRouter = [
  {
    inputs: [
      {
        internalType: 'contract IStableSwapDispatcher',
        name: '_stableSwapDispatcher',
        type: 'address',
      },
      {
        internalType: 'contract IFeeSettlement',
        name: '_feeSettlement',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'InsufficientOutAmount',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'code',
        type: 'uint8',
      },
    ],
    name: 'InvalidCommandCode',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address',
      },
    ],
    name: 'InvalidPool',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'accAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
    ],
    name: 'WrongAmountInValue',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'oldAdmin',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newAdmin',
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
        indexed: false,
        internalType: 'contract IFeeSettlement',
        name: 'feeSettlement',
        type: 'address',
      },
    ],
    name: 'SetFeeSettlement',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IStableSwapDispatcher',
        name: 'stableSwapDispatcher',
        type: 'address',
      },
    ],
    name: 'SetStableSwapDispatcher',
    type: 'event',
  },
  {
    inputs: [],
    name: 'admin',
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
    name: 'adminCandidate',
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
    name: 'candidateConfirm',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeSettlement',
    outputs: [
      {
        internalType: 'contract IFeeSettlement',
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
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMin',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'route',
        type: 'bytes',
      },
    ],
    name: 'processRoute',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
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
    name: 'setAdminCandidate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IFeeSettlement',
        name: '_feeSettlement',
        type: 'address',
      },
    ],
    name: 'setFeeSettlement',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IStableSwapDispatcher',
        name: '_stableSwapDispatcher',
        type: 'address',
      },
    ],
    name: 'setStableSwapDispatcher',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stableSwapDispatcher',
    outputs: [
      {
        internalType: 'contract IStableSwapDispatcher',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
