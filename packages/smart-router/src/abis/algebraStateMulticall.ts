export const algebraStateMulticall = [
  {
    inputs: [
      {
        internalType: 'contract IAlgebraFactory',
        name: 'factory',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        internalType: 'int16',
        name: 'leftBitmapAmount',
        type: 'int16',
      },
      {
        internalType: 'int16',
        name: 'rightBitmapAmount',
        type: 'int16',
      },
    ],
    name: 'getFullStateWithRelativeBitmaps',
    outputs: [
      {
        components: [
          {
            internalType: 'contract IAlgebraPool',
            name: 'pool',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'uint160',
                name: 'sqrtPriceX96',
                type: 'uint160',
              },
              {
                internalType: 'uint16',
                name: 'fee',
                type: 'uint16',
              },
              {
                internalType: 'int24',
                name: 'tick',
                type: 'int24',
              },
              {
                internalType: 'bool',
                name: 'unlocked',
                type: 'bool',
              },
            ],
            internalType: 'struct AlgebraV1StateMulticall.Slot0',
            name: 'slot0',
            type: 'tuple',
          },
          {
            internalType: 'uint128',
            name: 'liquidity',
            type: 'uint128',
          },
          {
            internalType: 'int24',
            name: 'tickSpacing',
            type: 'int24',
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
            components: [
              {
                internalType: 'int24',
                name: 'index',
                type: 'int24',
              },
              {
                internalType: 'int256',
                name: 'value',
                type: 'int256',
              },
            ],
            internalType: 'struct AlgebraV1StateMulticall.TickBitMapMappings[]',
            name: 'tickBitmap',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct AlgebraV1StateMulticall.StateResult',
        name: 'state',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
