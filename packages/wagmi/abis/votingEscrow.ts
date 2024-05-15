export const votingEscrow = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_ZLK',
        type: 'address',
        internalType: 'contract IERC20',
      },
    ],
    stateMutability: 'nonpayable',
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
    name: 'MIN_LOCK_TIME',
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
    name: 'ZLK',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IERC20',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
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
    name: 'claimOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getUserHistoryAt',
    inputs: [
      {
        name: 'user',
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
    name: 'getUserHistoryLength',
    inputs: [
      {
        name: 'user',
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
    name: 'increaseLockPosition',
    inputs: [
      {
        name: 'additionalAmountToLock',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'newExpiry',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    outputs: [
      {
        name: 'newVeBalance',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'lastSlopeChangeAppliedAt',
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
    name: 'positionData',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'amount',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'expiry',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'slopeChanges',
    inputs: [
      {
        name: '',
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
    name: 'totalSupplyAndBalanceCurrent',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: '',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'totalSupplyAt',
    inputs: [
      {
        name: '',
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
    name: 'totalSupplyCurrent',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'totalSupplyStored',
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
    name: 'withdraw',
    inputs: [],
    outputs: [
      {
        name: 'amount',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'BroadcastTotalSupply',
    inputs: [
      {
        name: 'newTotalSupply',
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
      {
        name: 'chainIds',
        type: 'uint256[]',
        indexed: false,
        internalType: 'uint256[]',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'BroadcastUserPosition',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'chainIds',
        type: 'uint256[]',
        indexed: false,
        internalType: 'uint256[]',
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
    name: 'NewLockPosition',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'expiry',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
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
    name: 'Withdraw',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'ExpiryInThePast',
    inputs: [
      {
        name: 'expiry',
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
    name: 'VEExceededMaxLockTime',
    inputs: [],
  },
  {
    type: 'error',
    name: 'VEInsufficientLockTime',
    inputs: [],
  },
  {
    type: 'error',
    name: 'VENotAllowedReduceExpiry',
    inputs: [],
  },
  {
    type: 'error',
    name: 'VEPositionNotExpired',
    inputs: [],
  },
  {
    type: 'error',
    name: 'VEZeroAmountLocked',
    inputs: [],
  },
  {
    type: 'error',
    name: 'VEZeroPosition',
    inputs: [],
  },
] as const
