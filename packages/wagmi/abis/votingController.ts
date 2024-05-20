export const votingController = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_veZLK',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_zenlinkMsgSendEndpoint',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'initialApproxDestinationGas',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'GOVERNANCE_ZLK_VOTE',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MAX_LOCK_TIME',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'WEEK',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'addDestinationContract',
    inputs: [
      {
        name: '_address',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_chainId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'addPool',
    inputs: [
      {
        name: 'chainId',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: 'pool',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'applyPoolSlopeChanges',
    inputs: [
      {
        name: 'pool',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'approxDstExecutionGas',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'broadcastResults',
    inputs: [
      {
        name: 'chainId',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'claimOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'deployedWTime',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'finalizeEpoch',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'forceBroadcastResults',
    inputs: [
      {
        name: 'chainId',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: 'wTime',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'forcedzlkPerSec',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'getActiveChainPools',
    inputs: [
      {
        name: 'chainId',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAllActivePools',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAllDestinationContracts',
    inputs: [],
    outputs: [
      {
        name: 'chainIds',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
      {
        name: 'addrs',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAllRemovedPools',
    inputs: [
      {
        name: 'start',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'end',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'lengthOfRemovedPools',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'arr',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getBroadcastResultFee',
    inputs: [
      {
        name: 'chainId',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPoolData',
    inputs: [
      {
        name: 'pool',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'wTimes',
        type: 'uint128[]',
        internalType: 'uint128[]',
      },
    ],
    outputs: [
      {
        name: 'chainId',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: 'lastSlopeChangeAppliedAt',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'totalVote',
        type: 'tuple',
        internalType: 'struct VeBalance',
        components: [
          {
            name: 'bias',
            type: 'uint128',
            internalType: 'uint128',
          },
          {
            name: 'slope',
            type: 'uint128',
            internalType: 'uint128',
          },
        ],
      },
      {
        name: 'slopeChanges',
        type: 'uint128[]',
        internalType: 'uint128[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPoolTotalVoteAt',
    inputs: [
      {
        name: 'pool',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'wTime',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserData',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'pools',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    outputs: [
      {
        name: 'totalVotedWeight',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: 'voteForPools',
        type: 'tuple[]',
        internalType: 'struct VotingControllerStorageUpg.UserPoolData[]',
        components: [
          {
            name: 'weight',
            type: 'uint64',
            internalType: 'uint64',
          },
          {
            name: 'vote',
            type: 'tuple',
            internalType: 'struct VeBalance',
            components: [
              {
                name: 'bias',
                type: 'uint128',
                internalType: 'uint128',
              },
              {
                name: 'slope',
                type: 'uint128',
                internalType: 'uint128',
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserPoolHistoryAt',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'pool',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'index',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Checkpoint',
        components: [
          {
            name: 'timestamp',
            type: 'uint128',
            internalType: 'uint128',
          },
          {
            name: 'value',
            type: 'tuple',
            internalType: 'struct VeBalance',
            components: [
              {
                name: 'bias',
                type: 'uint128',
                internalType: 'uint128',
              },
              {
                name: 'slope',
                type: 'uint128',
                internalType: 'uint128',
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserPoolHistoryLength',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'pool',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserPoolVote',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'pool',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct VotingControllerStorageUpg.UserPoolData',
        components: [
          {
            name: 'weight',
            type: 'uint64',
            internalType: 'uint64',
          },
          {
            name: 'vote',
            type: 'tuple',
            internalType: 'struct VeBalance',
            components: [
              {
                name: 'bias',
                type: 'uint128',
                internalType: 'uint128',
              },
              {
                name: 'slope',
                type: 'uint128',
                internalType: 'uint128',
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getWeekData',
    inputs: [
      {
        name: 'wTime',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'pools',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    outputs: [
      {
        name: 'isEpochFinalized',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'totalVotes',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'poolVotes',
        type: 'uint128[]',
        internalType: 'uint128[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'pendingOwner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'proxiableUUID',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'removePool',
    inputs: [
      {
        name: 'pool',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setApproxDstExecutionGas',
    inputs: [
      {
        name: 'gas',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setZLKPerSec',
    inputs: [
      {
        name: 'newZLKPerSec',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'direct',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'renounce',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'upgradeTo',
    inputs: [
      {
        name: 'newImplementation',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'upgradeToAndCall',
    inputs: [
      {
        name: 'newImplementation',
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
    name: 'veZLK',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IPVeToken',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'vote',
    inputs: [
      {
        name: 'pools',
        type: 'address[]',
        internalType: 'address[]',
      },
      {
        name: 'weights',
        type: 'uint64[]',
        internalType: 'uint64[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'zenlinkMsgSendEndpoint',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IPMsgSendEndpoint',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'zlkPerSec',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'AddPool',
    inputs: [
      {
        name: 'chainId',
        type: 'uint64',
        indexed: true,
        internalType: 'uint64',
      },
      {
        name: 'pool',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'AdminChanged',
    inputs: [
      {
        name: 'previousAdmin',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'newAdmin',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'BeaconUpgraded',
    inputs: [
      {
        name: 'beacon',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'BroadcastResults',
    inputs: [
      {
        name: 'chainId',
        type: 'uint64',
        indexed: true,
        internalType: 'uint64',
      },
      {
        name: 'wTime',
        type: 'uint128',
        indexed: true,
        internalType: 'uint128',
      },
      {
        name: 'totalZLKPerSec',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint8',
        indexed: false,
        internalType: 'uint8',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PoolVoteChange',
    inputs: [
      {
        name: 'pool',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'vote',
        type: 'tuple',
        indexed: false,
        internalType: 'struct VeBalance',
        components: [
          {
            name: 'bias',
            type: 'uint128',
            internalType: 'uint128',
          },
          {
            name: 'slope',
            type: 'uint128',
            internalType: 'uint128',
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RemovePool',
    inputs: [
      {
        name: 'chainId',
        type: 'uint64',
        indexed: true,
        internalType: 'uint64',
      },
      {
        name: 'pool',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetZLKPerSec',
    inputs: [
      {
        name: 'newZLKPerSec',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Upgraded',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Vote',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'pool',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'weight',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
      {
        name: 'vote',
        type: 'tuple',
        indexed: false,
        internalType: 'struct VeBalance',
        components: [
          {
            name: 'bias',
            type: 'uint128',
            internalType: 'uint128',
          },
          {
            name: 'slope',
            type: 'uint128',
            internalType: 'uint128',
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'ArrayLengthMismatch',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ArrayOutOfBounds',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientFeeToSendMsg',
    inputs: [
      {
        name: 'currentFee',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredFee',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidWTime',
    inputs: [
      {
        name: 'wTime',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'VCEpochNotFinalized',
    inputs: [
      {
        name: 'wTime',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'VCExceededMaxWeight',
    inputs: [
      {
        name: 'totalWeight',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'maxWeight',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'VCInactivePool',
    inputs: [
      {
        name: 'pool',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'VCPoolAlreadyActive',
    inputs: [
      {
        name: 'pool',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'VCPoolAlreadyAddAndRemoved',
    inputs: [
      {
        name: 'pool',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'VCZeroVeZenlink',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'VEZeroSlope',
    inputs: [
      {
        name: 'bias',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'slope',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
  },
] as const
