export const velodromeCLStateMulticall = [
  {
    type: 'function',
    name: 'getFullStateWithRelativeBitmaps',
    inputs: [
      {
        name: 'factory',
        type: 'address',
        internalType: 'contract ICLFactory',
      },
      {
        name: 'tokenIn',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'tokenOut',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'tickSpacing',
        type: 'int24',
        internalType: 'int24',
      },
      {
        name: 'leftBitmapAmount',
        type: 'int16',
        internalType: 'int16',
      },
      {
        name: 'rightBitmapAmount',
        type: 'int16',
        internalType: 'int16',
      },
    ],
    outputs: [
      {
        name: 'state',
        type: 'tuple',
        internalType: 'struct VelodromeCLStateMulticall.StateResult',
        components: [
          {
            name: 'pool',
            type: 'address',
            internalType: 'contract ICLPool',
          },
          {
            name: 'slot0',
            type: 'tuple',
            internalType: 'struct VelodromeCLStateMulticall.Slot0',
            components: [
              {
                name: 'sqrtPriceX96',
                type: 'uint160',
                internalType: 'uint160',
              },
              {
                name: 'tick',
                type: 'int24',
                internalType: 'int24',
              },
              {
                name: 'unlocked',
                type: 'bool',
                internalType: 'bool',
              },
            ],
          },
          {
            name: 'liquidity',
            type: 'uint128',
            internalType: 'uint128',
          },
          {
            name: 'tickSpacing',
            type: 'int24',
            internalType: 'int24',
          },
          {
            name: 'fee',
            type: 'uint24',
            internalType: 'uint24',
          },
          {
            name: 'balance0',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'balance1',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'tickBitmap',
            type: 'tuple[]',
            internalType: 'struct VelodromeCLStateMulticall.TickBitMapMappings[]',
            components: [
              {
                name: 'index',
                type: 'int24',
                internalType: 'int24',
              },
              {
                name: 'value',
                type: 'int256',
                internalType: 'int256',
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const
