export const multicallV2 = [
  {
    type: 'function',
    name: 'aggregate',
    inputs: [
      {
        name: 'calls',
        type: 'tuple[]',
        internalType: 'struct ZenlinkMulticallV2.Call[]',
        components: [
          {
            name: 'target',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'callData',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'callThenRevert',
    inputs: [
      {
        name: 'target',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'callData',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'tryAggregate',
    inputs: [
      {
        name: 'requireSuccess',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'gasLimit',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'calls',
        type: 'tuple[]',
        internalType: 'struct ZenlinkMulticallV2.Call[]',
        components: [
          {
            name: 'target',
            type: 'address',
            internalType: 'address',
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
        name: 'returnData',
        type: 'tuple[]',
        internalType: 'struct ZenlinkMulticallV2.Result[]',
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
    name: 'tryAggregateRevert',
    inputs: [
      {
        name: 'gasLimit',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'calls',
        type: 'tuple[]',
        internalType: 'struct ZenlinkMulticallV2.Call[]',
        components: [
          {
            name: 'target',
            type: 'address',
            internalType: 'address',
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
        name: 'returnData',
        type: 'bytes[]',
        internalType: 'bytes[]',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'error',
    name: 'CallThenRevertError',
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
] as const
