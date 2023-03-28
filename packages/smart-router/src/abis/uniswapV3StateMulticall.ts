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
            internalType: 'uint256',
            name: 'blockTimestamp',
            type: 'uint256',
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
                internalType: 'uint16',
                name: 'observationIndex',
                type: 'uint16',
              },
              {
                internalType: 'uint16',
                name: 'observationCardinality',
                type: 'uint16',
              },
              {
                internalType: 'uint16',
                name: 'observationCardinalityNext',
                type: 'uint16',
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
            internalType: 'struct IUniswapV3StateMulticall.Slot0',
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
            internalType: 'uint128',
            name: 'maxLiquidityPerTick',
            type: 'uint128',
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
                internalType: 'uint32',
                name: 'blockTimestamp',
                type: 'uint32',
              },
              {
                internalType: 'int56',
                name: 'tickCumulative',
                type: 'int56',
              },
              {
                internalType: 'uint160',
                name: 'secondsPerLiquidityCumulativeX128',
                type: 'uint160',
              },
              {
                internalType: 'bool',
                name: 'initialized',
                type: 'bool',
              },
            ],
            internalType: 'struct IUniswapV3StateMulticall.Observation',
            name: 'observation',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'int16',
                name: 'index',
                type: 'int16',
              },
              {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
            ],
            internalType: 'struct IUniswapV3StateMulticall.TickBitMapMappings[]',
            name: 'tickBitmap',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'int24',
                name: 'index',
                type: 'int24',
              },
              {
                components: [
                  {
                    internalType: 'uint128',
                    name: 'liquidityGross',
                    type: 'uint128',
                  },
                  {
                    internalType: 'int128',
                    name: 'liquidityNet',
                    type: 'int128',
                  },
                  {
                    internalType: 'int56',
                    name: 'tickCumulativeOutside',
                    type: 'int56',
                  },
                  {
                    internalType: 'uint160',
                    name: 'secondsPerLiquidityOutsideX128',
                    type: 'uint160',
                  },
                  {
                    internalType: 'uint32',
                    name: 'secondsOutside',
                    type: 'uint32',
                  },
                  {
                    internalType: 'bool',
                    name: 'initialized',
                    type: 'bool',
                  },
                ],
                internalType: 'struct IUniswapV3StateMulticall.TickInfo',
                name: 'value',
                type: 'tuple',
              },
            ],
            internalType: 'struct IUniswapV3StateMulticall.TickInfoMappings[]',
            name: 'ticks',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct IUniswapV3StateMulticall.StateResult',
        name: 'state',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
