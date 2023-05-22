export const stableRouter = [
  {
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IStableSwap',
        name: 'basePool',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'meta_amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'base_amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'minToMint',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'addPoolAndBaseLiquidity',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'minMintAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'addPoolLiquidity',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'fromPool',
        type: 'address',
      },
      {
        internalType: 'contract IStableSwap',
        name: 'toPool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'calculateConvert',
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
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IStableSwap',
        name: 'basePool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_token_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'iBase',
        type: 'uint8',
      },
    ],
    name: 'calculateRemoveBaseLiquidityOneToken',
    outputs: [
      {
        internalType: 'uint256',
        name: 'availableTokenAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IStableSwap',
        name: 'basePool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'calculateRemoveLiquidity',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'meta_amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'base_amounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'uint8',
        name: 'fromIndex',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'toIndex',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'inAmount',
        type: 'uint256',
      },
    ],
    name: 'calculateSwap',
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
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IStableSwap',
        name: 'basePool',
        type: 'address',
      },
      {
        internalType: 'uint8',
        name: 'tokenIndexFrom',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'tokenIndexTo',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'dx',
        type: 'uint256',
      },
    ],
    name: 'calculateSwapFromBase',
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
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IStableSwap',
        name: 'basePool',
        type: 'address',
      },
      {
        internalType: 'uint8',
        name: 'tokenIndexFrom',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'tokenIndexTo',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'dx',
        type: 'uint256',
      },
    ],
    name: 'calculateSwapToBase',
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
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IStableSwap',
        name: 'basePool',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'meta_amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'base_amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'bool',
        name: 'is_deposit',
        type: 'bool',
      },
    ],
    name: 'calculateTokenAmount',
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
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'fromPool',
        type: 'address',
      },
      {
        internalType: 'contract IStableSwap',
        name: 'toPool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minToMint',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'convert',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IStableSwap',
        name: 'basePool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'min_amounts_meta',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'min_amounts_base',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'removePoolAndBaseLiquidity',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'base_amounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IStableSwap',
        name: 'basePool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_token_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'i',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: '_min_amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'removePoolAndBaseLiquidityOneToken',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'lpAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'minAmounts',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'removePoolLiquidity',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'lpAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'index',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'minAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'removePoolLiquidityOneToken',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'uint8',
        name: 'fromIndex',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'toIndex',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'inAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minOutAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'swapPool',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IStableSwap',
        name: 'basePool',
        type: 'address',
      },
      {
        internalType: 'uint8',
        name: 'tokenIndexFrom',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'tokenIndexTo',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'dx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minDy',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'swapPoolFromBase',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IStableSwap',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IStableSwap',
        name: 'basePool',
        type: 'address',
      },
      {
        internalType: 'uint8',
        name: 'tokenIndexFrom',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'tokenIndexTo',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'dx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minDy',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'swapPoolToBase',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
