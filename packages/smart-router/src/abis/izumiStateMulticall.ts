export const izumiStateMulticall = [
  {
    inputs: [
      {
        internalType: 'contract IiZiSwapFactory',
        name: 'factory',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: 'tokenX',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: 'tokenY',
        type: 'address',
      },
      {
        internalType: 'uint24',
        name: 'fee',
        type: 'uint24',
      },
      {
        internalType: 'int24',
        name: 'offset',
        type: 'int24',
      },
      {
        internalType: 'uint24',
        name: 'batchSize',
        type: 'uint24',
      },
    ],
    name: 'getFullState',
    outputs: [
      {
        components: [
          {
            internalType: 'contract IiZiSwapPool',
            name: 'pool',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'balance0',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'balance1',
            type: 'uint256',
          },
          {
            internalType: 'int24',
            name: 'pointDelta',
            type: 'int24',
          },
          {
            components: [
              {
                internalType: 'uint160',
                name: 'sqrtPrice_96',
                type: 'uint160',
              },
              {
                internalType: 'int24',
                name: 'currentPoint',
                type: 'int24',
              },
              {
                internalType: 'uint128',
                name: 'liquidity',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'liquidityX',
                type: 'uint128',
              },
            ],
            internalType: 'struct IiZiStateMulticall.PoolState',
            name: 'state',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256[]',
                name: 'allLiquidities',
                type: 'uint256[]',
              },
              {
                internalType: 'int24[]',
                name: 'allPoint',
                type: 'int24[]',
              },
              {
                internalType: 'uint128[]',
                name: 'sellingX',
                type: 'uint128[]',
              },
              {
                internalType: 'uint128[]',
                name: 'sellingY',
                type: 'uint128[]',
              },
              {
                internalType: 'int24[]',
                name: 'sellingXPoint',
                type: 'int24[]',
              },
              {
                internalType: 'int24[]',
                name: 'sellingYPoint',
                type: 'int24[]',
              },
            ],
            internalType: 'struct IiZiStateMulticall.Orders',
            name: 'orders',
            type: 'tuple',
          },
        ],
        internalType: 'struct IiZiStateMulticall.StateResult',
        name: 'state',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
