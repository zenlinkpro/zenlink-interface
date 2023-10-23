export const uniswapV3StateMulticall = [
  {
    inputs: [
      {
        internalType: 'contract IUniswapV3Factory',
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
        internalType: 'uint24',
        name: 'fee',
        type: 'uint24',
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
            internalType: 'contract IUniswapV3Pool',
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
                internalType: 'int24',
                name: 'tick',
                type: 'int24',
              },
              {
                internalType: 'uint8',
                name: 'feeProtocol',
                type: 'uint8',
              },
              {
                internalType: 'bool',
                name: 'unlocked',
                type: 'bool',
              },
            ],
            internalType: 'struct UniswapV3StateMulticall.Slot0',
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
            internalType: 'struct UniswapV3StateMulticall.TickBitMapMappings[]',
            name: 'tickBitmap',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct UniswapV3StateMulticall.StateResult',
        name: 'state',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
