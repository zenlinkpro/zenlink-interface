export const actionRouter = [
  {
    type: 'function',
    name: 'boostMarkets',
    inputs: [
      {
        name: 'markets',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'mintPyFromSy',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'YT',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netSyIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minPyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'netPyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'mintPyFromToken',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'YT',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'minPyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'input',
        type: 'tuple',
        internalType: 'struct TokenInput',
        components: [
          {
            name: 'tokenIn',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'netTokenIn',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'tokenMintSy',
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
    outputs: [
      {
        name: 'netPyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'mintSyFromToken',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'SY',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'minSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'input',
        type: 'tuple',
        internalType: 'struct TokenInput',
        components: [
          {
            name: 'tokenIn',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'netTokenIn',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'tokenMintSy',
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
    outputs: [
      {
        name: 'netSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'multicall',
    inputs: [
      {
        name: 'calls',
        type: 'tuple[]',
        internalType: 'struct IPActionMiscV3.Call3[]',
        components: [
          {
            name: 'allowFailure',
            type: 'bool',
            internalType: 'bool',
          },
          {
            name: 'callData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'res',
        type: 'tuple[]',
        internalType: 'struct IPActionMiscV3.Result[]',
        components: [
          {
            name: 'success',
            type: 'bool',
            internalType: 'bool',
          },
          {
            name: 'returnData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'redeemDueInterestAndRewards',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'sys',
        type: 'address[]',
        internalType: 'address[]',
      },
      {
        name: 'yts',
        type: 'address[]',
        internalType: 'address[]',
      },
      {
        name: 'markets',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'redeemPyToSy',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'YT',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netPyIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'netSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'redeemPyToToken',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'YT',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netPyIn',
        type: 'uint256',
        internalType: 'uint256',
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
    outputs: [
      {
        name: 'netTokenOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'redeemSyToToken',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'SY',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netSyIn',
        type: 'uint256',
        internalType: 'uint256',
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
    outputs: [
      {
        name: 'netTokenOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'simulate',
    inputs: [
      {
        name: 'target',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'data',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'swapTokenToToken',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'minTokenOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'inp',
        type: 'tuple',
        internalType: 'struct TokenInput',
        components: [
          {
            name: 'tokenIn',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'netTokenIn',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'tokenMintSy',
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
    outputs: [
      {
        name: 'netTokenOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'swapTokenToTokenViaSy',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'SY',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'input',
        type: 'tuple',
        internalType: 'struct TokenInput',
        components: [
          {
            name: 'tokenIn',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'netTokenIn',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'tokenMintSy',
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
      {
        name: 'tokenRedeemSy',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'minTokenOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'netTokenOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    name: 'MintPyFromSy',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'YT',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netSyIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netPyOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MintPyFromToken',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tokenIn',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'YT',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'netTokenIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netPyOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MintSyFromToken',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tokenIn',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'SY',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'netTokenIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RedeemPyToSy',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'YT',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netPyIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RedeemPyToToken',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tokenOut',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'YT',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'netPyIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netTokenOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RedeemSyToToken',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tokenOut',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'SY',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'netSyIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netTokenOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'RouterInsufficientPYOut',
    inputs: [
      {
        name: 'actualPYOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredPYOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'RouterInsufficientSyOut',
    inputs: [
      {
        name: 'actualSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
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
  {
    type: 'error',
    name: 'SimulationResults',
    inputs: [
      {
        name: 'success',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'res',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
  },
  {
    type: 'function',
    name: 'swapExactPtForSy',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'exactPtIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'limit',
        type: 'tuple',
        internalType: 'struct LimitOrderData',
        components: [
          {
            name: 'limitRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'epsSkipMarket',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'normalFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'flashFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'optData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swapExactPtForToken',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'exactPtIn',
        type: 'uint256',
        internalType: 'uint256',
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
      {
        name: 'limit',
        type: 'tuple',
        internalType: 'struct LimitOrderData',
        components: [
          {
            name: 'limitRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'epsSkipMarket',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'normalFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'flashFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'optData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netTokenOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swapExactSyForPt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'exactSyIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'guessPtOut',
        type: 'tuple',
        internalType: 'struct ApproxParams',
        components: [
          {
            name: 'guessMin',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessMax',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessOffchain',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'maxIteration',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'eps',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'limit',
        type: 'tuple',
        internalType: 'struct LimitOrderData',
        components: [
          {
            name: 'limitRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'epsSkipMarket',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'normalFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'flashFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'optData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swapExactTokenForPt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'minPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'guessPtOut',
        type: 'tuple',
        internalType: 'struct ApproxParams',
        components: [
          {
            name: 'guessMin',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessMax',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessOffchain',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'maxIteration',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'eps',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'input',
        type: 'tuple',
        internalType: 'struct TokenInput',
        components: [
          {
            name: 'tokenIn',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'netTokenIn',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'tokenMintSy',
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
      {
        name: 'limit',
        type: 'tuple',
        internalType: 'struct LimitOrderData',
        components: [
          {
            name: 'limitRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'epsSkipMarket',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'normalFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'flashFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'optData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    name: 'SwapPtAndSy',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netPtToAccount',
        type: 'int256',
        indexed: false,
        internalType: 'int256',
      },
      {
        name: 'netSyToAccount',
        type: 'int256',
        indexed: false,
        internalType: 'int256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SwapPtAndToken',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'token',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'netPtToAccount',
        type: 'int256',
        indexed: false,
        internalType: 'int256',
      },
      {
        name: 'netTokenToAccount',
        type: 'int256',
        indexed: false,
        internalType: 'int256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'ApproxFail',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ApproxParamsInvalid',
    inputs: [
      {
        name: 'guessMin',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'guessMax',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'eps',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketExchangeRateBelowOne',
    inputs: [
      {
        name: 'exchangeRate',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketExpired',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketProportionMustNotEqualOne',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketProportionTooHigh',
    inputs: [
      {
        name: 'proportion',
        type: 'int256',
        internalType: 'int256',
      },
      {
        name: 'maxProportion',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketRateScalarBelowZero',
    inputs: [
      {
        name: 'rateScalar',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketZeroTotalPtOrTotalAsset',
    inputs: [
      {
        name: 'totalPt',
        type: 'int256',
        internalType: 'int256',
      },
      {
        name: 'totalAsset',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'RouterInsufficientPtOut',
    inputs: [
      {
        name: 'actualPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'RouterInsufficientSyOut',
    inputs: [
      {
        name: 'actualSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
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
  {
    type: 'function',
    name: 'swapExactPtForYt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'exactPtIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minYtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'guessTotalPtToSwap',
        type: 'tuple',
        internalType: 'struct ApproxParams',
        components: [
          {
            name: 'guessMin',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessMax',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessOffchain',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'maxIteration',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'eps',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netYtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swapExactSyForYt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'exactSyIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minYtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'guessYtOut',
        type: 'tuple',
        internalType: 'struct ApproxParams',
        components: [
          {
            name: 'guessMin',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessMax',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessOffchain',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'maxIteration',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'eps',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'limit',
        type: 'tuple',
        internalType: 'struct LimitOrderData',
        components: [
          {
            name: 'limitRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'epsSkipMarket',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'normalFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'flashFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'optData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netYtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swapExactTokenForYt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'minYtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'guessYtOut',
        type: 'tuple',
        internalType: 'struct ApproxParams',
        components: [
          {
            name: 'guessMin',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessMax',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessOffchain',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'maxIteration',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'eps',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'input',
        type: 'tuple',
        internalType: 'struct TokenInput',
        components: [
          {
            name: 'tokenIn',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'netTokenIn',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'tokenMintSy',
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
      {
        name: 'limit',
        type: 'tuple',
        internalType: 'struct LimitOrderData',
        components: [
          {
            name: 'limitRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'epsSkipMarket',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'normalFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'flashFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'optData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netYtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'swapExactYtForPt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'exactYtIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'guessTotalPtFromSwap',
        type: 'tuple',
        internalType: 'struct ApproxParams',
        components: [
          {
            name: 'guessMin',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessMax',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessOffchain',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'maxIteration',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'eps',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swapExactYtForSy',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'exactYtIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'limit',
        type: 'tuple',
        internalType: 'struct LimitOrderData',
        components: [
          {
            name: 'limitRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'epsSkipMarket',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'normalFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'flashFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'optData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swapExactYtForToken',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'exactYtIn',
        type: 'uint256',
        internalType: 'uint256',
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
      {
        name: 'limit',
        type: 'tuple',
        internalType: 'struct LimitOrderData',
        components: [
          {
            name: 'limitRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'epsSkipMarket',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'normalFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'flashFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'optData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netTokenOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'SwapPtAndYt',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netPtToAccount',
        type: 'int256',
        indexed: false,
        internalType: 'int256',
      },
      {
        name: 'netYtToAccount',
        type: 'int256',
        indexed: false,
        internalType: 'int256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SwapYtAndSy',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netYtToAccount',
        type: 'int256',
        indexed: false,
        internalType: 'int256',
      },
      {
        name: 'netSyToAccount',
        type: 'int256',
        indexed: false,
        internalType: 'int256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SwapYtAndToken',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'token',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'netYtToAccount',
        type: 'int256',
        indexed: false,
        internalType: 'int256',
      },
      {
        name: 'netTokenToAccount',
        type: 'int256',
        indexed: false,
        internalType: 'int256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'ApproxFail',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ApproxParamsInvalid',
    inputs: [
      {
        name: 'guessMin',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'guessMax',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'eps',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketExchangeRateBelowOne',
    inputs: [
      {
        name: 'exchangeRate',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketExpired',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketProportionMustNotEqualOne',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketProportionTooHigh',
    inputs: [
      {
        name: 'proportion',
        type: 'int256',
        internalType: 'int256',
      },
      {
        name: 'maxProportion',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketRateScalarBelowZero',
    inputs: [
      {
        name: 'rateScalar',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketZeroTotalPtOrTotalAsset',
    inputs: [
      {
        name: 'totalPt',
        type: 'int256',
        internalType: 'int256',
      },
      {
        name: 'totalAsset',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'RouterInsufficientPtOut',
    inputs: [
      {
        name: 'actualPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'RouterInsufficientSyOut',
    inputs: [
      {
        name: 'actualSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
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
  {
    type: 'error',
    name: 'RouterInsufficientYtOut',
    inputs: [
      {
        name: 'actualYtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredYtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    name: 'addLiquidityDualSyAndPt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netSyDesired',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netPtDesired',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'netLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyUsed',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netPtUsed',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addLiquidityDualTokenAndPt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'input',
        type: 'tuple',
        internalType: 'struct TokenInput',
        components: [
          {
            name: 'tokenIn',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'netTokenIn',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'tokenMintSy',
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
      {
        name: 'netPtDesired',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'netLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netPtUsed',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'addLiquiditySinglePt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netPtIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'guessPtSwapToSy',
        type: 'tuple',
        internalType: 'struct ApproxParams',
        components: [
          {
            name: 'guessMin',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessMax',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessOffchain',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'maxIteration',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'eps',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'limit',
        type: 'tuple',
        internalType: 'struct LimitOrderData',
        components: [
          {
            name: 'limitRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'epsSkipMarket',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'normalFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'flashFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'optData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addLiquiditySingleSy',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netSyIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'guessPtReceivedFromSy',
        type: 'tuple',
        internalType: 'struct ApproxParams',
        components: [
          {
            name: 'guessMin',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessMax',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessOffchain',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'maxIteration',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'eps',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'limit',
        type: 'tuple',
        internalType: 'struct LimitOrderData',
        components: [
          {
            name: 'limitRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'epsSkipMarket',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'normalFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'flashFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'optData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addLiquiditySingleSyKeepYt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netSyIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minYtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'netLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netYtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyMintPy',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addLiquiditySingleToken',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'minLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'guessPtReceivedFromSy',
        type: 'tuple',
        internalType: 'struct ApproxParams',
        components: [
          {
            name: 'guessMin',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessMax',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessOffchain',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'maxIteration',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'eps',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'input',
        type: 'tuple',
        internalType: 'struct TokenInput',
        components: [
          {
            name: 'tokenIn',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'netTokenIn',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'tokenMintSy',
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
      {
        name: 'limit',
        type: 'tuple',
        internalType: 'struct LimitOrderData',
        components: [
          {
            name: 'limitRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'epsSkipMarket',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'normalFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'flashFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'optData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'addLiquiditySingleTokenKeepYt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'minLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minYtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'input',
        type: 'tuple',
        internalType: 'struct TokenInput',
        components: [
          {
            name: 'tokenIn',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'netTokenIn',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'tokenMintSy',
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
    outputs: [
      {
        name: 'netLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netYtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyMintPy',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'removeLiquidityDualSyAndPt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netLpToRemove',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'netSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removeLiquidityDualTokenAndPt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netLpToRemove',
        type: 'uint256',
        internalType: 'uint256',
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
      {
        name: 'minPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'netTokenOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removeLiquiditySinglePt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netLpToRemove',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'guessPtReceivedFromSy',
        type: 'tuple',
        internalType: 'struct ApproxParams',
        components: [
          {
            name: 'guessMin',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessMax',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'guessOffchain',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'maxIteration',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'eps',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'limit',
        type: 'tuple',
        internalType: 'struct LimitOrderData',
        components: [
          {
            name: 'limitRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'epsSkipMarket',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'normalFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'flashFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'optData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removeLiquiditySingleSy',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netLpToRemove',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'limit',
        type: 'tuple',
        internalType: 'struct LimitOrderData',
        components: [
          {
            name: 'limitRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'epsSkipMarket',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'normalFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'flashFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'optData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removeLiquiditySingleToken',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netLpToRemove',
        type: 'uint256',
        internalType: 'uint256',
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
      {
        name: 'limit',
        type: 'tuple',
        internalType: 'struct LimitOrderData',
        components: [
          {
            name: 'limitRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'epsSkipMarket',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'normalFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'flashFills',
            type: 'tuple[]',
            internalType: 'struct FillOrderParams[]',
            components: [
              {
                name: 'order',
                type: 'tuple',
                internalType: 'struct Order',
                components: [
                  {
                    name: 'salt',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'expiry',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'nonce',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'orderType',
                    type: 'uint8',
                    internalType: 'enum IPLimitOrderType.OrderType',
                  },
                  {
                    name: 'token',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'YT',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'maker',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'receiver',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'makingAmount',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'lnImpliedRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'failSafeRate',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'permit',
                    type: 'bytes',
                    internalType: 'bytes',
                  },
                ],
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'makingAmount',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'optData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'netTokenOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'AddLiquidityDualSyAndPt',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netSyUsed',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netPtUsed',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netLpOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'AddLiquidityDualTokenAndPt',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tokenIn',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'netTokenUsed',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netPtUsed',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netLpOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'AddLiquiditySinglePt',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netPtIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netLpOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'AddLiquiditySingleSy',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netSyIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netLpOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'AddLiquiditySingleSyKeepYt',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netSyIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyMintPy',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netLpOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netYtOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'AddLiquiditySingleToken',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'token',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'netTokenIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netLpOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'AddLiquiditySingleTokenKeepYt',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'token',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'netTokenIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netLpOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netYtOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyMintPy',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RemoveLiquidityDualSyAndPt',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netLpToRemove',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netPtOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RemoveLiquidityDualTokenAndPt',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tokenOut',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'netLpToRemove',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netPtOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netTokenOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RemoveLiquiditySinglePt',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netLpToRemove',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netPtOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RemoveLiquiditySingleSy',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netLpToRemove',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RemoveLiquiditySingleToken',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'token',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'netLpToRemove',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netTokenOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyInterm',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'ApproxFail',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ApproxParamsInvalid',
    inputs: [
      {
        name: 'guessMin',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'guessMax',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'eps',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketExchangeRateBelowOne',
    inputs: [
      {
        name: 'exchangeRate',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketExpired',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketProportionMustNotEqualOne',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketProportionTooHigh',
    inputs: [
      {
        name: 'proportion',
        type: 'int256',
        internalType: 'int256',
      },
      {
        name: 'maxProportion',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketRateScalarBelowZero',
    inputs: [
      {
        name: 'rateScalar',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketZeroAmountsInput',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketZeroAmountsOutput',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketZeroTotalPtOrTotalAsset',
    inputs: [
      {
        name: 'totalPt',
        type: 'int256',
        internalType: 'int256',
      },
      {
        name: 'totalAsset',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'RouterInsufficientLpOut',
    inputs: [
      {
        name: 'actualLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'RouterInsufficientPtOut',
    inputs: [
      {
        name: 'actualPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'RouterInsufficientSyOut',
    inputs: [
      {
        name: 'actualSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
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
  {
    type: 'error',
    name: 'RouterInsufficientYtOut',
    inputs: [
      {
        name: 'actualYtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredYtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'RouterNotAllSyUsed',
    inputs: [
      {
        name: 'netSyDesired',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyUsed',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
] as const
