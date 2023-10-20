export const kyperElasticStateMulticall = [
  {
    inputs: [
      {
        internalType: 'contract IFactory',
        name: 'factory',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token0',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token1',
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
            internalType: 'contract IPool',
            name: 'pool',
            type: 'address',
          },
          {
            internalType: 'int24',
            name: 'currentTick',
            type: 'int24',
          },
          {
            internalType: 'uint160',
            name: 'sqrtP',
            type: 'uint160',
          },
          {
            internalType: 'uint128',
            name: 'baseL',
            type: 'uint128',
          },
          {
            internalType: 'int24',
            name: 'tickDistance',
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
                name: 'tick',
                type: 'int24',
              },
              {
                internalType: 'int128',
                name: 'liquidityNet',
                type: 'int128',
              },
            ],
            internalType: 'struct KyperElasticStateMulticall.PopulatedTick[]',
            name: 'ticks',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct KyperElasticStateMulticall.StateResult',
        name: 'state',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
