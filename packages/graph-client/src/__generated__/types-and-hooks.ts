import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Big number integer */
  BigInt: any;
  /** Binary data encoded as a hex string always prefixed with 0x */
  Bytes: any;
  /** A date-time string in simplified extended ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) */
  DateTime: any;
  /** A scalar that can represent any JSON value */
  JSON: any;
};

export type Block = {
  __typename?: 'Block';
  calls: Array<Call>;
  events: Array<Event>;
  extrinsics: Array<Extrinsic>;
  extrinsicsRoot: Scalars['String'];
  hash: Scalars['String'];
  height: Scalars['Int'];
  id: Scalars['String'];
  parentHash: Scalars['String'];
  spec: Metadata;
  stateRoot: Scalars['String'];
  timestamp: Scalars['DateTime'];
  validator?: Maybe<Scalars['String']>;
};


export type BlockCallsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CallOrderByInput>>;
  where?: InputMaybe<CallWhereInput>;
};


export type BlockEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EventOrderByInput>>;
  where?: InputMaybe<EventWhereInput>;
};


export type BlockExtrinsicsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ExtrinsicOrderByInput>>;
  where?: InputMaybe<ExtrinsicWhereInput>;
};

export type BlockEdge = {
  __typename?: 'BlockEdge';
  cursor: Scalars['String'];
  node: Block;
};

export enum BlockOrderByInput {
  ExtrinsicsRootAsc = 'extrinsicsRoot_ASC',
  ExtrinsicsRootDesc = 'extrinsicsRoot_DESC',
  HashAsc = 'hash_ASC',
  HashDesc = 'hash_DESC',
  HeightAsc = 'height_ASC',
  HeightDesc = 'height_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ParentHashAsc = 'parentHash_ASC',
  ParentHashDesc = 'parentHash_DESC',
  SpecBlockHashAsc = 'spec_blockHash_ASC',
  SpecBlockHashDesc = 'spec_blockHash_DESC',
  SpecBlockHeightAsc = 'spec_blockHeight_ASC',
  SpecBlockHeightDesc = 'spec_blockHeight_DESC',
  SpecHexAsc = 'spec_hex_ASC',
  SpecHexDesc = 'spec_hex_DESC',
  SpecIdAsc = 'spec_id_ASC',
  SpecIdDesc = 'spec_id_DESC',
  SpecSpecNameAsc = 'spec_specName_ASC',
  SpecSpecNameDesc = 'spec_specName_DESC',
  SpecSpecVersionAsc = 'spec_specVersion_ASC',
  SpecSpecVersionDesc = 'spec_specVersion_DESC',
  StateRootAsc = 'stateRoot_ASC',
  StateRootDesc = 'stateRoot_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  ValidatorAsc = 'validator_ASC',
  ValidatorDesc = 'validator_DESC'
}

export type BlockWhereInput = {
  AND?: InputMaybe<Array<BlockWhereInput>>;
  OR?: InputMaybe<Array<BlockWhereInput>>;
  calls_every?: InputMaybe<CallWhereInput>;
  calls_none?: InputMaybe<CallWhereInput>;
  calls_some?: InputMaybe<CallWhereInput>;
  events_every?: InputMaybe<EventWhereInput>;
  events_none?: InputMaybe<EventWhereInput>;
  events_some?: InputMaybe<EventWhereInput>;
  extrinsicsRoot_contains?: InputMaybe<Scalars['String']>;
  extrinsicsRoot_containsInsensitive?: InputMaybe<Scalars['String']>;
  extrinsicsRoot_endsWith?: InputMaybe<Scalars['String']>;
  extrinsicsRoot_eq?: InputMaybe<Scalars['String']>;
  extrinsicsRoot_gt?: InputMaybe<Scalars['String']>;
  extrinsicsRoot_gte?: InputMaybe<Scalars['String']>;
  extrinsicsRoot_in?: InputMaybe<Array<Scalars['String']>>;
  extrinsicsRoot_isNull?: InputMaybe<Scalars['Boolean']>;
  extrinsicsRoot_lt?: InputMaybe<Scalars['String']>;
  extrinsicsRoot_lte?: InputMaybe<Scalars['String']>;
  extrinsicsRoot_not_contains?: InputMaybe<Scalars['String']>;
  extrinsicsRoot_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  extrinsicsRoot_not_endsWith?: InputMaybe<Scalars['String']>;
  extrinsicsRoot_not_eq?: InputMaybe<Scalars['String']>;
  extrinsicsRoot_not_in?: InputMaybe<Array<Scalars['String']>>;
  extrinsicsRoot_not_startsWith?: InputMaybe<Scalars['String']>;
  extrinsicsRoot_startsWith?: InputMaybe<Scalars['String']>;
  extrinsics_every?: InputMaybe<ExtrinsicWhereInput>;
  extrinsics_none?: InputMaybe<ExtrinsicWhereInput>;
  extrinsics_some?: InputMaybe<ExtrinsicWhereInput>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_containsInsensitive?: InputMaybe<Scalars['String']>;
  hash_endsWith?: InputMaybe<Scalars['String']>;
  hash_eq?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_isNull?: InputMaybe<Scalars['Boolean']>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  hash_not_endsWith?: InputMaybe<Scalars['String']>;
  hash_not_eq?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_startsWith?: InputMaybe<Scalars['String']>;
  hash_startsWith?: InputMaybe<Scalars['String']>;
  height_eq?: InputMaybe<Scalars['Int']>;
  height_gt?: InputMaybe<Scalars['Int']>;
  height_gte?: InputMaybe<Scalars['Int']>;
  height_in?: InputMaybe<Array<Scalars['Int']>>;
  height_isNull?: InputMaybe<Scalars['Boolean']>;
  height_lt?: InputMaybe<Scalars['Int']>;
  height_lte?: InputMaybe<Scalars['Int']>;
  height_not_eq?: InputMaybe<Scalars['Int']>;
  height_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  parentHash_contains?: InputMaybe<Scalars['String']>;
  parentHash_containsInsensitive?: InputMaybe<Scalars['String']>;
  parentHash_endsWith?: InputMaybe<Scalars['String']>;
  parentHash_eq?: InputMaybe<Scalars['String']>;
  parentHash_gt?: InputMaybe<Scalars['String']>;
  parentHash_gte?: InputMaybe<Scalars['String']>;
  parentHash_in?: InputMaybe<Array<Scalars['String']>>;
  parentHash_isNull?: InputMaybe<Scalars['Boolean']>;
  parentHash_lt?: InputMaybe<Scalars['String']>;
  parentHash_lte?: InputMaybe<Scalars['String']>;
  parentHash_not_contains?: InputMaybe<Scalars['String']>;
  parentHash_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  parentHash_not_endsWith?: InputMaybe<Scalars['String']>;
  parentHash_not_eq?: InputMaybe<Scalars['String']>;
  parentHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  parentHash_not_startsWith?: InputMaybe<Scalars['String']>;
  parentHash_startsWith?: InputMaybe<Scalars['String']>;
  spec?: InputMaybe<MetadataWhereInput>;
  spec_isNull?: InputMaybe<Scalars['Boolean']>;
  stateRoot_contains?: InputMaybe<Scalars['String']>;
  stateRoot_containsInsensitive?: InputMaybe<Scalars['String']>;
  stateRoot_endsWith?: InputMaybe<Scalars['String']>;
  stateRoot_eq?: InputMaybe<Scalars['String']>;
  stateRoot_gt?: InputMaybe<Scalars['String']>;
  stateRoot_gte?: InputMaybe<Scalars['String']>;
  stateRoot_in?: InputMaybe<Array<Scalars['String']>>;
  stateRoot_isNull?: InputMaybe<Scalars['Boolean']>;
  stateRoot_lt?: InputMaybe<Scalars['String']>;
  stateRoot_lte?: InputMaybe<Scalars['String']>;
  stateRoot_not_contains?: InputMaybe<Scalars['String']>;
  stateRoot_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  stateRoot_not_endsWith?: InputMaybe<Scalars['String']>;
  stateRoot_not_eq?: InputMaybe<Scalars['String']>;
  stateRoot_not_in?: InputMaybe<Array<Scalars['String']>>;
  stateRoot_not_startsWith?: InputMaybe<Scalars['String']>;
  stateRoot_startsWith?: InputMaybe<Scalars['String']>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
  validator_contains?: InputMaybe<Scalars['String']>;
  validator_containsInsensitive?: InputMaybe<Scalars['String']>;
  validator_endsWith?: InputMaybe<Scalars['String']>;
  validator_eq?: InputMaybe<Scalars['String']>;
  validator_gt?: InputMaybe<Scalars['String']>;
  validator_gte?: InputMaybe<Scalars['String']>;
  validator_in?: InputMaybe<Array<Scalars['String']>>;
  validator_isNull?: InputMaybe<Scalars['Boolean']>;
  validator_lt?: InputMaybe<Scalars['String']>;
  validator_lte?: InputMaybe<Scalars['String']>;
  validator_not_contains?: InputMaybe<Scalars['String']>;
  validator_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  validator_not_endsWith?: InputMaybe<Scalars['String']>;
  validator_not_eq?: InputMaybe<Scalars['String']>;
  validator_not_in?: InputMaybe<Array<Scalars['String']>>;
  validator_not_startsWith?: InputMaybe<Scalars['String']>;
  validator_startsWith?: InputMaybe<Scalars['String']>;
};

export type BlocksConnection = {
  __typename?: 'BlocksConnection';
  edges: Array<BlockEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Bundle = {
  __typename?: 'Bundle';
  /** BigDecimal */
  ethPrice: Scalars['String'];
  id: Scalars['String'];
};

export type BundleEdge = {
  __typename?: 'BundleEdge';
  cursor: Scalars['String'];
  node: Bundle;
};

export enum BundleOrderByInput {
  EthPriceAsc = 'ethPrice_ASC',
  EthPriceDesc = 'ethPrice_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type BundleWhereInput = {
  AND?: InputMaybe<Array<BundleWhereInput>>;
  OR?: InputMaybe<Array<BundleWhereInput>>;
  ethPrice_contains?: InputMaybe<Scalars['String']>;
  ethPrice_containsInsensitive?: InputMaybe<Scalars['String']>;
  ethPrice_endsWith?: InputMaybe<Scalars['String']>;
  ethPrice_eq?: InputMaybe<Scalars['String']>;
  ethPrice_gt?: InputMaybe<Scalars['String']>;
  ethPrice_gte?: InputMaybe<Scalars['String']>;
  ethPrice_in?: InputMaybe<Array<Scalars['String']>>;
  ethPrice_isNull?: InputMaybe<Scalars['Boolean']>;
  ethPrice_lt?: InputMaybe<Scalars['String']>;
  ethPrice_lte?: InputMaybe<Scalars['String']>;
  ethPrice_not_contains?: InputMaybe<Scalars['String']>;
  ethPrice_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  ethPrice_not_endsWith?: InputMaybe<Scalars['String']>;
  ethPrice_not_eq?: InputMaybe<Scalars['String']>;
  ethPrice_not_in?: InputMaybe<Array<Scalars['String']>>;
  ethPrice_not_startsWith?: InputMaybe<Scalars['String']>;
  ethPrice_startsWith?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
};

export type BundlesConnection = {
  __typename?: 'BundlesConnection';
  edges: Array<BundleEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Burn = {
  __typename?: 'Burn';
  amount0?: Maybe<Scalars['String']>;
  amount1?: Maybe<Scalars['String']>;
  amountUSD?: Maybe<Scalars['String']>;
  feeLiquidity?: Maybe<Scalars['String']>;
  feeTo?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  liquidity: Scalars['String'];
  logIndex?: Maybe<Scalars['Int']>;
  needsComplete: Scalars['Boolean'];
  pair: Pair;
  sender?: Maybe<Scalars['String']>;
  timestamp: Scalars['DateTime'];
  to?: Maybe<Scalars['String']>;
  transaction: Transaction;
};

export type BurnEdge = {
  __typename?: 'BurnEdge';
  cursor: Scalars['String'];
  node: Burn;
};

export enum BurnOrderByInput {
  Amount0Asc = 'amount0_ASC',
  Amount0Desc = 'amount0_DESC',
  Amount1Asc = 'amount1_ASC',
  Amount1Desc = 'amount1_DESC',
  AmountUsdAsc = 'amountUSD_ASC',
  AmountUsdDesc = 'amountUSD_DESC',
  FeeLiquidityAsc = 'feeLiquidity_ASC',
  FeeLiquidityDesc = 'feeLiquidity_DESC',
  FeeToAsc = 'feeTo_ASC',
  FeeToDesc = 'feeTo_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LiquidityAsc = 'liquidity_ASC',
  LiquidityDesc = 'liquidity_DESC',
  LogIndexAsc = 'logIndex_ASC',
  LogIndexDesc = 'logIndex_DESC',
  NeedsCompleteAsc = 'needsComplete_ASC',
  NeedsCompleteDesc = 'needsComplete_DESC',
  PairCreatedAtBlockNumberAsc = 'pair_createdAtBlockNumber_ASC',
  PairCreatedAtBlockNumberDesc = 'pair_createdAtBlockNumber_DESC',
  PairCreatedAtTimestampAsc = 'pair_createdAtTimestamp_ASC',
  PairCreatedAtTimestampDesc = 'pair_createdAtTimestamp_DESC',
  PairIdAsc = 'pair_id_ASC',
  PairIdDesc = 'pair_id_DESC',
  PairLiquidityProviderCountAsc = 'pair_liquidityProviderCount_ASC',
  PairLiquidityProviderCountDesc = 'pair_liquidityProviderCount_DESC',
  PairReserve0Asc = 'pair_reserve0_ASC',
  PairReserve0Desc = 'pair_reserve0_DESC',
  PairReserve1Asc = 'pair_reserve1_ASC',
  PairReserve1Desc = 'pair_reserve1_DESC',
  PairReserveEthAsc = 'pair_reserveETH_ASC',
  PairReserveEthDesc = 'pair_reserveETH_DESC',
  PairReserveUsdAsc = 'pair_reserveUSD_ASC',
  PairReserveUsdDesc = 'pair_reserveUSD_DESC',
  PairToken0PriceAsc = 'pair_token0Price_ASC',
  PairToken0PriceDesc = 'pair_token0Price_DESC',
  PairToken1PriceAsc = 'pair_token1Price_ASC',
  PairToken1PriceDesc = 'pair_token1Price_DESC',
  PairTotalSupplyAsc = 'pair_totalSupply_ASC',
  PairTotalSupplyDesc = 'pair_totalSupply_DESC',
  PairTrackedReserveEthAsc = 'pair_trackedReserveETH_ASC',
  PairTrackedReserveEthDesc = 'pair_trackedReserveETH_DESC',
  PairTxCountAsc = 'pair_txCount_ASC',
  PairTxCountDesc = 'pair_txCount_DESC',
  PairUntrackedVolumeUsdAsc = 'pair_untrackedVolumeUSD_ASC',
  PairUntrackedVolumeUsdDesc = 'pair_untrackedVolumeUSD_DESC',
  PairVolumeToken0Asc = 'pair_volumeToken0_ASC',
  PairVolumeToken0Desc = 'pair_volumeToken0_DESC',
  PairVolumeToken1Asc = 'pair_volumeToken1_ASC',
  PairVolumeToken1Desc = 'pair_volumeToken1_DESC',
  PairVolumeUsdAsc = 'pair_volumeUSD_ASC',
  PairVolumeUsdDesc = 'pair_volumeUSD_DESC',
  SenderAsc = 'sender_ASC',
  SenderDesc = 'sender_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  ToAsc = 'to_ASC',
  ToDesc = 'to_DESC',
  TransactionBlockNumberAsc = 'transaction_blockNumber_ASC',
  TransactionBlockNumberDesc = 'transaction_blockNumber_DESC',
  TransactionIdAsc = 'transaction_id_ASC',
  TransactionIdDesc = 'transaction_id_DESC',
  TransactionTimestampAsc = 'transaction_timestamp_ASC',
  TransactionTimestampDesc = 'transaction_timestamp_DESC'
}

export type BurnWhereInput = {
  AND?: InputMaybe<Array<BurnWhereInput>>;
  OR?: InputMaybe<Array<BurnWhereInput>>;
  amount0_contains?: InputMaybe<Scalars['String']>;
  amount0_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount0_endsWith?: InputMaybe<Scalars['String']>;
  amount0_eq?: InputMaybe<Scalars['String']>;
  amount0_gt?: InputMaybe<Scalars['String']>;
  amount0_gte?: InputMaybe<Scalars['String']>;
  amount0_in?: InputMaybe<Array<Scalars['String']>>;
  amount0_isNull?: InputMaybe<Scalars['Boolean']>;
  amount0_lt?: InputMaybe<Scalars['String']>;
  amount0_lte?: InputMaybe<Scalars['String']>;
  amount0_not_contains?: InputMaybe<Scalars['String']>;
  amount0_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount0_not_endsWith?: InputMaybe<Scalars['String']>;
  amount0_not_eq?: InputMaybe<Scalars['String']>;
  amount0_not_in?: InputMaybe<Array<Scalars['String']>>;
  amount0_not_startsWith?: InputMaybe<Scalars['String']>;
  amount0_startsWith?: InputMaybe<Scalars['String']>;
  amount1_contains?: InputMaybe<Scalars['String']>;
  amount1_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount1_endsWith?: InputMaybe<Scalars['String']>;
  amount1_eq?: InputMaybe<Scalars['String']>;
  amount1_gt?: InputMaybe<Scalars['String']>;
  amount1_gte?: InputMaybe<Scalars['String']>;
  amount1_in?: InputMaybe<Array<Scalars['String']>>;
  amount1_isNull?: InputMaybe<Scalars['Boolean']>;
  amount1_lt?: InputMaybe<Scalars['String']>;
  amount1_lte?: InputMaybe<Scalars['String']>;
  amount1_not_contains?: InputMaybe<Scalars['String']>;
  amount1_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount1_not_endsWith?: InputMaybe<Scalars['String']>;
  amount1_not_eq?: InputMaybe<Scalars['String']>;
  amount1_not_in?: InputMaybe<Array<Scalars['String']>>;
  amount1_not_startsWith?: InputMaybe<Scalars['String']>;
  amount1_startsWith?: InputMaybe<Scalars['String']>;
  amountUSD_contains?: InputMaybe<Scalars['String']>;
  amountUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  amountUSD_endsWith?: InputMaybe<Scalars['String']>;
  amountUSD_eq?: InputMaybe<Scalars['String']>;
  amountUSD_gt?: InputMaybe<Scalars['String']>;
  amountUSD_gte?: InputMaybe<Scalars['String']>;
  amountUSD_in?: InputMaybe<Array<Scalars['String']>>;
  amountUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  amountUSD_lt?: InputMaybe<Scalars['String']>;
  amountUSD_lte?: InputMaybe<Scalars['String']>;
  amountUSD_not_contains?: InputMaybe<Scalars['String']>;
  amountUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  amountUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  amountUSD_not_eq?: InputMaybe<Scalars['String']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  amountUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  amountUSD_startsWith?: InputMaybe<Scalars['String']>;
  feeLiquidity_contains?: InputMaybe<Scalars['String']>;
  feeLiquidity_containsInsensitive?: InputMaybe<Scalars['String']>;
  feeLiquidity_endsWith?: InputMaybe<Scalars['String']>;
  feeLiquidity_eq?: InputMaybe<Scalars['String']>;
  feeLiquidity_gt?: InputMaybe<Scalars['String']>;
  feeLiquidity_gte?: InputMaybe<Scalars['String']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['String']>>;
  feeLiquidity_isNull?: InputMaybe<Scalars['Boolean']>;
  feeLiquidity_lt?: InputMaybe<Scalars['String']>;
  feeLiquidity_lte?: InputMaybe<Scalars['String']>;
  feeLiquidity_not_contains?: InputMaybe<Scalars['String']>;
  feeLiquidity_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  feeLiquidity_not_endsWith?: InputMaybe<Scalars['String']>;
  feeLiquidity_not_eq?: InputMaybe<Scalars['String']>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['String']>>;
  feeLiquidity_not_startsWith?: InputMaybe<Scalars['String']>;
  feeLiquidity_startsWith?: InputMaybe<Scalars['String']>;
  feeTo_contains?: InputMaybe<Scalars['String']>;
  feeTo_containsInsensitive?: InputMaybe<Scalars['String']>;
  feeTo_endsWith?: InputMaybe<Scalars['String']>;
  feeTo_eq?: InputMaybe<Scalars['String']>;
  feeTo_gt?: InputMaybe<Scalars['String']>;
  feeTo_gte?: InputMaybe<Scalars['String']>;
  feeTo_in?: InputMaybe<Array<Scalars['String']>>;
  feeTo_isNull?: InputMaybe<Scalars['Boolean']>;
  feeTo_lt?: InputMaybe<Scalars['String']>;
  feeTo_lte?: InputMaybe<Scalars['String']>;
  feeTo_not_contains?: InputMaybe<Scalars['String']>;
  feeTo_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  feeTo_not_endsWith?: InputMaybe<Scalars['String']>;
  feeTo_not_eq?: InputMaybe<Scalars['String']>;
  feeTo_not_in?: InputMaybe<Array<Scalars['String']>>;
  feeTo_not_startsWith?: InputMaybe<Scalars['String']>;
  feeTo_startsWith?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  liquidity_contains?: InputMaybe<Scalars['String']>;
  liquidity_containsInsensitive?: InputMaybe<Scalars['String']>;
  liquidity_endsWith?: InputMaybe<Scalars['String']>;
  liquidity_eq?: InputMaybe<Scalars['String']>;
  liquidity_gt?: InputMaybe<Scalars['String']>;
  liquidity_gte?: InputMaybe<Scalars['String']>;
  liquidity_in?: InputMaybe<Array<Scalars['String']>>;
  liquidity_isNull?: InputMaybe<Scalars['Boolean']>;
  liquidity_lt?: InputMaybe<Scalars['String']>;
  liquidity_lte?: InputMaybe<Scalars['String']>;
  liquidity_not_contains?: InputMaybe<Scalars['String']>;
  liquidity_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  liquidity_not_endsWith?: InputMaybe<Scalars['String']>;
  liquidity_not_eq?: InputMaybe<Scalars['String']>;
  liquidity_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidity_not_startsWith?: InputMaybe<Scalars['String']>;
  liquidity_startsWith?: InputMaybe<Scalars['String']>;
  logIndex_eq?: InputMaybe<Scalars['Int']>;
  logIndex_gt?: InputMaybe<Scalars['Int']>;
  logIndex_gte?: InputMaybe<Scalars['Int']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']>>;
  logIndex_isNull?: InputMaybe<Scalars['Boolean']>;
  logIndex_lt?: InputMaybe<Scalars['Int']>;
  logIndex_lte?: InputMaybe<Scalars['Int']>;
  logIndex_not_eq?: InputMaybe<Scalars['Int']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']>>;
  needsComplete_eq?: InputMaybe<Scalars['Boolean']>;
  needsComplete_isNull?: InputMaybe<Scalars['Boolean']>;
  needsComplete_not_eq?: InputMaybe<Scalars['Boolean']>;
  pair?: InputMaybe<PairWhereInput>;
  pair_isNull?: InputMaybe<Scalars['Boolean']>;
  sender_contains?: InputMaybe<Scalars['String']>;
  sender_containsInsensitive?: InputMaybe<Scalars['String']>;
  sender_endsWith?: InputMaybe<Scalars['String']>;
  sender_eq?: InputMaybe<Scalars['String']>;
  sender_gt?: InputMaybe<Scalars['String']>;
  sender_gte?: InputMaybe<Scalars['String']>;
  sender_in?: InputMaybe<Array<Scalars['String']>>;
  sender_isNull?: InputMaybe<Scalars['Boolean']>;
  sender_lt?: InputMaybe<Scalars['String']>;
  sender_lte?: InputMaybe<Scalars['String']>;
  sender_not_contains?: InputMaybe<Scalars['String']>;
  sender_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  sender_not_endsWith?: InputMaybe<Scalars['String']>;
  sender_not_eq?: InputMaybe<Scalars['String']>;
  sender_not_in?: InputMaybe<Array<Scalars['String']>>;
  sender_not_startsWith?: InputMaybe<Scalars['String']>;
  sender_startsWith?: InputMaybe<Scalars['String']>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
  to_contains?: InputMaybe<Scalars['String']>;
  to_containsInsensitive?: InputMaybe<Scalars['String']>;
  to_endsWith?: InputMaybe<Scalars['String']>;
  to_eq?: InputMaybe<Scalars['String']>;
  to_gt?: InputMaybe<Scalars['String']>;
  to_gte?: InputMaybe<Scalars['String']>;
  to_in?: InputMaybe<Array<Scalars['String']>>;
  to_isNull?: InputMaybe<Scalars['Boolean']>;
  to_lt?: InputMaybe<Scalars['String']>;
  to_lte?: InputMaybe<Scalars['String']>;
  to_not_contains?: InputMaybe<Scalars['String']>;
  to_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  to_not_endsWith?: InputMaybe<Scalars['String']>;
  to_not_eq?: InputMaybe<Scalars['String']>;
  to_not_in?: InputMaybe<Array<Scalars['String']>>;
  to_not_startsWith?: InputMaybe<Scalars['String']>;
  to_startsWith?: InputMaybe<Scalars['String']>;
  transaction?: InputMaybe<TransactionWhereInput>;
  transaction_isNull?: InputMaybe<Scalars['Boolean']>;
};

export type BurnsConnection = {
  __typename?: 'BurnsConnection';
  edges: Array<BurnEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Call = {
  __typename?: 'Call';
  args?: Maybe<Scalars['JSON']>;
  block: Block;
  error?: Maybe<Scalars['JSON']>;
  extrinsic: Extrinsic;
  id: Scalars['String'];
  name: Scalars['String'];
  origin?: Maybe<Scalars['JSON']>;
  parent?: Maybe<Call>;
  pos: Scalars['Int'];
  success: Scalars['Boolean'];
};

export type CallEdge = {
  __typename?: 'CallEdge';
  cursor: Scalars['String'];
  node: Call;
};

export enum CallOrderByInput {
  BlockExtrinsicsRootAsc = 'block_extrinsicsRoot_ASC',
  BlockExtrinsicsRootDesc = 'block_extrinsicsRoot_DESC',
  BlockHashAsc = 'block_hash_ASC',
  BlockHashDesc = 'block_hash_DESC',
  BlockHeightAsc = 'block_height_ASC',
  BlockHeightDesc = 'block_height_DESC',
  BlockIdAsc = 'block_id_ASC',
  BlockIdDesc = 'block_id_DESC',
  BlockParentHashAsc = 'block_parentHash_ASC',
  BlockParentHashDesc = 'block_parentHash_DESC',
  BlockStateRootAsc = 'block_stateRoot_ASC',
  BlockStateRootDesc = 'block_stateRoot_DESC',
  BlockTimestampAsc = 'block_timestamp_ASC',
  BlockTimestampDesc = 'block_timestamp_DESC',
  BlockValidatorAsc = 'block_validator_ASC',
  BlockValidatorDesc = 'block_validator_DESC',
  ExtrinsicFeeAsc = 'extrinsic_fee_ASC',
  ExtrinsicFeeDesc = 'extrinsic_fee_DESC',
  ExtrinsicHashAsc = 'extrinsic_hash_ASC',
  ExtrinsicHashDesc = 'extrinsic_hash_DESC',
  ExtrinsicIdAsc = 'extrinsic_id_ASC',
  ExtrinsicIdDesc = 'extrinsic_id_DESC',
  ExtrinsicIndexInBlockAsc = 'extrinsic_indexInBlock_ASC',
  ExtrinsicIndexInBlockDesc = 'extrinsic_indexInBlock_DESC',
  ExtrinsicPosAsc = 'extrinsic_pos_ASC',
  ExtrinsicPosDesc = 'extrinsic_pos_DESC',
  ExtrinsicSuccessAsc = 'extrinsic_success_ASC',
  ExtrinsicSuccessDesc = 'extrinsic_success_DESC',
  ExtrinsicTipAsc = 'extrinsic_tip_ASC',
  ExtrinsicTipDesc = 'extrinsic_tip_DESC',
  ExtrinsicVersionAsc = 'extrinsic_version_ASC',
  ExtrinsicVersionDesc = 'extrinsic_version_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  ParentIdAsc = 'parent_id_ASC',
  ParentIdDesc = 'parent_id_DESC',
  ParentNameAsc = 'parent_name_ASC',
  ParentNameDesc = 'parent_name_DESC',
  ParentPosAsc = 'parent_pos_ASC',
  ParentPosDesc = 'parent_pos_DESC',
  ParentSuccessAsc = 'parent_success_ASC',
  ParentSuccessDesc = 'parent_success_DESC',
  PosAsc = 'pos_ASC',
  PosDesc = 'pos_DESC',
  SuccessAsc = 'success_ASC',
  SuccessDesc = 'success_DESC'
}

export type CallWhereInput = {
  AND?: InputMaybe<Array<CallWhereInput>>;
  OR?: InputMaybe<Array<CallWhereInput>>;
  args_eq?: InputMaybe<Scalars['JSON']>;
  args_isNull?: InputMaybe<Scalars['Boolean']>;
  args_jsonContains?: InputMaybe<Scalars['JSON']>;
  args_jsonHasKey?: InputMaybe<Scalars['JSON']>;
  args_not_eq?: InputMaybe<Scalars['JSON']>;
  block?: InputMaybe<BlockWhereInput>;
  block_isNull?: InputMaybe<Scalars['Boolean']>;
  error_eq?: InputMaybe<Scalars['JSON']>;
  error_isNull?: InputMaybe<Scalars['Boolean']>;
  error_jsonContains?: InputMaybe<Scalars['JSON']>;
  error_jsonHasKey?: InputMaybe<Scalars['JSON']>;
  error_not_eq?: InputMaybe<Scalars['JSON']>;
  extrinsic?: InputMaybe<ExtrinsicWhereInput>;
  extrinsic_isNull?: InputMaybe<Scalars['Boolean']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_endsWith?: InputMaybe<Scalars['String']>;
  name_eq?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_not_endsWith?: InputMaybe<Scalars['String']>;
  name_not_eq?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']>;
  name_startsWith?: InputMaybe<Scalars['String']>;
  origin_eq?: InputMaybe<Scalars['JSON']>;
  origin_isNull?: InputMaybe<Scalars['Boolean']>;
  origin_jsonContains?: InputMaybe<Scalars['JSON']>;
  origin_jsonHasKey?: InputMaybe<Scalars['JSON']>;
  origin_not_eq?: InputMaybe<Scalars['JSON']>;
  parent?: InputMaybe<CallWhereInput>;
  parent_isNull?: InputMaybe<Scalars['Boolean']>;
  pos_eq?: InputMaybe<Scalars['Int']>;
  pos_gt?: InputMaybe<Scalars['Int']>;
  pos_gte?: InputMaybe<Scalars['Int']>;
  pos_in?: InputMaybe<Array<Scalars['Int']>>;
  pos_isNull?: InputMaybe<Scalars['Boolean']>;
  pos_lt?: InputMaybe<Scalars['Int']>;
  pos_lte?: InputMaybe<Scalars['Int']>;
  pos_not_eq?: InputMaybe<Scalars['Int']>;
  pos_not_in?: InputMaybe<Array<Scalars['Int']>>;
  success_eq?: InputMaybe<Scalars['Boolean']>;
  success_isNull?: InputMaybe<Scalars['Boolean']>;
  success_not_eq?: InputMaybe<Scalars['Boolean']>;
};

export type CallsConnection = {
  __typename?: 'CallsConnection';
  edges: Array<CallEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Event = {
  __typename?: 'Event';
  args?: Maybe<Scalars['JSON']>;
  block: Block;
  call?: Maybe<Call>;
  extrinsic?: Maybe<Extrinsic>;
  id: Scalars['String'];
  indexInBlock: Scalars['Int'];
  name: Scalars['String'];
  phase: Scalars['String'];
  pos: Scalars['Int'];
};

export type EventEdge = {
  __typename?: 'EventEdge';
  cursor: Scalars['String'];
  node: Event;
};

export enum EventOrderByInput {
  BlockExtrinsicsRootAsc = 'block_extrinsicsRoot_ASC',
  BlockExtrinsicsRootDesc = 'block_extrinsicsRoot_DESC',
  BlockHashAsc = 'block_hash_ASC',
  BlockHashDesc = 'block_hash_DESC',
  BlockHeightAsc = 'block_height_ASC',
  BlockHeightDesc = 'block_height_DESC',
  BlockIdAsc = 'block_id_ASC',
  BlockIdDesc = 'block_id_DESC',
  BlockParentHashAsc = 'block_parentHash_ASC',
  BlockParentHashDesc = 'block_parentHash_DESC',
  BlockStateRootAsc = 'block_stateRoot_ASC',
  BlockStateRootDesc = 'block_stateRoot_DESC',
  BlockTimestampAsc = 'block_timestamp_ASC',
  BlockTimestampDesc = 'block_timestamp_DESC',
  BlockValidatorAsc = 'block_validator_ASC',
  BlockValidatorDesc = 'block_validator_DESC',
  CallIdAsc = 'call_id_ASC',
  CallIdDesc = 'call_id_DESC',
  CallNameAsc = 'call_name_ASC',
  CallNameDesc = 'call_name_DESC',
  CallPosAsc = 'call_pos_ASC',
  CallPosDesc = 'call_pos_DESC',
  CallSuccessAsc = 'call_success_ASC',
  CallSuccessDesc = 'call_success_DESC',
  ExtrinsicFeeAsc = 'extrinsic_fee_ASC',
  ExtrinsicFeeDesc = 'extrinsic_fee_DESC',
  ExtrinsicHashAsc = 'extrinsic_hash_ASC',
  ExtrinsicHashDesc = 'extrinsic_hash_DESC',
  ExtrinsicIdAsc = 'extrinsic_id_ASC',
  ExtrinsicIdDesc = 'extrinsic_id_DESC',
  ExtrinsicIndexInBlockAsc = 'extrinsic_indexInBlock_ASC',
  ExtrinsicIndexInBlockDesc = 'extrinsic_indexInBlock_DESC',
  ExtrinsicPosAsc = 'extrinsic_pos_ASC',
  ExtrinsicPosDesc = 'extrinsic_pos_DESC',
  ExtrinsicSuccessAsc = 'extrinsic_success_ASC',
  ExtrinsicSuccessDesc = 'extrinsic_success_DESC',
  ExtrinsicTipAsc = 'extrinsic_tip_ASC',
  ExtrinsicTipDesc = 'extrinsic_tip_DESC',
  ExtrinsicVersionAsc = 'extrinsic_version_ASC',
  ExtrinsicVersionDesc = 'extrinsic_version_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IndexInBlockAsc = 'indexInBlock_ASC',
  IndexInBlockDesc = 'indexInBlock_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  PhaseAsc = 'phase_ASC',
  PhaseDesc = 'phase_DESC',
  PosAsc = 'pos_ASC',
  PosDesc = 'pos_DESC'
}

export type EventWhereInput = {
  AND?: InputMaybe<Array<EventWhereInput>>;
  OR?: InputMaybe<Array<EventWhereInput>>;
  args_eq?: InputMaybe<Scalars['JSON']>;
  args_isNull?: InputMaybe<Scalars['Boolean']>;
  args_jsonContains?: InputMaybe<Scalars['JSON']>;
  args_jsonHasKey?: InputMaybe<Scalars['JSON']>;
  args_not_eq?: InputMaybe<Scalars['JSON']>;
  block?: InputMaybe<BlockWhereInput>;
  block_isNull?: InputMaybe<Scalars['Boolean']>;
  call?: InputMaybe<CallWhereInput>;
  call_isNull?: InputMaybe<Scalars['Boolean']>;
  extrinsic?: InputMaybe<ExtrinsicWhereInput>;
  extrinsic_isNull?: InputMaybe<Scalars['Boolean']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  indexInBlock_eq?: InputMaybe<Scalars['Int']>;
  indexInBlock_gt?: InputMaybe<Scalars['Int']>;
  indexInBlock_gte?: InputMaybe<Scalars['Int']>;
  indexInBlock_in?: InputMaybe<Array<Scalars['Int']>>;
  indexInBlock_isNull?: InputMaybe<Scalars['Boolean']>;
  indexInBlock_lt?: InputMaybe<Scalars['Int']>;
  indexInBlock_lte?: InputMaybe<Scalars['Int']>;
  indexInBlock_not_eq?: InputMaybe<Scalars['Int']>;
  indexInBlock_not_in?: InputMaybe<Array<Scalars['Int']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_endsWith?: InputMaybe<Scalars['String']>;
  name_eq?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_not_endsWith?: InputMaybe<Scalars['String']>;
  name_not_eq?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']>;
  name_startsWith?: InputMaybe<Scalars['String']>;
  phase_contains?: InputMaybe<Scalars['String']>;
  phase_containsInsensitive?: InputMaybe<Scalars['String']>;
  phase_endsWith?: InputMaybe<Scalars['String']>;
  phase_eq?: InputMaybe<Scalars['String']>;
  phase_gt?: InputMaybe<Scalars['String']>;
  phase_gte?: InputMaybe<Scalars['String']>;
  phase_in?: InputMaybe<Array<Scalars['String']>>;
  phase_isNull?: InputMaybe<Scalars['Boolean']>;
  phase_lt?: InputMaybe<Scalars['String']>;
  phase_lte?: InputMaybe<Scalars['String']>;
  phase_not_contains?: InputMaybe<Scalars['String']>;
  phase_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  phase_not_endsWith?: InputMaybe<Scalars['String']>;
  phase_not_eq?: InputMaybe<Scalars['String']>;
  phase_not_in?: InputMaybe<Array<Scalars['String']>>;
  phase_not_startsWith?: InputMaybe<Scalars['String']>;
  phase_startsWith?: InputMaybe<Scalars['String']>;
  pos_eq?: InputMaybe<Scalars['Int']>;
  pos_gt?: InputMaybe<Scalars['Int']>;
  pos_gte?: InputMaybe<Scalars['Int']>;
  pos_in?: InputMaybe<Array<Scalars['Int']>>;
  pos_isNull?: InputMaybe<Scalars['Boolean']>;
  pos_lt?: InputMaybe<Scalars['Int']>;
  pos_lte?: InputMaybe<Scalars['Int']>;
  pos_not_eq?: InputMaybe<Scalars['Int']>;
  pos_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export type EventsConnection = {
  __typename?: 'EventsConnection';
  edges: Array<EventEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Extrinsic = {
  __typename?: 'Extrinsic';
  block: Block;
  call: Call;
  calls: Array<Call>;
  error?: Maybe<Scalars['JSON']>;
  fee?: Maybe<Scalars['BigInt']>;
  hash: Scalars['String'];
  id: Scalars['String'];
  indexInBlock: Scalars['Int'];
  pos: Scalars['Int'];
  signature?: Maybe<Scalars['JSON']>;
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['BigInt']>;
  version: Scalars['Int'];
};


export type ExtrinsicCallsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CallOrderByInput>>;
  where?: InputMaybe<CallWhereInput>;
};

export type ExtrinsicEdge = {
  __typename?: 'ExtrinsicEdge';
  cursor: Scalars['String'];
  node: Extrinsic;
};

export enum ExtrinsicOrderByInput {
  BlockExtrinsicsRootAsc = 'block_extrinsicsRoot_ASC',
  BlockExtrinsicsRootDesc = 'block_extrinsicsRoot_DESC',
  BlockHashAsc = 'block_hash_ASC',
  BlockHashDesc = 'block_hash_DESC',
  BlockHeightAsc = 'block_height_ASC',
  BlockHeightDesc = 'block_height_DESC',
  BlockIdAsc = 'block_id_ASC',
  BlockIdDesc = 'block_id_DESC',
  BlockParentHashAsc = 'block_parentHash_ASC',
  BlockParentHashDesc = 'block_parentHash_DESC',
  BlockStateRootAsc = 'block_stateRoot_ASC',
  BlockStateRootDesc = 'block_stateRoot_DESC',
  BlockTimestampAsc = 'block_timestamp_ASC',
  BlockTimestampDesc = 'block_timestamp_DESC',
  BlockValidatorAsc = 'block_validator_ASC',
  BlockValidatorDesc = 'block_validator_DESC',
  CallIdAsc = 'call_id_ASC',
  CallIdDesc = 'call_id_DESC',
  CallNameAsc = 'call_name_ASC',
  CallNameDesc = 'call_name_DESC',
  CallPosAsc = 'call_pos_ASC',
  CallPosDesc = 'call_pos_DESC',
  CallSuccessAsc = 'call_success_ASC',
  CallSuccessDesc = 'call_success_DESC',
  FeeAsc = 'fee_ASC',
  FeeDesc = 'fee_DESC',
  HashAsc = 'hash_ASC',
  HashDesc = 'hash_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IndexInBlockAsc = 'indexInBlock_ASC',
  IndexInBlockDesc = 'indexInBlock_DESC',
  PosAsc = 'pos_ASC',
  PosDesc = 'pos_DESC',
  SuccessAsc = 'success_ASC',
  SuccessDesc = 'success_DESC',
  TipAsc = 'tip_ASC',
  TipDesc = 'tip_DESC',
  VersionAsc = 'version_ASC',
  VersionDesc = 'version_DESC'
}

export type ExtrinsicWhereInput = {
  AND?: InputMaybe<Array<ExtrinsicWhereInput>>;
  OR?: InputMaybe<Array<ExtrinsicWhereInput>>;
  block?: InputMaybe<BlockWhereInput>;
  block_isNull?: InputMaybe<Scalars['Boolean']>;
  call?: InputMaybe<CallWhereInput>;
  call_isNull?: InputMaybe<Scalars['Boolean']>;
  calls_every?: InputMaybe<CallWhereInput>;
  calls_none?: InputMaybe<CallWhereInput>;
  calls_some?: InputMaybe<CallWhereInput>;
  error_eq?: InputMaybe<Scalars['JSON']>;
  error_isNull?: InputMaybe<Scalars['Boolean']>;
  error_jsonContains?: InputMaybe<Scalars['JSON']>;
  error_jsonHasKey?: InputMaybe<Scalars['JSON']>;
  error_not_eq?: InputMaybe<Scalars['JSON']>;
  fee_eq?: InputMaybe<Scalars['BigInt']>;
  fee_gt?: InputMaybe<Scalars['BigInt']>;
  fee_gte?: InputMaybe<Scalars['BigInt']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee_isNull?: InputMaybe<Scalars['Boolean']>;
  fee_lt?: InputMaybe<Scalars['BigInt']>;
  fee_lte?: InputMaybe<Scalars['BigInt']>;
  fee_not_eq?: InputMaybe<Scalars['BigInt']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_containsInsensitive?: InputMaybe<Scalars['String']>;
  hash_endsWith?: InputMaybe<Scalars['String']>;
  hash_eq?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_isNull?: InputMaybe<Scalars['Boolean']>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  hash_not_endsWith?: InputMaybe<Scalars['String']>;
  hash_not_eq?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_startsWith?: InputMaybe<Scalars['String']>;
  hash_startsWith?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  indexInBlock_eq?: InputMaybe<Scalars['Int']>;
  indexInBlock_gt?: InputMaybe<Scalars['Int']>;
  indexInBlock_gte?: InputMaybe<Scalars['Int']>;
  indexInBlock_in?: InputMaybe<Array<Scalars['Int']>>;
  indexInBlock_isNull?: InputMaybe<Scalars['Boolean']>;
  indexInBlock_lt?: InputMaybe<Scalars['Int']>;
  indexInBlock_lte?: InputMaybe<Scalars['Int']>;
  indexInBlock_not_eq?: InputMaybe<Scalars['Int']>;
  indexInBlock_not_in?: InputMaybe<Array<Scalars['Int']>>;
  pos_eq?: InputMaybe<Scalars['Int']>;
  pos_gt?: InputMaybe<Scalars['Int']>;
  pos_gte?: InputMaybe<Scalars['Int']>;
  pos_in?: InputMaybe<Array<Scalars['Int']>>;
  pos_isNull?: InputMaybe<Scalars['Boolean']>;
  pos_lt?: InputMaybe<Scalars['Int']>;
  pos_lte?: InputMaybe<Scalars['Int']>;
  pos_not_eq?: InputMaybe<Scalars['Int']>;
  pos_not_in?: InputMaybe<Array<Scalars['Int']>>;
  signature_eq?: InputMaybe<Scalars['JSON']>;
  signature_isNull?: InputMaybe<Scalars['Boolean']>;
  signature_jsonContains?: InputMaybe<Scalars['JSON']>;
  signature_jsonHasKey?: InputMaybe<Scalars['JSON']>;
  signature_not_eq?: InputMaybe<Scalars['JSON']>;
  success_eq?: InputMaybe<Scalars['Boolean']>;
  success_isNull?: InputMaybe<Scalars['Boolean']>;
  success_not_eq?: InputMaybe<Scalars['Boolean']>;
  tip_eq?: InputMaybe<Scalars['BigInt']>;
  tip_gt?: InputMaybe<Scalars['BigInt']>;
  tip_gte?: InputMaybe<Scalars['BigInt']>;
  tip_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tip_isNull?: InputMaybe<Scalars['Boolean']>;
  tip_lt?: InputMaybe<Scalars['BigInt']>;
  tip_lte?: InputMaybe<Scalars['BigInt']>;
  tip_not_eq?: InputMaybe<Scalars['BigInt']>;
  tip_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  version_eq?: InputMaybe<Scalars['Int']>;
  version_gt?: InputMaybe<Scalars['Int']>;
  version_gte?: InputMaybe<Scalars['Int']>;
  version_in?: InputMaybe<Array<Scalars['Int']>>;
  version_isNull?: InputMaybe<Scalars['Boolean']>;
  version_lt?: InputMaybe<Scalars['Int']>;
  version_lte?: InputMaybe<Scalars['Int']>;
  version_not_eq?: InputMaybe<Scalars['Int']>;
  version_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export type ExtrinsicsConnection = {
  __typename?: 'ExtrinsicsConnection';
  edges: Array<ExtrinsicEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type FactoriesConnection = {
  __typename?: 'FactoriesConnection';
  edges: Array<FactoryEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Factory = {
  __typename?: 'Factory';
  id: Scalars['String'];
  pairCount: Scalars['Int'];
  /** BigDecimal */
  totalLiquidityETH: Scalars['String'];
  /** BigDecimal */
  totalLiquidityUSD: Scalars['String'];
  /** BigDecimal */
  totalVolumeETH: Scalars['String'];
  /** BigDecimal */
  totalVolumeUSD: Scalars['String'];
  txCount: Scalars['Int'];
  /** BigDecimal */
  untrackedVolumeUSD: Scalars['String'];
};

export type FactoryDayData = {
  __typename?: 'FactoryDayData';
  dailyVolumeETH: Scalars['String'];
  dailyVolumeUSD: Scalars['String'];
  dailyVolumeUntracked: Scalars['String'];
  date: Scalars['DateTime'];
  id: Scalars['String'];
  totalLiquidityETH: Scalars['String'];
  totalLiquidityUSD: Scalars['String'];
  totalVolumeETH: Scalars['String'];
  totalVolumeUSD: Scalars['String'];
  txCount: Scalars['Int'];
};

export type FactoryDayDataConnection = {
  __typename?: 'FactoryDayDataConnection';
  edges: Array<FactoryDayDataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type FactoryDayDataEdge = {
  __typename?: 'FactoryDayDataEdge';
  cursor: Scalars['String'];
  node: FactoryDayData;
};

export enum FactoryDayDataOrderByInput {
  DailyVolumeEthAsc = 'dailyVolumeETH_ASC',
  DailyVolumeEthDesc = 'dailyVolumeETH_DESC',
  DailyVolumeUsdAsc = 'dailyVolumeUSD_ASC',
  DailyVolumeUsdDesc = 'dailyVolumeUSD_DESC',
  DailyVolumeUntrackedAsc = 'dailyVolumeUntracked_ASC',
  DailyVolumeUntrackedDesc = 'dailyVolumeUntracked_DESC',
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TotalLiquidityEthAsc = 'totalLiquidityETH_ASC',
  TotalLiquidityEthDesc = 'totalLiquidityETH_DESC',
  TotalLiquidityUsdAsc = 'totalLiquidityUSD_ASC',
  TotalLiquidityUsdDesc = 'totalLiquidityUSD_DESC',
  TotalVolumeEthAsc = 'totalVolumeETH_ASC',
  TotalVolumeEthDesc = 'totalVolumeETH_DESC',
  TotalVolumeUsdAsc = 'totalVolumeUSD_ASC',
  TotalVolumeUsdDesc = 'totalVolumeUSD_DESC',
  TxCountAsc = 'txCount_ASC',
  TxCountDesc = 'txCount_DESC'
}

export type FactoryDayDataWhereInput = {
  AND?: InputMaybe<Array<FactoryDayDataWhereInput>>;
  OR?: InputMaybe<Array<FactoryDayDataWhereInput>>;
  dailyVolumeETH_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_gt?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_gte?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeETH_isNull?: InputMaybe<Scalars['Boolean']>;
  dailyVolumeETH_lt?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_lte?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_not_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_not_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_not_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_not_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeETH_not_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  dailyVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUntracked_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeUntracked_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeUntracked_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUntracked_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeUntracked_gt?: InputMaybe<Scalars['String']>;
  dailyVolumeUntracked_gte?: InputMaybe<Scalars['String']>;
  dailyVolumeUntracked_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeUntracked_isNull?: InputMaybe<Scalars['Boolean']>;
  dailyVolumeUntracked_lt?: InputMaybe<Scalars['String']>;
  dailyVolumeUntracked_lte?: InputMaybe<Scalars['String']>;
  dailyVolumeUntracked_not_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeUntracked_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeUntracked_not_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUntracked_not_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeUntracked_not_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeUntracked_not_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUntracked_startsWith?: InputMaybe<Scalars['String']>;
  date_eq?: InputMaybe<Scalars['DateTime']>;
  date_gt?: InputMaybe<Scalars['DateTime']>;
  date_gte?: InputMaybe<Scalars['DateTime']>;
  date_in?: InputMaybe<Array<Scalars['DateTime']>>;
  date_isNull?: InputMaybe<Scalars['Boolean']>;
  date_lt?: InputMaybe<Scalars['DateTime']>;
  date_lte?: InputMaybe<Scalars['DateTime']>;
  date_not_eq?: InputMaybe<Scalars['DateTime']>;
  date_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_contains?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_eq?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_gt?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_gte?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityETH_isNull?: InputMaybe<Scalars['Boolean']>;
  totalLiquidityETH_lt?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_lte?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_contains?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_eq?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityETH_not_startsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_startsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_contains?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_eq?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_contains?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_eq?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_startsWith?: InputMaybe<Scalars['String']>;
  totalVolumeETH_contains?: InputMaybe<Scalars['String']>;
  totalVolumeETH_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalVolumeETH_endsWith?: InputMaybe<Scalars['String']>;
  totalVolumeETH_eq?: InputMaybe<Scalars['String']>;
  totalVolumeETH_gt?: InputMaybe<Scalars['String']>;
  totalVolumeETH_gte?: InputMaybe<Scalars['String']>;
  totalVolumeETH_in?: InputMaybe<Array<Scalars['String']>>;
  totalVolumeETH_isNull?: InputMaybe<Scalars['Boolean']>;
  totalVolumeETH_lt?: InputMaybe<Scalars['String']>;
  totalVolumeETH_lte?: InputMaybe<Scalars['String']>;
  totalVolumeETH_not_contains?: InputMaybe<Scalars['String']>;
  totalVolumeETH_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalVolumeETH_not_endsWith?: InputMaybe<Scalars['String']>;
  totalVolumeETH_not_eq?: InputMaybe<Scalars['String']>;
  totalVolumeETH_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalVolumeETH_not_startsWith?: InputMaybe<Scalars['String']>;
  totalVolumeETH_startsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  totalVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  totalVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
  txCount_eq?: InputMaybe<Scalars['Int']>;
  txCount_gt?: InputMaybe<Scalars['Int']>;
  txCount_gte?: InputMaybe<Scalars['Int']>;
  txCount_in?: InputMaybe<Array<Scalars['Int']>>;
  txCount_isNull?: InputMaybe<Scalars['Boolean']>;
  txCount_lt?: InputMaybe<Scalars['Int']>;
  txCount_lte?: InputMaybe<Scalars['Int']>;
  txCount_not_eq?: InputMaybe<Scalars['Int']>;
  txCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export type FactoryEdge = {
  __typename?: 'FactoryEdge';
  cursor: Scalars['String'];
  node: Factory;
};

export enum FactoryOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PairCountAsc = 'pairCount_ASC',
  PairCountDesc = 'pairCount_DESC',
  TotalLiquidityEthAsc = 'totalLiquidityETH_ASC',
  TotalLiquidityEthDesc = 'totalLiquidityETH_DESC',
  TotalLiquidityUsdAsc = 'totalLiquidityUSD_ASC',
  TotalLiquidityUsdDesc = 'totalLiquidityUSD_DESC',
  TotalVolumeEthAsc = 'totalVolumeETH_ASC',
  TotalVolumeEthDesc = 'totalVolumeETH_DESC',
  TotalVolumeUsdAsc = 'totalVolumeUSD_ASC',
  TotalVolumeUsdDesc = 'totalVolumeUSD_DESC',
  TxCountAsc = 'txCount_ASC',
  TxCountDesc = 'txCount_DESC',
  UntrackedVolumeUsdAsc = 'untrackedVolumeUSD_ASC',
  UntrackedVolumeUsdDesc = 'untrackedVolumeUSD_DESC'
}

export type FactoryWhereInput = {
  AND?: InputMaybe<Array<FactoryWhereInput>>;
  OR?: InputMaybe<Array<FactoryWhereInput>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  pairCount_eq?: InputMaybe<Scalars['Int']>;
  pairCount_gt?: InputMaybe<Scalars['Int']>;
  pairCount_gte?: InputMaybe<Scalars['Int']>;
  pairCount_in?: InputMaybe<Array<Scalars['Int']>>;
  pairCount_isNull?: InputMaybe<Scalars['Boolean']>;
  pairCount_lt?: InputMaybe<Scalars['Int']>;
  pairCount_lte?: InputMaybe<Scalars['Int']>;
  pairCount_not_eq?: InputMaybe<Scalars['Int']>;
  pairCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  totalLiquidityETH_contains?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_eq?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_gt?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_gte?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityETH_isNull?: InputMaybe<Scalars['Boolean']>;
  totalLiquidityETH_lt?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_lte?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_contains?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_eq?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityETH_not_startsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_startsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_contains?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_eq?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_contains?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_eq?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_startsWith?: InputMaybe<Scalars['String']>;
  totalVolumeETH_contains?: InputMaybe<Scalars['String']>;
  totalVolumeETH_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalVolumeETH_endsWith?: InputMaybe<Scalars['String']>;
  totalVolumeETH_eq?: InputMaybe<Scalars['String']>;
  totalVolumeETH_gt?: InputMaybe<Scalars['String']>;
  totalVolumeETH_gte?: InputMaybe<Scalars['String']>;
  totalVolumeETH_in?: InputMaybe<Array<Scalars['String']>>;
  totalVolumeETH_isNull?: InputMaybe<Scalars['Boolean']>;
  totalVolumeETH_lt?: InputMaybe<Scalars['String']>;
  totalVolumeETH_lte?: InputMaybe<Scalars['String']>;
  totalVolumeETH_not_contains?: InputMaybe<Scalars['String']>;
  totalVolumeETH_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalVolumeETH_not_endsWith?: InputMaybe<Scalars['String']>;
  totalVolumeETH_not_eq?: InputMaybe<Scalars['String']>;
  totalVolumeETH_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalVolumeETH_not_startsWith?: InputMaybe<Scalars['String']>;
  totalVolumeETH_startsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  totalVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  totalVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
  txCount_eq?: InputMaybe<Scalars['Int']>;
  txCount_gt?: InputMaybe<Scalars['Int']>;
  txCount_gte?: InputMaybe<Scalars['Int']>;
  txCount_in?: InputMaybe<Array<Scalars['Int']>>;
  txCount_isNull?: InputMaybe<Scalars['Boolean']>;
  txCount_lt?: InputMaybe<Scalars['Int']>;
  txCount_lte?: InputMaybe<Scalars['Int']>;
  txCount_not_eq?: InputMaybe<Scalars['Int']>;
  txCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  untrackedVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  untrackedVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  untrackedVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
};

export type LiquidityPosition = {
  __typename?: 'LiquidityPosition';
  id: Scalars['String'];
  /** BigDecimal */
  liquidityTokenBalance: Scalars['String'];
  pair: Pair;
  user: User;
};

export type LiquidityPositionEdge = {
  __typename?: 'LiquidityPositionEdge';
  cursor: Scalars['String'];
  node: LiquidityPosition;
};

export enum LiquidityPositionOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LiquidityTokenBalanceAsc = 'liquidityTokenBalance_ASC',
  LiquidityTokenBalanceDesc = 'liquidityTokenBalance_DESC',
  PairCreatedAtBlockNumberAsc = 'pair_createdAtBlockNumber_ASC',
  PairCreatedAtBlockNumberDesc = 'pair_createdAtBlockNumber_DESC',
  PairCreatedAtTimestampAsc = 'pair_createdAtTimestamp_ASC',
  PairCreatedAtTimestampDesc = 'pair_createdAtTimestamp_DESC',
  PairIdAsc = 'pair_id_ASC',
  PairIdDesc = 'pair_id_DESC',
  PairLiquidityProviderCountAsc = 'pair_liquidityProviderCount_ASC',
  PairLiquidityProviderCountDesc = 'pair_liquidityProviderCount_DESC',
  PairReserve0Asc = 'pair_reserve0_ASC',
  PairReserve0Desc = 'pair_reserve0_DESC',
  PairReserve1Asc = 'pair_reserve1_ASC',
  PairReserve1Desc = 'pair_reserve1_DESC',
  PairReserveEthAsc = 'pair_reserveETH_ASC',
  PairReserveEthDesc = 'pair_reserveETH_DESC',
  PairReserveUsdAsc = 'pair_reserveUSD_ASC',
  PairReserveUsdDesc = 'pair_reserveUSD_DESC',
  PairToken0PriceAsc = 'pair_token0Price_ASC',
  PairToken0PriceDesc = 'pair_token0Price_DESC',
  PairToken1PriceAsc = 'pair_token1Price_ASC',
  PairToken1PriceDesc = 'pair_token1Price_DESC',
  PairTotalSupplyAsc = 'pair_totalSupply_ASC',
  PairTotalSupplyDesc = 'pair_totalSupply_DESC',
  PairTrackedReserveEthAsc = 'pair_trackedReserveETH_ASC',
  PairTrackedReserveEthDesc = 'pair_trackedReserveETH_DESC',
  PairTxCountAsc = 'pair_txCount_ASC',
  PairTxCountDesc = 'pair_txCount_DESC',
  PairUntrackedVolumeUsdAsc = 'pair_untrackedVolumeUSD_ASC',
  PairUntrackedVolumeUsdDesc = 'pair_untrackedVolumeUSD_DESC',
  PairVolumeToken0Asc = 'pair_volumeToken0_ASC',
  PairVolumeToken0Desc = 'pair_volumeToken0_DESC',
  PairVolumeToken1Asc = 'pair_volumeToken1_ASC',
  PairVolumeToken1Desc = 'pair_volumeToken1_DESC',
  PairVolumeUsdAsc = 'pair_volumeUSD_ASC',
  PairVolumeUsdDesc = 'pair_volumeUSD_DESC',
  UserIdAsc = 'user_id_ASC',
  UserIdDesc = 'user_id_DESC',
  UserUsdSwappedAsc = 'user_usdSwapped_ASC',
  UserUsdSwappedDesc = 'user_usdSwapped_DESC'
}

export type LiquidityPositionSnapshot = {
  __typename?: 'LiquidityPositionSnapshot';
  block: Scalars['Int'];
  id: Scalars['String'];
  liquidityPosition: LiquidityPosition;
  /** BigDecimal */
  liquidityTokenBalance: Scalars['String'];
  /** BigDecimal */
  liquidityTokenTotalSupply: Scalars['String'];
  pair: Pair;
  /** BigDecimal */
  reserve0: Scalars['String'];
  /** BigDecimal */
  reserve1: Scalars['String'];
  /** BigDecimal */
  reserveUSD: Scalars['String'];
  timestamp: Scalars['DateTime'];
  /** BigDecimal */
  token0PriceUSD: Scalars['String'];
  /** BigDecimal */
  token1PriceUSD: Scalars['String'];
  user: User;
};

export type LiquidityPositionSnapshotEdge = {
  __typename?: 'LiquidityPositionSnapshotEdge';
  cursor: Scalars['String'];
  node: LiquidityPositionSnapshot;
};

export enum LiquidityPositionSnapshotOrderByInput {
  BlockAsc = 'block_ASC',
  BlockDesc = 'block_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LiquidityPositionIdAsc = 'liquidityPosition_id_ASC',
  LiquidityPositionIdDesc = 'liquidityPosition_id_DESC',
  LiquidityPositionLiquidityTokenBalanceAsc = 'liquidityPosition_liquidityTokenBalance_ASC',
  LiquidityPositionLiquidityTokenBalanceDesc = 'liquidityPosition_liquidityTokenBalance_DESC',
  LiquidityTokenBalanceAsc = 'liquidityTokenBalance_ASC',
  LiquidityTokenBalanceDesc = 'liquidityTokenBalance_DESC',
  LiquidityTokenTotalSupplyAsc = 'liquidityTokenTotalSupply_ASC',
  LiquidityTokenTotalSupplyDesc = 'liquidityTokenTotalSupply_DESC',
  PairCreatedAtBlockNumberAsc = 'pair_createdAtBlockNumber_ASC',
  PairCreatedAtBlockNumberDesc = 'pair_createdAtBlockNumber_DESC',
  PairCreatedAtTimestampAsc = 'pair_createdAtTimestamp_ASC',
  PairCreatedAtTimestampDesc = 'pair_createdAtTimestamp_DESC',
  PairIdAsc = 'pair_id_ASC',
  PairIdDesc = 'pair_id_DESC',
  PairLiquidityProviderCountAsc = 'pair_liquidityProviderCount_ASC',
  PairLiquidityProviderCountDesc = 'pair_liquidityProviderCount_DESC',
  PairReserve0Asc = 'pair_reserve0_ASC',
  PairReserve0Desc = 'pair_reserve0_DESC',
  PairReserve1Asc = 'pair_reserve1_ASC',
  PairReserve1Desc = 'pair_reserve1_DESC',
  PairReserveEthAsc = 'pair_reserveETH_ASC',
  PairReserveEthDesc = 'pair_reserveETH_DESC',
  PairReserveUsdAsc = 'pair_reserveUSD_ASC',
  PairReserveUsdDesc = 'pair_reserveUSD_DESC',
  PairToken0PriceAsc = 'pair_token0Price_ASC',
  PairToken0PriceDesc = 'pair_token0Price_DESC',
  PairToken1PriceAsc = 'pair_token1Price_ASC',
  PairToken1PriceDesc = 'pair_token1Price_DESC',
  PairTotalSupplyAsc = 'pair_totalSupply_ASC',
  PairTotalSupplyDesc = 'pair_totalSupply_DESC',
  PairTrackedReserveEthAsc = 'pair_trackedReserveETH_ASC',
  PairTrackedReserveEthDesc = 'pair_trackedReserveETH_DESC',
  PairTxCountAsc = 'pair_txCount_ASC',
  PairTxCountDesc = 'pair_txCount_DESC',
  PairUntrackedVolumeUsdAsc = 'pair_untrackedVolumeUSD_ASC',
  PairUntrackedVolumeUsdDesc = 'pair_untrackedVolumeUSD_DESC',
  PairVolumeToken0Asc = 'pair_volumeToken0_ASC',
  PairVolumeToken0Desc = 'pair_volumeToken0_DESC',
  PairVolumeToken1Asc = 'pair_volumeToken1_ASC',
  PairVolumeToken1Desc = 'pair_volumeToken1_DESC',
  PairVolumeUsdAsc = 'pair_volumeUSD_ASC',
  PairVolumeUsdDesc = 'pair_volumeUSD_DESC',
  Reserve0Asc = 'reserve0_ASC',
  Reserve0Desc = 'reserve0_DESC',
  Reserve1Asc = 'reserve1_ASC',
  Reserve1Desc = 'reserve1_DESC',
  ReserveUsdAsc = 'reserveUSD_ASC',
  ReserveUsdDesc = 'reserveUSD_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  Token0PriceUsdAsc = 'token0PriceUSD_ASC',
  Token0PriceUsdDesc = 'token0PriceUSD_DESC',
  Token1PriceUsdAsc = 'token1PriceUSD_ASC',
  Token1PriceUsdDesc = 'token1PriceUSD_DESC',
  UserIdAsc = 'user_id_ASC',
  UserIdDesc = 'user_id_DESC',
  UserUsdSwappedAsc = 'user_usdSwapped_ASC',
  UserUsdSwappedDesc = 'user_usdSwapped_DESC'
}

export type LiquidityPositionSnapshotWhereInput = {
  AND?: InputMaybe<Array<LiquidityPositionSnapshotWhereInput>>;
  OR?: InputMaybe<Array<LiquidityPositionSnapshotWhereInput>>;
  block_eq?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_isNull?: InputMaybe<Scalars['Boolean']>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_not_eq?: InputMaybe<Scalars['Int']>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  liquidityPosition?: InputMaybe<LiquidityPositionWhereInput>;
  liquidityPosition_isNull?: InputMaybe<Scalars['Boolean']>;
  liquidityTokenBalance_contains?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_containsInsensitive?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_endsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_eq?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityTokenBalance_isNull?: InputMaybe<Scalars['Boolean']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_contains?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_endsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_eq?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityTokenBalance_not_startsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_startsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenTotalSupply_contains?: InputMaybe<Scalars['String']>;
  liquidityTokenTotalSupply_containsInsensitive?: InputMaybe<Scalars['String']>;
  liquidityTokenTotalSupply_endsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenTotalSupply_eq?: InputMaybe<Scalars['String']>;
  liquidityTokenTotalSupply_gt?: InputMaybe<Scalars['String']>;
  liquidityTokenTotalSupply_gte?: InputMaybe<Scalars['String']>;
  liquidityTokenTotalSupply_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityTokenTotalSupply_isNull?: InputMaybe<Scalars['Boolean']>;
  liquidityTokenTotalSupply_lt?: InputMaybe<Scalars['String']>;
  liquidityTokenTotalSupply_lte?: InputMaybe<Scalars['String']>;
  liquidityTokenTotalSupply_not_contains?: InputMaybe<Scalars['String']>;
  liquidityTokenTotalSupply_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  liquidityTokenTotalSupply_not_endsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenTotalSupply_not_eq?: InputMaybe<Scalars['String']>;
  liquidityTokenTotalSupply_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityTokenTotalSupply_not_startsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenTotalSupply_startsWith?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<PairWhereInput>;
  pair_isNull?: InputMaybe<Scalars['Boolean']>;
  reserve0_contains?: InputMaybe<Scalars['String']>;
  reserve0_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve0_endsWith?: InputMaybe<Scalars['String']>;
  reserve0_eq?: InputMaybe<Scalars['String']>;
  reserve0_gt?: InputMaybe<Scalars['String']>;
  reserve0_gte?: InputMaybe<Scalars['String']>;
  reserve0_in?: InputMaybe<Array<Scalars['String']>>;
  reserve0_isNull?: InputMaybe<Scalars['Boolean']>;
  reserve0_lt?: InputMaybe<Scalars['String']>;
  reserve0_lte?: InputMaybe<Scalars['String']>;
  reserve0_not_contains?: InputMaybe<Scalars['String']>;
  reserve0_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve0_not_endsWith?: InputMaybe<Scalars['String']>;
  reserve0_not_eq?: InputMaybe<Scalars['String']>;
  reserve0_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserve0_not_startsWith?: InputMaybe<Scalars['String']>;
  reserve0_startsWith?: InputMaybe<Scalars['String']>;
  reserve1_contains?: InputMaybe<Scalars['String']>;
  reserve1_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve1_endsWith?: InputMaybe<Scalars['String']>;
  reserve1_eq?: InputMaybe<Scalars['String']>;
  reserve1_gt?: InputMaybe<Scalars['String']>;
  reserve1_gte?: InputMaybe<Scalars['String']>;
  reserve1_in?: InputMaybe<Array<Scalars['String']>>;
  reserve1_isNull?: InputMaybe<Scalars['Boolean']>;
  reserve1_lt?: InputMaybe<Scalars['String']>;
  reserve1_lte?: InputMaybe<Scalars['String']>;
  reserve1_not_contains?: InputMaybe<Scalars['String']>;
  reserve1_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve1_not_endsWith?: InputMaybe<Scalars['String']>;
  reserve1_not_eq?: InputMaybe<Scalars['String']>;
  reserve1_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserve1_not_startsWith?: InputMaybe<Scalars['String']>;
  reserve1_startsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_contains?: InputMaybe<Scalars['String']>;
  reserveUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserveUSD_endsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_eq?: InputMaybe<Scalars['String']>;
  reserveUSD_gt?: InputMaybe<Scalars['String']>;
  reserveUSD_gte?: InputMaybe<Scalars['String']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['String']>>;
  reserveUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  reserveUSD_lt?: InputMaybe<Scalars['String']>;
  reserveUSD_lte?: InputMaybe<Scalars['String']>;
  reserveUSD_not_contains?: InputMaybe<Scalars['String']>;
  reserveUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserveUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_not_eq?: InputMaybe<Scalars['String']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserveUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_startsWith?: InputMaybe<Scalars['String']>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
  token0PriceUSD_contains?: InputMaybe<Scalars['String']>;
  token0PriceUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  token0PriceUSD_endsWith?: InputMaybe<Scalars['String']>;
  token0PriceUSD_eq?: InputMaybe<Scalars['String']>;
  token0PriceUSD_gt?: InputMaybe<Scalars['String']>;
  token0PriceUSD_gte?: InputMaybe<Scalars['String']>;
  token0PriceUSD_in?: InputMaybe<Array<Scalars['String']>>;
  token0PriceUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  token0PriceUSD_lt?: InputMaybe<Scalars['String']>;
  token0PriceUSD_lte?: InputMaybe<Scalars['String']>;
  token0PriceUSD_not_contains?: InputMaybe<Scalars['String']>;
  token0PriceUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  token0PriceUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  token0PriceUSD_not_eq?: InputMaybe<Scalars['String']>;
  token0PriceUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0PriceUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  token0PriceUSD_startsWith?: InputMaybe<Scalars['String']>;
  token1PriceUSD_contains?: InputMaybe<Scalars['String']>;
  token1PriceUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  token1PriceUSD_endsWith?: InputMaybe<Scalars['String']>;
  token1PriceUSD_eq?: InputMaybe<Scalars['String']>;
  token1PriceUSD_gt?: InputMaybe<Scalars['String']>;
  token1PriceUSD_gte?: InputMaybe<Scalars['String']>;
  token1PriceUSD_in?: InputMaybe<Array<Scalars['String']>>;
  token1PriceUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  token1PriceUSD_lt?: InputMaybe<Scalars['String']>;
  token1PriceUSD_lte?: InputMaybe<Scalars['String']>;
  token1PriceUSD_not_contains?: InputMaybe<Scalars['String']>;
  token1PriceUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  token1PriceUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  token1PriceUSD_not_eq?: InputMaybe<Scalars['String']>;
  token1PriceUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1PriceUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  token1PriceUSD_startsWith?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<UserWhereInput>;
  user_isNull?: InputMaybe<Scalars['Boolean']>;
};

export type LiquidityPositionSnapshotsConnection = {
  __typename?: 'LiquidityPositionSnapshotsConnection';
  edges: Array<LiquidityPositionSnapshotEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type LiquidityPositionWhereInput = {
  AND?: InputMaybe<Array<LiquidityPositionWhereInput>>;
  OR?: InputMaybe<Array<LiquidityPositionWhereInput>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_contains?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_containsInsensitive?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_endsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_eq?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityTokenBalance_isNull?: InputMaybe<Scalars['Boolean']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_contains?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_endsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_eq?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityTokenBalance_not_startsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_startsWith?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<PairWhereInput>;
  pair_isNull?: InputMaybe<Scalars['Boolean']>;
  user?: InputMaybe<UserWhereInput>;
  user_isNull?: InputMaybe<Scalars['Boolean']>;
};

export type LiquidityPositionsConnection = {
  __typename?: 'LiquidityPositionsConnection';
  edges: Array<LiquidityPositionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Metadata = {
  __typename?: 'Metadata';
  blockHash: Scalars['String'];
  blockHeight: Scalars['Int'];
  hex: Scalars['String'];
  id: Scalars['String'];
  specName: Scalars['String'];
  specVersion?: Maybe<Scalars['Int']>;
};

export type MetadataConnection = {
  __typename?: 'MetadataConnection';
  edges: Array<MetadataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type MetadataEdge = {
  __typename?: 'MetadataEdge';
  cursor: Scalars['String'];
  node: Metadata;
};

export enum MetadataOrderByInput {
  BlockHashAsc = 'blockHash_ASC',
  BlockHashDesc = 'blockHash_DESC',
  BlockHeightAsc = 'blockHeight_ASC',
  BlockHeightDesc = 'blockHeight_DESC',
  HexAsc = 'hex_ASC',
  HexDesc = 'hex_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  SpecNameAsc = 'specName_ASC',
  SpecNameDesc = 'specName_DESC',
  SpecVersionAsc = 'specVersion_ASC',
  SpecVersionDesc = 'specVersion_DESC'
}

export type MetadataWhereInput = {
  AND?: InputMaybe<Array<MetadataWhereInput>>;
  OR?: InputMaybe<Array<MetadataWhereInput>>;
  blockHash_contains?: InputMaybe<Scalars['String']>;
  blockHash_containsInsensitive?: InputMaybe<Scalars['String']>;
  blockHash_endsWith?: InputMaybe<Scalars['String']>;
  blockHash_eq?: InputMaybe<Scalars['String']>;
  blockHash_gt?: InputMaybe<Scalars['String']>;
  blockHash_gte?: InputMaybe<Scalars['String']>;
  blockHash_in?: InputMaybe<Array<Scalars['String']>>;
  blockHash_isNull?: InputMaybe<Scalars['Boolean']>;
  blockHash_lt?: InputMaybe<Scalars['String']>;
  blockHash_lte?: InputMaybe<Scalars['String']>;
  blockHash_not_contains?: InputMaybe<Scalars['String']>;
  blockHash_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  blockHash_not_endsWith?: InputMaybe<Scalars['String']>;
  blockHash_not_eq?: InputMaybe<Scalars['String']>;
  blockHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  blockHash_not_startsWith?: InputMaybe<Scalars['String']>;
  blockHash_startsWith?: InputMaybe<Scalars['String']>;
  blockHeight_eq?: InputMaybe<Scalars['Int']>;
  blockHeight_gt?: InputMaybe<Scalars['Int']>;
  blockHeight_gte?: InputMaybe<Scalars['Int']>;
  blockHeight_in?: InputMaybe<Array<Scalars['Int']>>;
  blockHeight_isNull?: InputMaybe<Scalars['Boolean']>;
  blockHeight_lt?: InputMaybe<Scalars['Int']>;
  blockHeight_lte?: InputMaybe<Scalars['Int']>;
  blockHeight_not_eq?: InputMaybe<Scalars['Int']>;
  blockHeight_not_in?: InputMaybe<Array<Scalars['Int']>>;
  hex_contains?: InputMaybe<Scalars['String']>;
  hex_containsInsensitive?: InputMaybe<Scalars['String']>;
  hex_endsWith?: InputMaybe<Scalars['String']>;
  hex_eq?: InputMaybe<Scalars['String']>;
  hex_gt?: InputMaybe<Scalars['String']>;
  hex_gte?: InputMaybe<Scalars['String']>;
  hex_in?: InputMaybe<Array<Scalars['String']>>;
  hex_isNull?: InputMaybe<Scalars['Boolean']>;
  hex_lt?: InputMaybe<Scalars['String']>;
  hex_lte?: InputMaybe<Scalars['String']>;
  hex_not_contains?: InputMaybe<Scalars['String']>;
  hex_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  hex_not_endsWith?: InputMaybe<Scalars['String']>;
  hex_not_eq?: InputMaybe<Scalars['String']>;
  hex_not_in?: InputMaybe<Array<Scalars['String']>>;
  hex_not_startsWith?: InputMaybe<Scalars['String']>;
  hex_startsWith?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  specName_contains?: InputMaybe<Scalars['String']>;
  specName_containsInsensitive?: InputMaybe<Scalars['String']>;
  specName_endsWith?: InputMaybe<Scalars['String']>;
  specName_eq?: InputMaybe<Scalars['String']>;
  specName_gt?: InputMaybe<Scalars['String']>;
  specName_gte?: InputMaybe<Scalars['String']>;
  specName_in?: InputMaybe<Array<Scalars['String']>>;
  specName_isNull?: InputMaybe<Scalars['Boolean']>;
  specName_lt?: InputMaybe<Scalars['String']>;
  specName_lte?: InputMaybe<Scalars['String']>;
  specName_not_contains?: InputMaybe<Scalars['String']>;
  specName_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  specName_not_endsWith?: InputMaybe<Scalars['String']>;
  specName_not_eq?: InputMaybe<Scalars['String']>;
  specName_not_in?: InputMaybe<Array<Scalars['String']>>;
  specName_not_startsWith?: InputMaybe<Scalars['String']>;
  specName_startsWith?: InputMaybe<Scalars['String']>;
  specVersion_eq?: InputMaybe<Scalars['Int']>;
  specVersion_gt?: InputMaybe<Scalars['Int']>;
  specVersion_gte?: InputMaybe<Scalars['Int']>;
  specVersion_in?: InputMaybe<Array<Scalars['Int']>>;
  specVersion_isNull?: InputMaybe<Scalars['Boolean']>;
  specVersion_lt?: InputMaybe<Scalars['Int']>;
  specVersion_lte?: InputMaybe<Scalars['Int']>;
  specVersion_not_eq?: InputMaybe<Scalars['Int']>;
  specVersion_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export type Mint = {
  __typename?: 'Mint';
  amount0?: Maybe<Scalars['String']>;
  amount1?: Maybe<Scalars['String']>;
  amountUSD?: Maybe<Scalars['String']>;
  feeLiquidity?: Maybe<Scalars['String']>;
  feeTo?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  liquidity: Scalars['String'];
  logIndex?: Maybe<Scalars['Int']>;
  pair: Pair;
  sender?: Maybe<Scalars['String']>;
  timestamp: Scalars['DateTime'];
  to: Scalars['String'];
  transaction: Transaction;
};

export type MintEdge = {
  __typename?: 'MintEdge';
  cursor: Scalars['String'];
  node: Mint;
};

export enum MintOrderByInput {
  Amount0Asc = 'amount0_ASC',
  Amount0Desc = 'amount0_DESC',
  Amount1Asc = 'amount1_ASC',
  Amount1Desc = 'amount1_DESC',
  AmountUsdAsc = 'amountUSD_ASC',
  AmountUsdDesc = 'amountUSD_DESC',
  FeeLiquidityAsc = 'feeLiquidity_ASC',
  FeeLiquidityDesc = 'feeLiquidity_DESC',
  FeeToAsc = 'feeTo_ASC',
  FeeToDesc = 'feeTo_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LiquidityAsc = 'liquidity_ASC',
  LiquidityDesc = 'liquidity_DESC',
  LogIndexAsc = 'logIndex_ASC',
  LogIndexDesc = 'logIndex_DESC',
  PairCreatedAtBlockNumberAsc = 'pair_createdAtBlockNumber_ASC',
  PairCreatedAtBlockNumberDesc = 'pair_createdAtBlockNumber_DESC',
  PairCreatedAtTimestampAsc = 'pair_createdAtTimestamp_ASC',
  PairCreatedAtTimestampDesc = 'pair_createdAtTimestamp_DESC',
  PairIdAsc = 'pair_id_ASC',
  PairIdDesc = 'pair_id_DESC',
  PairLiquidityProviderCountAsc = 'pair_liquidityProviderCount_ASC',
  PairLiquidityProviderCountDesc = 'pair_liquidityProviderCount_DESC',
  PairReserve0Asc = 'pair_reserve0_ASC',
  PairReserve0Desc = 'pair_reserve0_DESC',
  PairReserve1Asc = 'pair_reserve1_ASC',
  PairReserve1Desc = 'pair_reserve1_DESC',
  PairReserveEthAsc = 'pair_reserveETH_ASC',
  PairReserveEthDesc = 'pair_reserveETH_DESC',
  PairReserveUsdAsc = 'pair_reserveUSD_ASC',
  PairReserveUsdDesc = 'pair_reserveUSD_DESC',
  PairToken0PriceAsc = 'pair_token0Price_ASC',
  PairToken0PriceDesc = 'pair_token0Price_DESC',
  PairToken1PriceAsc = 'pair_token1Price_ASC',
  PairToken1PriceDesc = 'pair_token1Price_DESC',
  PairTotalSupplyAsc = 'pair_totalSupply_ASC',
  PairTotalSupplyDesc = 'pair_totalSupply_DESC',
  PairTrackedReserveEthAsc = 'pair_trackedReserveETH_ASC',
  PairTrackedReserveEthDesc = 'pair_trackedReserveETH_DESC',
  PairTxCountAsc = 'pair_txCount_ASC',
  PairTxCountDesc = 'pair_txCount_DESC',
  PairUntrackedVolumeUsdAsc = 'pair_untrackedVolumeUSD_ASC',
  PairUntrackedVolumeUsdDesc = 'pair_untrackedVolumeUSD_DESC',
  PairVolumeToken0Asc = 'pair_volumeToken0_ASC',
  PairVolumeToken0Desc = 'pair_volumeToken0_DESC',
  PairVolumeToken1Asc = 'pair_volumeToken1_ASC',
  PairVolumeToken1Desc = 'pair_volumeToken1_DESC',
  PairVolumeUsdAsc = 'pair_volumeUSD_ASC',
  PairVolumeUsdDesc = 'pair_volumeUSD_DESC',
  SenderAsc = 'sender_ASC',
  SenderDesc = 'sender_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  ToAsc = 'to_ASC',
  ToDesc = 'to_DESC',
  TransactionBlockNumberAsc = 'transaction_blockNumber_ASC',
  TransactionBlockNumberDesc = 'transaction_blockNumber_DESC',
  TransactionIdAsc = 'transaction_id_ASC',
  TransactionIdDesc = 'transaction_id_DESC',
  TransactionTimestampAsc = 'transaction_timestamp_ASC',
  TransactionTimestampDesc = 'transaction_timestamp_DESC'
}

export type MintWhereInput = {
  AND?: InputMaybe<Array<MintWhereInput>>;
  OR?: InputMaybe<Array<MintWhereInput>>;
  amount0_contains?: InputMaybe<Scalars['String']>;
  amount0_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount0_endsWith?: InputMaybe<Scalars['String']>;
  amount0_eq?: InputMaybe<Scalars['String']>;
  amount0_gt?: InputMaybe<Scalars['String']>;
  amount0_gte?: InputMaybe<Scalars['String']>;
  amount0_in?: InputMaybe<Array<Scalars['String']>>;
  amount0_isNull?: InputMaybe<Scalars['Boolean']>;
  amount0_lt?: InputMaybe<Scalars['String']>;
  amount0_lte?: InputMaybe<Scalars['String']>;
  amount0_not_contains?: InputMaybe<Scalars['String']>;
  amount0_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount0_not_endsWith?: InputMaybe<Scalars['String']>;
  amount0_not_eq?: InputMaybe<Scalars['String']>;
  amount0_not_in?: InputMaybe<Array<Scalars['String']>>;
  amount0_not_startsWith?: InputMaybe<Scalars['String']>;
  amount0_startsWith?: InputMaybe<Scalars['String']>;
  amount1_contains?: InputMaybe<Scalars['String']>;
  amount1_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount1_endsWith?: InputMaybe<Scalars['String']>;
  amount1_eq?: InputMaybe<Scalars['String']>;
  amount1_gt?: InputMaybe<Scalars['String']>;
  amount1_gte?: InputMaybe<Scalars['String']>;
  amount1_in?: InputMaybe<Array<Scalars['String']>>;
  amount1_isNull?: InputMaybe<Scalars['Boolean']>;
  amount1_lt?: InputMaybe<Scalars['String']>;
  amount1_lte?: InputMaybe<Scalars['String']>;
  amount1_not_contains?: InputMaybe<Scalars['String']>;
  amount1_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount1_not_endsWith?: InputMaybe<Scalars['String']>;
  amount1_not_eq?: InputMaybe<Scalars['String']>;
  amount1_not_in?: InputMaybe<Array<Scalars['String']>>;
  amount1_not_startsWith?: InputMaybe<Scalars['String']>;
  amount1_startsWith?: InputMaybe<Scalars['String']>;
  amountUSD_contains?: InputMaybe<Scalars['String']>;
  amountUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  amountUSD_endsWith?: InputMaybe<Scalars['String']>;
  amountUSD_eq?: InputMaybe<Scalars['String']>;
  amountUSD_gt?: InputMaybe<Scalars['String']>;
  amountUSD_gte?: InputMaybe<Scalars['String']>;
  amountUSD_in?: InputMaybe<Array<Scalars['String']>>;
  amountUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  amountUSD_lt?: InputMaybe<Scalars['String']>;
  amountUSD_lte?: InputMaybe<Scalars['String']>;
  amountUSD_not_contains?: InputMaybe<Scalars['String']>;
  amountUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  amountUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  amountUSD_not_eq?: InputMaybe<Scalars['String']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  amountUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  amountUSD_startsWith?: InputMaybe<Scalars['String']>;
  feeLiquidity_contains?: InputMaybe<Scalars['String']>;
  feeLiquidity_containsInsensitive?: InputMaybe<Scalars['String']>;
  feeLiquidity_endsWith?: InputMaybe<Scalars['String']>;
  feeLiquidity_eq?: InputMaybe<Scalars['String']>;
  feeLiquidity_gt?: InputMaybe<Scalars['String']>;
  feeLiquidity_gte?: InputMaybe<Scalars['String']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['String']>>;
  feeLiquidity_isNull?: InputMaybe<Scalars['Boolean']>;
  feeLiquidity_lt?: InputMaybe<Scalars['String']>;
  feeLiquidity_lte?: InputMaybe<Scalars['String']>;
  feeLiquidity_not_contains?: InputMaybe<Scalars['String']>;
  feeLiquidity_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  feeLiquidity_not_endsWith?: InputMaybe<Scalars['String']>;
  feeLiquidity_not_eq?: InputMaybe<Scalars['String']>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['String']>>;
  feeLiquidity_not_startsWith?: InputMaybe<Scalars['String']>;
  feeLiquidity_startsWith?: InputMaybe<Scalars['String']>;
  feeTo_contains?: InputMaybe<Scalars['String']>;
  feeTo_containsInsensitive?: InputMaybe<Scalars['String']>;
  feeTo_endsWith?: InputMaybe<Scalars['String']>;
  feeTo_eq?: InputMaybe<Scalars['String']>;
  feeTo_gt?: InputMaybe<Scalars['String']>;
  feeTo_gte?: InputMaybe<Scalars['String']>;
  feeTo_in?: InputMaybe<Array<Scalars['String']>>;
  feeTo_isNull?: InputMaybe<Scalars['Boolean']>;
  feeTo_lt?: InputMaybe<Scalars['String']>;
  feeTo_lte?: InputMaybe<Scalars['String']>;
  feeTo_not_contains?: InputMaybe<Scalars['String']>;
  feeTo_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  feeTo_not_endsWith?: InputMaybe<Scalars['String']>;
  feeTo_not_eq?: InputMaybe<Scalars['String']>;
  feeTo_not_in?: InputMaybe<Array<Scalars['String']>>;
  feeTo_not_startsWith?: InputMaybe<Scalars['String']>;
  feeTo_startsWith?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  liquidity_contains?: InputMaybe<Scalars['String']>;
  liquidity_containsInsensitive?: InputMaybe<Scalars['String']>;
  liquidity_endsWith?: InputMaybe<Scalars['String']>;
  liquidity_eq?: InputMaybe<Scalars['String']>;
  liquidity_gt?: InputMaybe<Scalars['String']>;
  liquidity_gte?: InputMaybe<Scalars['String']>;
  liquidity_in?: InputMaybe<Array<Scalars['String']>>;
  liquidity_isNull?: InputMaybe<Scalars['Boolean']>;
  liquidity_lt?: InputMaybe<Scalars['String']>;
  liquidity_lte?: InputMaybe<Scalars['String']>;
  liquidity_not_contains?: InputMaybe<Scalars['String']>;
  liquidity_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  liquidity_not_endsWith?: InputMaybe<Scalars['String']>;
  liquidity_not_eq?: InputMaybe<Scalars['String']>;
  liquidity_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidity_not_startsWith?: InputMaybe<Scalars['String']>;
  liquidity_startsWith?: InputMaybe<Scalars['String']>;
  logIndex_eq?: InputMaybe<Scalars['Int']>;
  logIndex_gt?: InputMaybe<Scalars['Int']>;
  logIndex_gte?: InputMaybe<Scalars['Int']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']>>;
  logIndex_isNull?: InputMaybe<Scalars['Boolean']>;
  logIndex_lt?: InputMaybe<Scalars['Int']>;
  logIndex_lte?: InputMaybe<Scalars['Int']>;
  logIndex_not_eq?: InputMaybe<Scalars['Int']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']>>;
  pair?: InputMaybe<PairWhereInput>;
  pair_isNull?: InputMaybe<Scalars['Boolean']>;
  sender_contains?: InputMaybe<Scalars['String']>;
  sender_containsInsensitive?: InputMaybe<Scalars['String']>;
  sender_endsWith?: InputMaybe<Scalars['String']>;
  sender_eq?: InputMaybe<Scalars['String']>;
  sender_gt?: InputMaybe<Scalars['String']>;
  sender_gte?: InputMaybe<Scalars['String']>;
  sender_in?: InputMaybe<Array<Scalars['String']>>;
  sender_isNull?: InputMaybe<Scalars['Boolean']>;
  sender_lt?: InputMaybe<Scalars['String']>;
  sender_lte?: InputMaybe<Scalars['String']>;
  sender_not_contains?: InputMaybe<Scalars['String']>;
  sender_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  sender_not_endsWith?: InputMaybe<Scalars['String']>;
  sender_not_eq?: InputMaybe<Scalars['String']>;
  sender_not_in?: InputMaybe<Array<Scalars['String']>>;
  sender_not_startsWith?: InputMaybe<Scalars['String']>;
  sender_startsWith?: InputMaybe<Scalars['String']>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
  to_contains?: InputMaybe<Scalars['String']>;
  to_containsInsensitive?: InputMaybe<Scalars['String']>;
  to_endsWith?: InputMaybe<Scalars['String']>;
  to_eq?: InputMaybe<Scalars['String']>;
  to_gt?: InputMaybe<Scalars['String']>;
  to_gte?: InputMaybe<Scalars['String']>;
  to_in?: InputMaybe<Array<Scalars['String']>>;
  to_isNull?: InputMaybe<Scalars['Boolean']>;
  to_lt?: InputMaybe<Scalars['String']>;
  to_lte?: InputMaybe<Scalars['String']>;
  to_not_contains?: InputMaybe<Scalars['String']>;
  to_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  to_not_endsWith?: InputMaybe<Scalars['String']>;
  to_not_eq?: InputMaybe<Scalars['String']>;
  to_not_in?: InputMaybe<Array<Scalars['String']>>;
  to_not_startsWith?: InputMaybe<Scalars['String']>;
  to_startsWith?: InputMaybe<Scalars['String']>;
  transaction?: InputMaybe<TransactionWhereInput>;
  transaction_isNull?: InputMaybe<Scalars['Boolean']>;
};

export type MintsConnection = {
  __typename?: 'MintsConnection';
  edges: Array<MintEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['String'];
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
};

export type Pair = {
  __typename?: 'Pair';
  burns: Array<Burn>;
  createdAtBlockNumber: Scalars['BigInt'];
  createdAtTimestamp: Scalars['DateTime'];
  id: Scalars['String'];
  liquidityPositionSnapshots: Array<LiquidityPositionSnapshot>;
  liquidityPositions: Array<LiquidityPosition>;
  liquidityProviderCount: Scalars['Int'];
  mints: Array<Mint>;
  pairDayData: Array<PairDayData>;
  pairHourData: Array<PairHourData>;
  /** BigDecimal */
  reserve0: Scalars['String'];
  /** BigDecimal */
  reserve1: Scalars['String'];
  /** BigDecimal */
  reserveETH: Scalars['String'];
  /** BigDecimal */
  reserveUSD: Scalars['String'];
  swaps: Array<Swap>;
  token0: Token;
  /** BigDecimal */
  token0Price: Scalars['String'];
  token1: Token;
  /** BigDecimal */
  token1Price: Scalars['String'];
  /** BigDecimal */
  totalSupply: Scalars['String'];
  /** BigDecimal */
  trackedReserveETH: Scalars['String'];
  txCount: Scalars['Int'];
  /** BigDecimal */
  untrackedVolumeUSD: Scalars['String'];
  /** BigDecimal */
  volumeToken0: Scalars['String'];
  /** BigDecimal */
  volumeToken1: Scalars['String'];
  /** BigDecimal */
  volumeUSD: Scalars['String'];
};


export type PairBurnsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<BurnOrderByInput>>;
  where?: InputMaybe<BurnWhereInput>;
};


export type PairLiquidityPositionSnapshotsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<LiquidityPositionSnapshotOrderByInput>>;
  where?: InputMaybe<LiquidityPositionSnapshotWhereInput>;
};


export type PairLiquidityPositionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<LiquidityPositionOrderByInput>>;
  where?: InputMaybe<LiquidityPositionWhereInput>;
};


export type PairMintsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MintOrderByInput>>;
  where?: InputMaybe<MintWhereInput>;
};


export type PairPairDayDataArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PairDayDataOrderByInput>>;
  where?: InputMaybe<PairDayDataWhereInput>;
};


export type PairPairHourDataArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PairHourDataOrderByInput>>;
  where?: InputMaybe<PairHourDataWhereInput>;
};


export type PairSwapsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SwapOrderByInput>>;
  where?: InputMaybe<SwapWhereInput>;
};

export type PairDayData = {
  __typename?: 'PairDayData';
  dailyTxns: Scalars['Int'];
  dailyVolumeToken0: Scalars['String'];
  dailyVolumeToken1: Scalars['String'];
  dailyVolumeUSD: Scalars['String'];
  date: Scalars['DateTime'];
  id: Scalars['String'];
  pair: Pair;
  pairAddress: Scalars['String'];
  reserve0: Scalars['String'];
  reserve1: Scalars['String'];
  reserveUSD: Scalars['String'];
  token0: Token;
  token1: Token;
  totalSupply: Scalars['String'];
};

export type PairDayDataConnection = {
  __typename?: 'PairDayDataConnection';
  edges: Array<PairDayDataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PairDayDataEdge = {
  __typename?: 'PairDayDataEdge';
  cursor: Scalars['String'];
  node: PairDayData;
};

export enum PairDayDataOrderByInput {
  DailyTxnsAsc = 'dailyTxns_ASC',
  DailyTxnsDesc = 'dailyTxns_DESC',
  DailyVolumeToken0Asc = 'dailyVolumeToken0_ASC',
  DailyVolumeToken0Desc = 'dailyVolumeToken0_DESC',
  DailyVolumeToken1Asc = 'dailyVolumeToken1_ASC',
  DailyVolumeToken1Desc = 'dailyVolumeToken1_DESC',
  DailyVolumeUsdAsc = 'dailyVolumeUSD_ASC',
  DailyVolumeUsdDesc = 'dailyVolumeUSD_DESC',
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PairAddressAsc = 'pairAddress_ASC',
  PairAddressDesc = 'pairAddress_DESC',
  PairCreatedAtBlockNumberAsc = 'pair_createdAtBlockNumber_ASC',
  PairCreatedAtBlockNumberDesc = 'pair_createdAtBlockNumber_DESC',
  PairCreatedAtTimestampAsc = 'pair_createdAtTimestamp_ASC',
  PairCreatedAtTimestampDesc = 'pair_createdAtTimestamp_DESC',
  PairIdAsc = 'pair_id_ASC',
  PairIdDesc = 'pair_id_DESC',
  PairLiquidityProviderCountAsc = 'pair_liquidityProviderCount_ASC',
  PairLiquidityProviderCountDesc = 'pair_liquidityProviderCount_DESC',
  PairReserve0Asc = 'pair_reserve0_ASC',
  PairReserve0Desc = 'pair_reserve0_DESC',
  PairReserve1Asc = 'pair_reserve1_ASC',
  PairReserve1Desc = 'pair_reserve1_DESC',
  PairReserveEthAsc = 'pair_reserveETH_ASC',
  PairReserveEthDesc = 'pair_reserveETH_DESC',
  PairReserveUsdAsc = 'pair_reserveUSD_ASC',
  PairReserveUsdDesc = 'pair_reserveUSD_DESC',
  PairToken0PriceAsc = 'pair_token0Price_ASC',
  PairToken0PriceDesc = 'pair_token0Price_DESC',
  PairToken1PriceAsc = 'pair_token1Price_ASC',
  PairToken1PriceDesc = 'pair_token1Price_DESC',
  PairTotalSupplyAsc = 'pair_totalSupply_ASC',
  PairTotalSupplyDesc = 'pair_totalSupply_DESC',
  PairTrackedReserveEthAsc = 'pair_trackedReserveETH_ASC',
  PairTrackedReserveEthDesc = 'pair_trackedReserveETH_DESC',
  PairTxCountAsc = 'pair_txCount_ASC',
  PairTxCountDesc = 'pair_txCount_DESC',
  PairUntrackedVolumeUsdAsc = 'pair_untrackedVolumeUSD_ASC',
  PairUntrackedVolumeUsdDesc = 'pair_untrackedVolumeUSD_DESC',
  PairVolumeToken0Asc = 'pair_volumeToken0_ASC',
  PairVolumeToken0Desc = 'pair_volumeToken0_DESC',
  PairVolumeToken1Asc = 'pair_volumeToken1_ASC',
  PairVolumeToken1Desc = 'pair_volumeToken1_DESC',
  PairVolumeUsdAsc = 'pair_volumeUSD_ASC',
  PairVolumeUsdDesc = 'pair_volumeUSD_DESC',
  Reserve0Asc = 'reserve0_ASC',
  Reserve0Desc = 'reserve0_DESC',
  Reserve1Asc = 'reserve1_ASC',
  Reserve1Desc = 'reserve1_DESC',
  ReserveUsdAsc = 'reserveUSD_ASC',
  ReserveUsdDesc = 'reserveUSD_DESC',
  Token0DecimalsAsc = 'token0_decimals_ASC',
  Token0DecimalsDesc = 'token0_decimals_DESC',
  Token0DerivedEthAsc = 'token0_derivedETH_ASC',
  Token0DerivedEthDesc = 'token0_derivedETH_DESC',
  Token0IdAsc = 'token0_id_ASC',
  Token0IdDesc = 'token0_id_DESC',
  Token0NameAsc = 'token0_name_ASC',
  Token0NameDesc = 'token0_name_DESC',
  Token0SymbolAsc = 'token0_symbol_ASC',
  Token0SymbolDesc = 'token0_symbol_DESC',
  Token0TotalLiquidityAsc = 'token0_totalLiquidity_ASC',
  Token0TotalLiquidityDesc = 'token0_totalLiquidity_DESC',
  Token0TotalSupplyAsc = 'token0_totalSupply_ASC',
  Token0TotalSupplyDesc = 'token0_totalSupply_DESC',
  Token0TradeVolumeUsdAsc = 'token0_tradeVolumeUSD_ASC',
  Token0TradeVolumeUsdDesc = 'token0_tradeVolumeUSD_DESC',
  Token0TradeVolumeAsc = 'token0_tradeVolume_ASC',
  Token0TradeVolumeDesc = 'token0_tradeVolume_DESC',
  Token0TxCountAsc = 'token0_txCount_ASC',
  Token0TxCountDesc = 'token0_txCount_DESC',
  Token0UntrackedVolumeUsdAsc = 'token0_untrackedVolumeUSD_ASC',
  Token0UntrackedVolumeUsdDesc = 'token0_untrackedVolumeUSD_DESC',
  Token1DecimalsAsc = 'token1_decimals_ASC',
  Token1DecimalsDesc = 'token1_decimals_DESC',
  Token1DerivedEthAsc = 'token1_derivedETH_ASC',
  Token1DerivedEthDesc = 'token1_derivedETH_DESC',
  Token1IdAsc = 'token1_id_ASC',
  Token1IdDesc = 'token1_id_DESC',
  Token1NameAsc = 'token1_name_ASC',
  Token1NameDesc = 'token1_name_DESC',
  Token1SymbolAsc = 'token1_symbol_ASC',
  Token1SymbolDesc = 'token1_symbol_DESC',
  Token1TotalLiquidityAsc = 'token1_totalLiquidity_ASC',
  Token1TotalLiquidityDesc = 'token1_totalLiquidity_DESC',
  Token1TotalSupplyAsc = 'token1_totalSupply_ASC',
  Token1TotalSupplyDesc = 'token1_totalSupply_DESC',
  Token1TradeVolumeUsdAsc = 'token1_tradeVolumeUSD_ASC',
  Token1TradeVolumeUsdDesc = 'token1_tradeVolumeUSD_DESC',
  Token1TradeVolumeAsc = 'token1_tradeVolume_ASC',
  Token1TradeVolumeDesc = 'token1_tradeVolume_DESC',
  Token1TxCountAsc = 'token1_txCount_ASC',
  Token1TxCountDesc = 'token1_txCount_DESC',
  Token1UntrackedVolumeUsdAsc = 'token1_untrackedVolumeUSD_ASC',
  Token1UntrackedVolumeUsdDesc = 'token1_untrackedVolumeUSD_DESC',
  TotalSupplyAsc = 'totalSupply_ASC',
  TotalSupplyDesc = 'totalSupply_DESC'
}

export type PairDayDataWhereInput = {
  AND?: InputMaybe<Array<PairDayDataWhereInput>>;
  OR?: InputMaybe<Array<PairDayDataWhereInput>>;
  dailyTxns_eq?: InputMaybe<Scalars['Int']>;
  dailyTxns_gt?: InputMaybe<Scalars['Int']>;
  dailyTxns_gte?: InputMaybe<Scalars['Int']>;
  dailyTxns_in?: InputMaybe<Array<Scalars['Int']>>;
  dailyTxns_isNull?: InputMaybe<Scalars['Boolean']>;
  dailyTxns_lt?: InputMaybe<Scalars['Int']>;
  dailyTxns_lte?: InputMaybe<Scalars['Int']>;
  dailyTxns_not_eq?: InputMaybe<Scalars['Int']>;
  dailyTxns_not_in?: InputMaybe<Array<Scalars['Int']>>;
  dailyVolumeToken0_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeToken0_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeToken0_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeToken0_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeToken0_gt?: InputMaybe<Scalars['String']>;
  dailyVolumeToken0_gte?: InputMaybe<Scalars['String']>;
  dailyVolumeToken0_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeToken0_isNull?: InputMaybe<Scalars['Boolean']>;
  dailyVolumeToken0_lt?: InputMaybe<Scalars['String']>;
  dailyVolumeToken0_lte?: InputMaybe<Scalars['String']>;
  dailyVolumeToken0_not_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeToken0_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeToken0_not_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeToken0_not_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeToken0_not_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeToken0_not_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeToken0_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeToken1_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeToken1_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeToken1_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeToken1_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeToken1_gt?: InputMaybe<Scalars['String']>;
  dailyVolumeToken1_gte?: InputMaybe<Scalars['String']>;
  dailyVolumeToken1_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeToken1_isNull?: InputMaybe<Scalars['Boolean']>;
  dailyVolumeToken1_lt?: InputMaybe<Scalars['String']>;
  dailyVolumeToken1_lte?: InputMaybe<Scalars['String']>;
  dailyVolumeToken1_not_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeToken1_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeToken1_not_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeToken1_not_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeToken1_not_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeToken1_not_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeToken1_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  dailyVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
  date_eq?: InputMaybe<Scalars['DateTime']>;
  date_gt?: InputMaybe<Scalars['DateTime']>;
  date_gte?: InputMaybe<Scalars['DateTime']>;
  date_in?: InputMaybe<Array<Scalars['DateTime']>>;
  date_isNull?: InputMaybe<Scalars['Boolean']>;
  date_lt?: InputMaybe<Scalars['DateTime']>;
  date_lte?: InputMaybe<Scalars['DateTime']>;
  date_not_eq?: InputMaybe<Scalars['DateTime']>;
  date_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<PairWhereInput>;
  pairAddress_contains?: InputMaybe<Scalars['String']>;
  pairAddress_containsInsensitive?: InputMaybe<Scalars['String']>;
  pairAddress_endsWith?: InputMaybe<Scalars['String']>;
  pairAddress_eq?: InputMaybe<Scalars['String']>;
  pairAddress_gt?: InputMaybe<Scalars['String']>;
  pairAddress_gte?: InputMaybe<Scalars['String']>;
  pairAddress_in?: InputMaybe<Array<Scalars['String']>>;
  pairAddress_isNull?: InputMaybe<Scalars['Boolean']>;
  pairAddress_lt?: InputMaybe<Scalars['String']>;
  pairAddress_lte?: InputMaybe<Scalars['String']>;
  pairAddress_not_contains?: InputMaybe<Scalars['String']>;
  pairAddress_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  pairAddress_not_endsWith?: InputMaybe<Scalars['String']>;
  pairAddress_not_eq?: InputMaybe<Scalars['String']>;
  pairAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  pairAddress_not_startsWith?: InputMaybe<Scalars['String']>;
  pairAddress_startsWith?: InputMaybe<Scalars['String']>;
  pair_isNull?: InputMaybe<Scalars['Boolean']>;
  reserve0_contains?: InputMaybe<Scalars['String']>;
  reserve0_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve0_endsWith?: InputMaybe<Scalars['String']>;
  reserve0_eq?: InputMaybe<Scalars['String']>;
  reserve0_gt?: InputMaybe<Scalars['String']>;
  reserve0_gte?: InputMaybe<Scalars['String']>;
  reserve0_in?: InputMaybe<Array<Scalars['String']>>;
  reserve0_isNull?: InputMaybe<Scalars['Boolean']>;
  reserve0_lt?: InputMaybe<Scalars['String']>;
  reserve0_lte?: InputMaybe<Scalars['String']>;
  reserve0_not_contains?: InputMaybe<Scalars['String']>;
  reserve0_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve0_not_endsWith?: InputMaybe<Scalars['String']>;
  reserve0_not_eq?: InputMaybe<Scalars['String']>;
  reserve0_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserve0_not_startsWith?: InputMaybe<Scalars['String']>;
  reserve0_startsWith?: InputMaybe<Scalars['String']>;
  reserve1_contains?: InputMaybe<Scalars['String']>;
  reserve1_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve1_endsWith?: InputMaybe<Scalars['String']>;
  reserve1_eq?: InputMaybe<Scalars['String']>;
  reserve1_gt?: InputMaybe<Scalars['String']>;
  reserve1_gte?: InputMaybe<Scalars['String']>;
  reserve1_in?: InputMaybe<Array<Scalars['String']>>;
  reserve1_isNull?: InputMaybe<Scalars['Boolean']>;
  reserve1_lt?: InputMaybe<Scalars['String']>;
  reserve1_lte?: InputMaybe<Scalars['String']>;
  reserve1_not_contains?: InputMaybe<Scalars['String']>;
  reserve1_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve1_not_endsWith?: InputMaybe<Scalars['String']>;
  reserve1_not_eq?: InputMaybe<Scalars['String']>;
  reserve1_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserve1_not_startsWith?: InputMaybe<Scalars['String']>;
  reserve1_startsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_contains?: InputMaybe<Scalars['String']>;
  reserveUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserveUSD_endsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_eq?: InputMaybe<Scalars['String']>;
  reserveUSD_gt?: InputMaybe<Scalars['String']>;
  reserveUSD_gte?: InputMaybe<Scalars['String']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['String']>>;
  reserveUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  reserveUSD_lt?: InputMaybe<Scalars['String']>;
  reserveUSD_lte?: InputMaybe<Scalars['String']>;
  reserveUSD_not_contains?: InputMaybe<Scalars['String']>;
  reserveUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserveUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_not_eq?: InputMaybe<Scalars['String']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserveUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_startsWith?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<TokenWhereInput>;
  token0_isNull?: InputMaybe<Scalars['Boolean']>;
  token1?: InputMaybe<TokenWhereInput>;
  token1_isNull?: InputMaybe<Scalars['Boolean']>;
  totalSupply_contains?: InputMaybe<Scalars['String']>;
  totalSupply_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalSupply_endsWith?: InputMaybe<Scalars['String']>;
  totalSupply_eq?: InputMaybe<Scalars['String']>;
  totalSupply_gt?: InputMaybe<Scalars['String']>;
  totalSupply_gte?: InputMaybe<Scalars['String']>;
  totalSupply_in?: InputMaybe<Array<Scalars['String']>>;
  totalSupply_isNull?: InputMaybe<Scalars['Boolean']>;
  totalSupply_lt?: InputMaybe<Scalars['String']>;
  totalSupply_lte?: InputMaybe<Scalars['String']>;
  totalSupply_not_contains?: InputMaybe<Scalars['String']>;
  totalSupply_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalSupply_not_endsWith?: InputMaybe<Scalars['String']>;
  totalSupply_not_eq?: InputMaybe<Scalars['String']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalSupply_not_startsWith?: InputMaybe<Scalars['String']>;
  totalSupply_startsWith?: InputMaybe<Scalars['String']>;
};

export type PairEdge = {
  __typename?: 'PairEdge';
  cursor: Scalars['String'];
  node: Pair;
};

export type PairHourData = {
  __typename?: 'PairHourData';
  hourStartUnix: Scalars['BigInt'];
  hourlyTxns: Scalars['Int'];
  hourlyVolumeToken0: Scalars['String'];
  hourlyVolumeToken1: Scalars['String'];
  hourlyVolumeUSD: Scalars['String'];
  id: Scalars['String'];
  pair: Pair;
  reserve0: Scalars['String'];
  reserve1: Scalars['String'];
  reserveUSD: Scalars['String'];
  totalSupply: Scalars['String'];
};

export type PairHourDataConnection = {
  __typename?: 'PairHourDataConnection';
  edges: Array<PairHourDataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PairHourDataEdge = {
  __typename?: 'PairHourDataEdge';
  cursor: Scalars['String'];
  node: PairHourData;
};

export enum PairHourDataOrderByInput {
  HourStartUnixAsc = 'hourStartUnix_ASC',
  HourStartUnixDesc = 'hourStartUnix_DESC',
  HourlyTxnsAsc = 'hourlyTxns_ASC',
  HourlyTxnsDesc = 'hourlyTxns_DESC',
  HourlyVolumeToken0Asc = 'hourlyVolumeToken0_ASC',
  HourlyVolumeToken0Desc = 'hourlyVolumeToken0_DESC',
  HourlyVolumeToken1Asc = 'hourlyVolumeToken1_ASC',
  HourlyVolumeToken1Desc = 'hourlyVolumeToken1_DESC',
  HourlyVolumeUsdAsc = 'hourlyVolumeUSD_ASC',
  HourlyVolumeUsdDesc = 'hourlyVolumeUSD_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PairCreatedAtBlockNumberAsc = 'pair_createdAtBlockNumber_ASC',
  PairCreatedAtBlockNumberDesc = 'pair_createdAtBlockNumber_DESC',
  PairCreatedAtTimestampAsc = 'pair_createdAtTimestamp_ASC',
  PairCreatedAtTimestampDesc = 'pair_createdAtTimestamp_DESC',
  PairIdAsc = 'pair_id_ASC',
  PairIdDesc = 'pair_id_DESC',
  PairLiquidityProviderCountAsc = 'pair_liquidityProviderCount_ASC',
  PairLiquidityProviderCountDesc = 'pair_liquidityProviderCount_DESC',
  PairReserve0Asc = 'pair_reserve0_ASC',
  PairReserve0Desc = 'pair_reserve0_DESC',
  PairReserve1Asc = 'pair_reserve1_ASC',
  PairReserve1Desc = 'pair_reserve1_DESC',
  PairReserveEthAsc = 'pair_reserveETH_ASC',
  PairReserveEthDesc = 'pair_reserveETH_DESC',
  PairReserveUsdAsc = 'pair_reserveUSD_ASC',
  PairReserveUsdDesc = 'pair_reserveUSD_DESC',
  PairToken0PriceAsc = 'pair_token0Price_ASC',
  PairToken0PriceDesc = 'pair_token0Price_DESC',
  PairToken1PriceAsc = 'pair_token1Price_ASC',
  PairToken1PriceDesc = 'pair_token1Price_DESC',
  PairTotalSupplyAsc = 'pair_totalSupply_ASC',
  PairTotalSupplyDesc = 'pair_totalSupply_DESC',
  PairTrackedReserveEthAsc = 'pair_trackedReserveETH_ASC',
  PairTrackedReserveEthDesc = 'pair_trackedReserveETH_DESC',
  PairTxCountAsc = 'pair_txCount_ASC',
  PairTxCountDesc = 'pair_txCount_DESC',
  PairUntrackedVolumeUsdAsc = 'pair_untrackedVolumeUSD_ASC',
  PairUntrackedVolumeUsdDesc = 'pair_untrackedVolumeUSD_DESC',
  PairVolumeToken0Asc = 'pair_volumeToken0_ASC',
  PairVolumeToken0Desc = 'pair_volumeToken0_DESC',
  PairVolumeToken1Asc = 'pair_volumeToken1_ASC',
  PairVolumeToken1Desc = 'pair_volumeToken1_DESC',
  PairVolumeUsdAsc = 'pair_volumeUSD_ASC',
  PairVolumeUsdDesc = 'pair_volumeUSD_DESC',
  Reserve0Asc = 'reserve0_ASC',
  Reserve0Desc = 'reserve0_DESC',
  Reserve1Asc = 'reserve1_ASC',
  Reserve1Desc = 'reserve1_DESC',
  ReserveUsdAsc = 'reserveUSD_ASC',
  ReserveUsdDesc = 'reserveUSD_DESC',
  TotalSupplyAsc = 'totalSupply_ASC',
  TotalSupplyDesc = 'totalSupply_DESC'
}

export type PairHourDataWhereInput = {
  AND?: InputMaybe<Array<PairHourDataWhereInput>>;
  OR?: InputMaybe<Array<PairHourDataWhereInput>>;
  hourStartUnix_eq?: InputMaybe<Scalars['BigInt']>;
  hourStartUnix_gt?: InputMaybe<Scalars['BigInt']>;
  hourStartUnix_gte?: InputMaybe<Scalars['BigInt']>;
  hourStartUnix_in?: InputMaybe<Array<Scalars['BigInt']>>;
  hourStartUnix_isNull?: InputMaybe<Scalars['Boolean']>;
  hourStartUnix_lt?: InputMaybe<Scalars['BigInt']>;
  hourStartUnix_lte?: InputMaybe<Scalars['BigInt']>;
  hourStartUnix_not_eq?: InputMaybe<Scalars['BigInt']>;
  hourStartUnix_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  hourlyTxns_eq?: InputMaybe<Scalars['Int']>;
  hourlyTxns_gt?: InputMaybe<Scalars['Int']>;
  hourlyTxns_gte?: InputMaybe<Scalars['Int']>;
  hourlyTxns_in?: InputMaybe<Array<Scalars['Int']>>;
  hourlyTxns_isNull?: InputMaybe<Scalars['Boolean']>;
  hourlyTxns_lt?: InputMaybe<Scalars['Int']>;
  hourlyTxns_lte?: InputMaybe<Scalars['Int']>;
  hourlyTxns_not_eq?: InputMaybe<Scalars['Int']>;
  hourlyTxns_not_in?: InputMaybe<Array<Scalars['Int']>>;
  hourlyVolumeToken0_contains?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken0_containsInsensitive?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken0_endsWith?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken0_eq?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken0_gt?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken0_gte?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken0_in?: InputMaybe<Array<Scalars['String']>>;
  hourlyVolumeToken0_isNull?: InputMaybe<Scalars['Boolean']>;
  hourlyVolumeToken0_lt?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken0_lte?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken0_not_contains?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken0_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken0_not_endsWith?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken0_not_eq?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken0_not_in?: InputMaybe<Array<Scalars['String']>>;
  hourlyVolumeToken0_not_startsWith?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken0_startsWith?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken1_contains?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken1_containsInsensitive?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken1_endsWith?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken1_eq?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken1_gt?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken1_gte?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken1_in?: InputMaybe<Array<Scalars['String']>>;
  hourlyVolumeToken1_isNull?: InputMaybe<Scalars['Boolean']>;
  hourlyVolumeToken1_lt?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken1_lte?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken1_not_contains?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken1_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken1_not_endsWith?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken1_not_eq?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken1_not_in?: InputMaybe<Array<Scalars['String']>>;
  hourlyVolumeToken1_not_startsWith?: InputMaybe<Scalars['String']>;
  hourlyVolumeToken1_startsWith?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  hourlyVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  hourlyVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  hourlyVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<PairWhereInput>;
  pair_isNull?: InputMaybe<Scalars['Boolean']>;
  reserve0_contains?: InputMaybe<Scalars['String']>;
  reserve0_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve0_endsWith?: InputMaybe<Scalars['String']>;
  reserve0_eq?: InputMaybe<Scalars['String']>;
  reserve0_gt?: InputMaybe<Scalars['String']>;
  reserve0_gte?: InputMaybe<Scalars['String']>;
  reserve0_in?: InputMaybe<Array<Scalars['String']>>;
  reserve0_isNull?: InputMaybe<Scalars['Boolean']>;
  reserve0_lt?: InputMaybe<Scalars['String']>;
  reserve0_lte?: InputMaybe<Scalars['String']>;
  reserve0_not_contains?: InputMaybe<Scalars['String']>;
  reserve0_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve0_not_endsWith?: InputMaybe<Scalars['String']>;
  reserve0_not_eq?: InputMaybe<Scalars['String']>;
  reserve0_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserve0_not_startsWith?: InputMaybe<Scalars['String']>;
  reserve0_startsWith?: InputMaybe<Scalars['String']>;
  reserve1_contains?: InputMaybe<Scalars['String']>;
  reserve1_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve1_endsWith?: InputMaybe<Scalars['String']>;
  reserve1_eq?: InputMaybe<Scalars['String']>;
  reserve1_gt?: InputMaybe<Scalars['String']>;
  reserve1_gte?: InputMaybe<Scalars['String']>;
  reserve1_in?: InputMaybe<Array<Scalars['String']>>;
  reserve1_isNull?: InputMaybe<Scalars['Boolean']>;
  reserve1_lt?: InputMaybe<Scalars['String']>;
  reserve1_lte?: InputMaybe<Scalars['String']>;
  reserve1_not_contains?: InputMaybe<Scalars['String']>;
  reserve1_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve1_not_endsWith?: InputMaybe<Scalars['String']>;
  reserve1_not_eq?: InputMaybe<Scalars['String']>;
  reserve1_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserve1_not_startsWith?: InputMaybe<Scalars['String']>;
  reserve1_startsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_contains?: InputMaybe<Scalars['String']>;
  reserveUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserveUSD_endsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_eq?: InputMaybe<Scalars['String']>;
  reserveUSD_gt?: InputMaybe<Scalars['String']>;
  reserveUSD_gte?: InputMaybe<Scalars['String']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['String']>>;
  reserveUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  reserveUSD_lt?: InputMaybe<Scalars['String']>;
  reserveUSD_lte?: InputMaybe<Scalars['String']>;
  reserveUSD_not_contains?: InputMaybe<Scalars['String']>;
  reserveUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserveUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_not_eq?: InputMaybe<Scalars['String']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserveUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_startsWith?: InputMaybe<Scalars['String']>;
  totalSupply_contains?: InputMaybe<Scalars['String']>;
  totalSupply_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalSupply_endsWith?: InputMaybe<Scalars['String']>;
  totalSupply_eq?: InputMaybe<Scalars['String']>;
  totalSupply_gt?: InputMaybe<Scalars['String']>;
  totalSupply_gte?: InputMaybe<Scalars['String']>;
  totalSupply_in?: InputMaybe<Array<Scalars['String']>>;
  totalSupply_isNull?: InputMaybe<Scalars['Boolean']>;
  totalSupply_lt?: InputMaybe<Scalars['String']>;
  totalSupply_lte?: InputMaybe<Scalars['String']>;
  totalSupply_not_contains?: InputMaybe<Scalars['String']>;
  totalSupply_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalSupply_not_endsWith?: InputMaybe<Scalars['String']>;
  totalSupply_not_eq?: InputMaybe<Scalars['String']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalSupply_not_startsWith?: InputMaybe<Scalars['String']>;
  totalSupply_startsWith?: InputMaybe<Scalars['String']>;
};

export enum PairOrderByInput {
  CreatedAtBlockNumberAsc = 'createdAtBlockNumber_ASC',
  CreatedAtBlockNumberDesc = 'createdAtBlockNumber_DESC',
  CreatedAtTimestampAsc = 'createdAtTimestamp_ASC',
  CreatedAtTimestampDesc = 'createdAtTimestamp_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LiquidityProviderCountAsc = 'liquidityProviderCount_ASC',
  LiquidityProviderCountDesc = 'liquidityProviderCount_DESC',
  Reserve0Asc = 'reserve0_ASC',
  Reserve0Desc = 'reserve0_DESC',
  Reserve1Asc = 'reserve1_ASC',
  Reserve1Desc = 'reserve1_DESC',
  ReserveEthAsc = 'reserveETH_ASC',
  ReserveEthDesc = 'reserveETH_DESC',
  ReserveUsdAsc = 'reserveUSD_ASC',
  ReserveUsdDesc = 'reserveUSD_DESC',
  Token0PriceAsc = 'token0Price_ASC',
  Token0PriceDesc = 'token0Price_DESC',
  Token0DecimalsAsc = 'token0_decimals_ASC',
  Token0DecimalsDesc = 'token0_decimals_DESC',
  Token0DerivedEthAsc = 'token0_derivedETH_ASC',
  Token0DerivedEthDesc = 'token0_derivedETH_DESC',
  Token0IdAsc = 'token0_id_ASC',
  Token0IdDesc = 'token0_id_DESC',
  Token0NameAsc = 'token0_name_ASC',
  Token0NameDesc = 'token0_name_DESC',
  Token0SymbolAsc = 'token0_symbol_ASC',
  Token0SymbolDesc = 'token0_symbol_DESC',
  Token0TotalLiquidityAsc = 'token0_totalLiquidity_ASC',
  Token0TotalLiquidityDesc = 'token0_totalLiquidity_DESC',
  Token0TotalSupplyAsc = 'token0_totalSupply_ASC',
  Token0TotalSupplyDesc = 'token0_totalSupply_DESC',
  Token0TradeVolumeUsdAsc = 'token0_tradeVolumeUSD_ASC',
  Token0TradeVolumeUsdDesc = 'token0_tradeVolumeUSD_DESC',
  Token0TradeVolumeAsc = 'token0_tradeVolume_ASC',
  Token0TradeVolumeDesc = 'token0_tradeVolume_DESC',
  Token0TxCountAsc = 'token0_txCount_ASC',
  Token0TxCountDesc = 'token0_txCount_DESC',
  Token0UntrackedVolumeUsdAsc = 'token0_untrackedVolumeUSD_ASC',
  Token0UntrackedVolumeUsdDesc = 'token0_untrackedVolumeUSD_DESC',
  Token1PriceAsc = 'token1Price_ASC',
  Token1PriceDesc = 'token1Price_DESC',
  Token1DecimalsAsc = 'token1_decimals_ASC',
  Token1DecimalsDesc = 'token1_decimals_DESC',
  Token1DerivedEthAsc = 'token1_derivedETH_ASC',
  Token1DerivedEthDesc = 'token1_derivedETH_DESC',
  Token1IdAsc = 'token1_id_ASC',
  Token1IdDesc = 'token1_id_DESC',
  Token1NameAsc = 'token1_name_ASC',
  Token1NameDesc = 'token1_name_DESC',
  Token1SymbolAsc = 'token1_symbol_ASC',
  Token1SymbolDesc = 'token1_symbol_DESC',
  Token1TotalLiquidityAsc = 'token1_totalLiquidity_ASC',
  Token1TotalLiquidityDesc = 'token1_totalLiquidity_DESC',
  Token1TotalSupplyAsc = 'token1_totalSupply_ASC',
  Token1TotalSupplyDesc = 'token1_totalSupply_DESC',
  Token1TradeVolumeUsdAsc = 'token1_tradeVolumeUSD_ASC',
  Token1TradeVolumeUsdDesc = 'token1_tradeVolumeUSD_DESC',
  Token1TradeVolumeAsc = 'token1_tradeVolume_ASC',
  Token1TradeVolumeDesc = 'token1_tradeVolume_DESC',
  Token1TxCountAsc = 'token1_txCount_ASC',
  Token1TxCountDesc = 'token1_txCount_DESC',
  Token1UntrackedVolumeUsdAsc = 'token1_untrackedVolumeUSD_ASC',
  Token1UntrackedVolumeUsdDesc = 'token1_untrackedVolumeUSD_DESC',
  TotalSupplyAsc = 'totalSupply_ASC',
  TotalSupplyDesc = 'totalSupply_DESC',
  TrackedReserveEthAsc = 'trackedReserveETH_ASC',
  TrackedReserveEthDesc = 'trackedReserveETH_DESC',
  TxCountAsc = 'txCount_ASC',
  TxCountDesc = 'txCount_DESC',
  UntrackedVolumeUsdAsc = 'untrackedVolumeUSD_ASC',
  UntrackedVolumeUsdDesc = 'untrackedVolumeUSD_DESC',
  VolumeToken0Asc = 'volumeToken0_ASC',
  VolumeToken0Desc = 'volumeToken0_DESC',
  VolumeToken1Asc = 'volumeToken1_ASC',
  VolumeToken1Desc = 'volumeToken1_DESC',
  VolumeUsdAsc = 'volumeUSD_ASC',
  VolumeUsdDesc = 'volumeUSD_DESC'
}

export type PairWhereInput = {
  AND?: InputMaybe<Array<PairWhereInput>>;
  OR?: InputMaybe<Array<PairWhereInput>>;
  burns_every?: InputMaybe<BurnWhereInput>;
  burns_none?: InputMaybe<BurnWhereInput>;
  burns_some?: InputMaybe<BurnWhereInput>;
  createdAtBlockNumber_eq?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlockNumber_isNull?: InputMaybe<Scalars['Boolean']>;
  createdAtBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_not_eq?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_eq?: InputMaybe<Scalars['DateTime']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['DateTime']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['DateTime']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['DateTime']>>;
  createdAtTimestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['DateTime']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['DateTime']>;
  createdAtTimestamp_not_eq?: InputMaybe<Scalars['DateTime']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  liquidityPositionSnapshots_every?: InputMaybe<LiquidityPositionSnapshotWhereInput>;
  liquidityPositionSnapshots_none?: InputMaybe<LiquidityPositionSnapshotWhereInput>;
  liquidityPositionSnapshots_some?: InputMaybe<LiquidityPositionSnapshotWhereInput>;
  liquidityPositions_every?: InputMaybe<LiquidityPositionWhereInput>;
  liquidityPositions_none?: InputMaybe<LiquidityPositionWhereInput>;
  liquidityPositions_some?: InputMaybe<LiquidityPositionWhereInput>;
  liquidityProviderCount_eq?: InputMaybe<Scalars['Int']>;
  liquidityProviderCount_gt?: InputMaybe<Scalars['Int']>;
  liquidityProviderCount_gte?: InputMaybe<Scalars['Int']>;
  liquidityProviderCount_in?: InputMaybe<Array<Scalars['Int']>>;
  liquidityProviderCount_isNull?: InputMaybe<Scalars['Boolean']>;
  liquidityProviderCount_lt?: InputMaybe<Scalars['Int']>;
  liquidityProviderCount_lte?: InputMaybe<Scalars['Int']>;
  liquidityProviderCount_not_eq?: InputMaybe<Scalars['Int']>;
  liquidityProviderCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  mints_every?: InputMaybe<MintWhereInput>;
  mints_none?: InputMaybe<MintWhereInput>;
  mints_some?: InputMaybe<MintWhereInput>;
  pairDayData_every?: InputMaybe<PairDayDataWhereInput>;
  pairDayData_none?: InputMaybe<PairDayDataWhereInput>;
  pairDayData_some?: InputMaybe<PairDayDataWhereInput>;
  pairHourData_every?: InputMaybe<PairHourDataWhereInput>;
  pairHourData_none?: InputMaybe<PairHourDataWhereInput>;
  pairHourData_some?: InputMaybe<PairHourDataWhereInput>;
  reserve0_contains?: InputMaybe<Scalars['String']>;
  reserve0_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve0_endsWith?: InputMaybe<Scalars['String']>;
  reserve0_eq?: InputMaybe<Scalars['String']>;
  reserve0_gt?: InputMaybe<Scalars['String']>;
  reserve0_gte?: InputMaybe<Scalars['String']>;
  reserve0_in?: InputMaybe<Array<Scalars['String']>>;
  reserve0_isNull?: InputMaybe<Scalars['Boolean']>;
  reserve0_lt?: InputMaybe<Scalars['String']>;
  reserve0_lte?: InputMaybe<Scalars['String']>;
  reserve0_not_contains?: InputMaybe<Scalars['String']>;
  reserve0_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve0_not_endsWith?: InputMaybe<Scalars['String']>;
  reserve0_not_eq?: InputMaybe<Scalars['String']>;
  reserve0_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserve0_not_startsWith?: InputMaybe<Scalars['String']>;
  reserve0_startsWith?: InputMaybe<Scalars['String']>;
  reserve1_contains?: InputMaybe<Scalars['String']>;
  reserve1_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve1_endsWith?: InputMaybe<Scalars['String']>;
  reserve1_eq?: InputMaybe<Scalars['String']>;
  reserve1_gt?: InputMaybe<Scalars['String']>;
  reserve1_gte?: InputMaybe<Scalars['String']>;
  reserve1_in?: InputMaybe<Array<Scalars['String']>>;
  reserve1_isNull?: InputMaybe<Scalars['Boolean']>;
  reserve1_lt?: InputMaybe<Scalars['String']>;
  reserve1_lte?: InputMaybe<Scalars['String']>;
  reserve1_not_contains?: InputMaybe<Scalars['String']>;
  reserve1_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserve1_not_endsWith?: InputMaybe<Scalars['String']>;
  reserve1_not_eq?: InputMaybe<Scalars['String']>;
  reserve1_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserve1_not_startsWith?: InputMaybe<Scalars['String']>;
  reserve1_startsWith?: InputMaybe<Scalars['String']>;
  reserveETH_contains?: InputMaybe<Scalars['String']>;
  reserveETH_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserveETH_endsWith?: InputMaybe<Scalars['String']>;
  reserveETH_eq?: InputMaybe<Scalars['String']>;
  reserveETH_gt?: InputMaybe<Scalars['String']>;
  reserveETH_gte?: InputMaybe<Scalars['String']>;
  reserveETH_in?: InputMaybe<Array<Scalars['String']>>;
  reserveETH_isNull?: InputMaybe<Scalars['Boolean']>;
  reserveETH_lt?: InputMaybe<Scalars['String']>;
  reserveETH_lte?: InputMaybe<Scalars['String']>;
  reserveETH_not_contains?: InputMaybe<Scalars['String']>;
  reserveETH_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserveETH_not_endsWith?: InputMaybe<Scalars['String']>;
  reserveETH_not_eq?: InputMaybe<Scalars['String']>;
  reserveETH_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserveETH_not_startsWith?: InputMaybe<Scalars['String']>;
  reserveETH_startsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_contains?: InputMaybe<Scalars['String']>;
  reserveUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserveUSD_endsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_eq?: InputMaybe<Scalars['String']>;
  reserveUSD_gt?: InputMaybe<Scalars['String']>;
  reserveUSD_gte?: InputMaybe<Scalars['String']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['String']>>;
  reserveUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  reserveUSD_lt?: InputMaybe<Scalars['String']>;
  reserveUSD_lte?: InputMaybe<Scalars['String']>;
  reserveUSD_not_contains?: InputMaybe<Scalars['String']>;
  reserveUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  reserveUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_not_eq?: InputMaybe<Scalars['String']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserveUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  reserveUSD_startsWith?: InputMaybe<Scalars['String']>;
  swaps_every?: InputMaybe<SwapWhereInput>;
  swaps_none?: InputMaybe<SwapWhereInput>;
  swaps_some?: InputMaybe<SwapWhereInput>;
  token0?: InputMaybe<TokenWhereInput>;
  token0Price_contains?: InputMaybe<Scalars['String']>;
  token0Price_containsInsensitive?: InputMaybe<Scalars['String']>;
  token0Price_endsWith?: InputMaybe<Scalars['String']>;
  token0Price_eq?: InputMaybe<Scalars['String']>;
  token0Price_gt?: InputMaybe<Scalars['String']>;
  token0Price_gte?: InputMaybe<Scalars['String']>;
  token0Price_in?: InputMaybe<Array<Scalars['String']>>;
  token0Price_isNull?: InputMaybe<Scalars['Boolean']>;
  token0Price_lt?: InputMaybe<Scalars['String']>;
  token0Price_lte?: InputMaybe<Scalars['String']>;
  token0Price_not_contains?: InputMaybe<Scalars['String']>;
  token0Price_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  token0Price_not_endsWith?: InputMaybe<Scalars['String']>;
  token0Price_not_eq?: InputMaybe<Scalars['String']>;
  token0Price_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0Price_not_startsWith?: InputMaybe<Scalars['String']>;
  token0Price_startsWith?: InputMaybe<Scalars['String']>;
  token0_isNull?: InputMaybe<Scalars['Boolean']>;
  token1?: InputMaybe<TokenWhereInput>;
  token1Price_contains?: InputMaybe<Scalars['String']>;
  token1Price_containsInsensitive?: InputMaybe<Scalars['String']>;
  token1Price_endsWith?: InputMaybe<Scalars['String']>;
  token1Price_eq?: InputMaybe<Scalars['String']>;
  token1Price_gt?: InputMaybe<Scalars['String']>;
  token1Price_gte?: InputMaybe<Scalars['String']>;
  token1Price_in?: InputMaybe<Array<Scalars['String']>>;
  token1Price_isNull?: InputMaybe<Scalars['Boolean']>;
  token1Price_lt?: InputMaybe<Scalars['String']>;
  token1Price_lte?: InputMaybe<Scalars['String']>;
  token1Price_not_contains?: InputMaybe<Scalars['String']>;
  token1Price_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  token1Price_not_endsWith?: InputMaybe<Scalars['String']>;
  token1Price_not_eq?: InputMaybe<Scalars['String']>;
  token1Price_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1Price_not_startsWith?: InputMaybe<Scalars['String']>;
  token1Price_startsWith?: InputMaybe<Scalars['String']>;
  token1_isNull?: InputMaybe<Scalars['Boolean']>;
  totalSupply_contains?: InputMaybe<Scalars['String']>;
  totalSupply_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalSupply_endsWith?: InputMaybe<Scalars['String']>;
  totalSupply_eq?: InputMaybe<Scalars['String']>;
  totalSupply_gt?: InputMaybe<Scalars['String']>;
  totalSupply_gte?: InputMaybe<Scalars['String']>;
  totalSupply_in?: InputMaybe<Array<Scalars['String']>>;
  totalSupply_isNull?: InputMaybe<Scalars['Boolean']>;
  totalSupply_lt?: InputMaybe<Scalars['String']>;
  totalSupply_lte?: InputMaybe<Scalars['String']>;
  totalSupply_not_contains?: InputMaybe<Scalars['String']>;
  totalSupply_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalSupply_not_endsWith?: InputMaybe<Scalars['String']>;
  totalSupply_not_eq?: InputMaybe<Scalars['String']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalSupply_not_startsWith?: InputMaybe<Scalars['String']>;
  totalSupply_startsWith?: InputMaybe<Scalars['String']>;
  trackedReserveETH_contains?: InputMaybe<Scalars['String']>;
  trackedReserveETH_containsInsensitive?: InputMaybe<Scalars['String']>;
  trackedReserveETH_endsWith?: InputMaybe<Scalars['String']>;
  trackedReserveETH_eq?: InputMaybe<Scalars['String']>;
  trackedReserveETH_gt?: InputMaybe<Scalars['String']>;
  trackedReserveETH_gte?: InputMaybe<Scalars['String']>;
  trackedReserveETH_in?: InputMaybe<Array<Scalars['String']>>;
  trackedReserveETH_isNull?: InputMaybe<Scalars['Boolean']>;
  trackedReserveETH_lt?: InputMaybe<Scalars['String']>;
  trackedReserveETH_lte?: InputMaybe<Scalars['String']>;
  trackedReserveETH_not_contains?: InputMaybe<Scalars['String']>;
  trackedReserveETH_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  trackedReserveETH_not_endsWith?: InputMaybe<Scalars['String']>;
  trackedReserveETH_not_eq?: InputMaybe<Scalars['String']>;
  trackedReserveETH_not_in?: InputMaybe<Array<Scalars['String']>>;
  trackedReserveETH_not_startsWith?: InputMaybe<Scalars['String']>;
  trackedReserveETH_startsWith?: InputMaybe<Scalars['String']>;
  txCount_eq?: InputMaybe<Scalars['Int']>;
  txCount_gt?: InputMaybe<Scalars['Int']>;
  txCount_gte?: InputMaybe<Scalars['Int']>;
  txCount_in?: InputMaybe<Array<Scalars['Int']>>;
  txCount_isNull?: InputMaybe<Scalars['Boolean']>;
  txCount_lt?: InputMaybe<Scalars['Int']>;
  txCount_lte?: InputMaybe<Scalars['Int']>;
  txCount_not_eq?: InputMaybe<Scalars['Int']>;
  txCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  untrackedVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  untrackedVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  untrackedVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
  volumeToken0_contains?: InputMaybe<Scalars['String']>;
  volumeToken0_containsInsensitive?: InputMaybe<Scalars['String']>;
  volumeToken0_endsWith?: InputMaybe<Scalars['String']>;
  volumeToken0_eq?: InputMaybe<Scalars['String']>;
  volumeToken0_gt?: InputMaybe<Scalars['String']>;
  volumeToken0_gte?: InputMaybe<Scalars['String']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['String']>>;
  volumeToken0_isNull?: InputMaybe<Scalars['Boolean']>;
  volumeToken0_lt?: InputMaybe<Scalars['String']>;
  volumeToken0_lte?: InputMaybe<Scalars['String']>;
  volumeToken0_not_contains?: InputMaybe<Scalars['String']>;
  volumeToken0_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  volumeToken0_not_endsWith?: InputMaybe<Scalars['String']>;
  volumeToken0_not_eq?: InputMaybe<Scalars['String']>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['String']>>;
  volumeToken0_not_startsWith?: InputMaybe<Scalars['String']>;
  volumeToken0_startsWith?: InputMaybe<Scalars['String']>;
  volumeToken1_contains?: InputMaybe<Scalars['String']>;
  volumeToken1_containsInsensitive?: InputMaybe<Scalars['String']>;
  volumeToken1_endsWith?: InputMaybe<Scalars['String']>;
  volumeToken1_eq?: InputMaybe<Scalars['String']>;
  volumeToken1_gt?: InputMaybe<Scalars['String']>;
  volumeToken1_gte?: InputMaybe<Scalars['String']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['String']>>;
  volumeToken1_isNull?: InputMaybe<Scalars['Boolean']>;
  volumeToken1_lt?: InputMaybe<Scalars['String']>;
  volumeToken1_lte?: InputMaybe<Scalars['String']>;
  volumeToken1_not_contains?: InputMaybe<Scalars['String']>;
  volumeToken1_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  volumeToken1_not_endsWith?: InputMaybe<Scalars['String']>;
  volumeToken1_not_eq?: InputMaybe<Scalars['String']>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['String']>>;
  volumeToken1_not_startsWith?: InputMaybe<Scalars['String']>;
  volumeToken1_startsWith?: InputMaybe<Scalars['String']>;
  volumeUSD_contains?: InputMaybe<Scalars['String']>;
  volumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  volumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  volumeUSD_eq?: InputMaybe<Scalars['String']>;
  volumeUSD_gt?: InputMaybe<Scalars['String']>;
  volumeUSD_gte?: InputMaybe<Scalars['String']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  volumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  volumeUSD_lt?: InputMaybe<Scalars['String']>;
  volumeUSD_lte?: InputMaybe<Scalars['String']>;
  volumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  volumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  volumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  volumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  volumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  volumeUSD_startsWith?: InputMaybe<Scalars['String']>;
};

export type PairsConnection = {
  __typename?: 'PairsConnection';
  edges: Array<PairEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  blockById?: Maybe<Block>;
  /** @deprecated Use blockById */
  blockByUniqueInput?: Maybe<Block>;
  blocks: Array<Block>;
  blocksConnection: BlocksConnection;
  bundleById?: Maybe<Bundle>;
  /** @deprecated Use bundleById */
  bundleByUniqueInput?: Maybe<Bundle>;
  bundles: Array<Bundle>;
  bundlesConnection: BundlesConnection;
  burnById?: Maybe<Burn>;
  /** @deprecated Use burnById */
  burnByUniqueInput?: Maybe<Burn>;
  burns: Array<Burn>;
  burnsConnection: BurnsConnection;
  callById?: Maybe<Call>;
  /** @deprecated Use callById */
  callByUniqueInput?: Maybe<Call>;
  calls: Array<Call>;
  callsConnection: CallsConnection;
  eventById?: Maybe<Event>;
  /** @deprecated Use eventById */
  eventByUniqueInput?: Maybe<Event>;
  events: Array<Event>;
  eventsConnection: EventsConnection;
  extrinsicById?: Maybe<Extrinsic>;
  /** @deprecated Use extrinsicById */
  extrinsicByUniqueInput?: Maybe<Extrinsic>;
  extrinsics: Array<Extrinsic>;
  extrinsicsConnection: ExtrinsicsConnection;
  factories: Array<Factory>;
  factoriesConnection: FactoriesConnection;
  factoryById?: Maybe<Factory>;
  /** @deprecated Use factoryById */
  factoryByUniqueInput?: Maybe<Factory>;
  factoryDayData: Array<FactoryDayData>;
  factoryDayDataById?: Maybe<FactoryDayData>;
  /** @deprecated Use factoryDayDataById */
  factoryDayDataByUniqueInput?: Maybe<FactoryDayData>;
  factoryDayDataConnection: FactoryDayDataConnection;
  liquidityPositionById?: Maybe<LiquidityPosition>;
  /** @deprecated Use liquidityPositionById */
  liquidityPositionByUniqueInput?: Maybe<LiquidityPosition>;
  liquidityPositionSnapshotById?: Maybe<LiquidityPositionSnapshot>;
  /** @deprecated Use liquidityPositionSnapshotById */
  liquidityPositionSnapshotByUniqueInput?: Maybe<LiquidityPositionSnapshot>;
  liquidityPositionSnapshots: Array<LiquidityPositionSnapshot>;
  liquidityPositionSnapshotsConnection: LiquidityPositionSnapshotsConnection;
  liquidityPositions: Array<LiquidityPosition>;
  liquidityPositionsConnection: LiquidityPositionsConnection;
  metadata: Array<Metadata>;
  metadataById?: Maybe<Metadata>;
  /** @deprecated Use metadataById */
  metadataByUniqueInput?: Maybe<Metadata>;
  metadataConnection: MetadataConnection;
  mintById?: Maybe<Mint>;
  /** @deprecated Use mintById */
  mintByUniqueInput?: Maybe<Mint>;
  mints: Array<Mint>;
  mintsConnection: MintsConnection;
  pairById?: Maybe<Pair>;
  /** @deprecated Use pairById */
  pairByUniqueInput?: Maybe<Pair>;
  pairDayData: Array<PairDayData>;
  pairDayDataById?: Maybe<PairDayData>;
  /** @deprecated Use pairDayDataById */
  pairDayDataByUniqueInput?: Maybe<PairDayData>;
  pairDayDataConnection: PairDayDataConnection;
  pairHourData: Array<PairHourData>;
  pairHourDataById?: Maybe<PairHourData>;
  /** @deprecated Use pairHourDataById */
  pairHourDataByUniqueInput?: Maybe<PairHourData>;
  pairHourDataConnection: PairHourDataConnection;
  pairs: Array<Pair>;
  pairsConnection: PairsConnection;
  squidStatus?: Maybe<SquidStatus>;
  stableDayData: Array<StableDayData>;
  stableDayDataById?: Maybe<StableDayData>;
  /** @deprecated Use stableDayDataById */
  stableDayDataByUniqueInput?: Maybe<StableDayData>;
  stableDayDataConnection: StableDayDataConnection;
  stableSwapById?: Maybe<StableSwap>;
  /** @deprecated Use stableSwapById */
  stableSwapByUniqueInput?: Maybe<StableSwap>;
  stableSwapDayData: Array<StableSwapDayData>;
  stableSwapDayDataById?: Maybe<StableSwapDayData>;
  /** @deprecated Use stableSwapDayDataById */
  stableSwapDayDataByUniqueInput?: Maybe<StableSwapDayData>;
  stableSwapDayDataConnection: StableSwapDayDataConnection;
  stableSwapEventById?: Maybe<StableSwapEvent>;
  /** @deprecated Use stableSwapEventById */
  stableSwapEventByUniqueInput?: Maybe<StableSwapEvent>;
  stableSwapEvents: Array<StableSwapEvent>;
  stableSwapEventsConnection: StableSwapEventsConnection;
  stableSwapExchangeById?: Maybe<StableSwapExchange>;
  /** @deprecated Use stableSwapExchangeById */
  stableSwapExchangeByUniqueInput?: Maybe<StableSwapExchange>;
  stableSwapExchanges: Array<StableSwapExchange>;
  stableSwapExchangesConnection: StableSwapExchangesConnection;
  stableSwapHourData: Array<StableSwapHourData>;
  stableSwapHourDataById?: Maybe<StableSwapHourData>;
  /** @deprecated Use stableSwapHourDataById */
  stableSwapHourDataByUniqueInput?: Maybe<StableSwapHourData>;
  stableSwapHourDataConnection: StableSwapHourDataConnection;
  stableSwapInfoById?: Maybe<StableSwapInfo>;
  /** @deprecated Use stableSwapInfoById */
  stableSwapInfoByUniqueInput?: Maybe<StableSwapInfo>;
  stableSwapInfos: Array<StableSwapInfo>;
  stableSwapInfosConnection: StableSwapInfosConnection;
  stableSwapLiquidityPositionById?: Maybe<StableSwapLiquidityPosition>;
  /** @deprecated Use stableSwapLiquidityPositionById */
  stableSwapLiquidityPositionByUniqueInput?: Maybe<StableSwapLiquidityPosition>;
  stableSwapLiquidityPositions: Array<StableSwapLiquidityPosition>;
  stableSwapLiquidityPositionsConnection: StableSwapLiquidityPositionsConnection;
  stableSwaps: Array<StableSwap>;
  stableSwapsConnection: StableSwapsConnection;
  swapById?: Maybe<Swap>;
  /** @deprecated Use swapById */
  swapByUniqueInput?: Maybe<Swap>;
  swaps: Array<Swap>;
  swapsConnection: SwapsConnection;
  tokenById?: Maybe<Token>;
  /** @deprecated Use tokenById */
  tokenByUniqueInput?: Maybe<Token>;
  tokenDayData: Array<TokenDayData>;
  tokenDayDataById?: Maybe<TokenDayData>;
  /** @deprecated Use tokenDayDataById */
  tokenDayDataByUniqueInput?: Maybe<TokenDayData>;
  tokenDayDataConnection: TokenDayDataConnection;
  tokens: Array<Token>;
  tokensConnection: TokensConnection;
  transactionById?: Maybe<Transaction>;
  /** @deprecated Use transactionById */
  transactionByUniqueInput?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  transactionsConnection: TransactionsConnection;
  userById?: Maybe<User>;
  /** @deprecated Use userById */
  userByUniqueInput?: Maybe<User>;
  users: Array<User>;
  usersConnection: UsersConnection;
  zenlinkDayInfoById?: Maybe<ZenlinkDayInfo>;
  /** @deprecated Use zenlinkDayInfoById */
  zenlinkDayInfoByUniqueInput?: Maybe<ZenlinkDayInfo>;
  zenlinkDayInfos: Array<ZenlinkDayInfo>;
  zenlinkDayInfosConnection: ZenlinkDayInfosConnection;
  zenlinkInfoById?: Maybe<ZenlinkInfo>;
  /** @deprecated Use zenlinkInfoById */
  zenlinkInfoByUniqueInput?: Maybe<ZenlinkInfo>;
  zenlinkInfos: Array<ZenlinkInfo>;
  zenlinkInfosConnection: ZenlinkInfosConnection;
};


export type QueryBlockByIdArgs = {
  id: Scalars['String'];
};


export type QueryBlockByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryBlocksArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<BlockOrderByInput>>;
  where?: InputMaybe<BlockWhereInput>;
};


export type QueryBlocksConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<BlockOrderByInput>;
  where?: InputMaybe<BlockWhereInput>;
};


export type QueryBundleByIdArgs = {
  id: Scalars['String'];
};


export type QueryBundleByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryBundlesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<BundleOrderByInput>>;
  where?: InputMaybe<BundleWhereInput>;
};


export type QueryBundlesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<BundleOrderByInput>;
  where?: InputMaybe<BundleWhereInput>;
};


export type QueryBurnByIdArgs = {
  id: Scalars['String'];
};


export type QueryBurnByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryBurnsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<BurnOrderByInput>>;
  where?: InputMaybe<BurnWhereInput>;
};


export type QueryBurnsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<BurnOrderByInput>;
  where?: InputMaybe<BurnWhereInput>;
};


export type QueryCallByIdArgs = {
  id: Scalars['String'];
};


export type QueryCallByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryCallsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CallOrderByInput>>;
  where?: InputMaybe<CallWhereInput>;
};


export type QueryCallsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<CallOrderByInput>;
  where?: InputMaybe<CallWhereInput>;
};


export type QueryEventByIdArgs = {
  id: Scalars['String'];
};


export type QueryEventByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EventOrderByInput>>;
  where?: InputMaybe<EventWhereInput>;
};


export type QueryEventsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<EventOrderByInput>;
  where?: InputMaybe<EventWhereInput>;
};


export type QueryExtrinsicByIdArgs = {
  id: Scalars['String'];
};


export type QueryExtrinsicByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryExtrinsicsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ExtrinsicOrderByInput>>;
  where?: InputMaybe<ExtrinsicWhereInput>;
};


export type QueryExtrinsicsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<ExtrinsicOrderByInput>;
  where?: InputMaybe<ExtrinsicWhereInput>;
};


export type QueryFactoriesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FactoryOrderByInput>>;
  where?: InputMaybe<FactoryWhereInput>;
};


export type QueryFactoriesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<FactoryOrderByInput>;
  where?: InputMaybe<FactoryWhereInput>;
};


export type QueryFactoryByIdArgs = {
  id: Scalars['String'];
};


export type QueryFactoryByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryFactoryDayDataArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FactoryDayDataOrderByInput>>;
  where?: InputMaybe<FactoryDayDataWhereInput>;
};


export type QueryFactoryDayDataByIdArgs = {
  id: Scalars['String'];
};


export type QueryFactoryDayDataByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryFactoryDayDataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<FactoryDayDataOrderByInput>;
  where?: InputMaybe<FactoryDayDataWhereInput>;
};


export type QueryLiquidityPositionByIdArgs = {
  id: Scalars['String'];
};


export type QueryLiquidityPositionByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryLiquidityPositionSnapshotByIdArgs = {
  id: Scalars['String'];
};


export type QueryLiquidityPositionSnapshotByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryLiquidityPositionSnapshotsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<LiquidityPositionSnapshotOrderByInput>>;
  where?: InputMaybe<LiquidityPositionSnapshotWhereInput>;
};


export type QueryLiquidityPositionSnapshotsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<LiquidityPositionSnapshotOrderByInput>;
  where?: InputMaybe<LiquidityPositionSnapshotWhereInput>;
};


export type QueryLiquidityPositionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<LiquidityPositionOrderByInput>>;
  where?: InputMaybe<LiquidityPositionWhereInput>;
};


export type QueryLiquidityPositionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<LiquidityPositionOrderByInput>;
  where?: InputMaybe<LiquidityPositionWhereInput>;
};


export type QueryMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MetadataOrderByInput>>;
  where?: InputMaybe<MetadataWhereInput>;
};


export type QueryMetadataByIdArgs = {
  id: Scalars['String'];
};


export type QueryMetadataByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryMetadataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<MetadataOrderByInput>;
  where?: InputMaybe<MetadataWhereInput>;
};


export type QueryMintByIdArgs = {
  id: Scalars['String'];
};


export type QueryMintByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryMintsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MintOrderByInput>>;
  where?: InputMaybe<MintWhereInput>;
};


export type QueryMintsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<MintOrderByInput>;
  where?: InputMaybe<MintWhereInput>;
};


export type QueryPairByIdArgs = {
  id: Scalars['String'];
};


export type QueryPairByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryPairDayDataArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PairDayDataOrderByInput>>;
  where?: InputMaybe<PairDayDataWhereInput>;
};


export type QueryPairDayDataByIdArgs = {
  id: Scalars['String'];
};


export type QueryPairDayDataByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryPairDayDataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<PairDayDataOrderByInput>;
  where?: InputMaybe<PairDayDataWhereInput>;
};


export type QueryPairHourDataArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PairHourDataOrderByInput>>;
  where?: InputMaybe<PairHourDataWhereInput>;
};


export type QueryPairHourDataByIdArgs = {
  id: Scalars['String'];
};


export type QueryPairHourDataByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryPairHourDataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<PairHourDataOrderByInput>;
  where?: InputMaybe<PairHourDataWhereInput>;
};


export type QueryPairsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PairOrderByInput>>;
  where?: InputMaybe<PairWhereInput>;
};


export type QueryPairsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<PairOrderByInput>;
  where?: InputMaybe<PairWhereInput>;
};


export type QueryStableDayDataArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableDayDataOrderByInput>>;
  where?: InputMaybe<StableDayDataWhereInput>;
};


export type QueryStableDayDataByIdArgs = {
  id: Scalars['String'];
};


export type QueryStableDayDataByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryStableDayDataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<StableDayDataOrderByInput>;
  where?: InputMaybe<StableDayDataWhereInput>;
};


export type QueryStableSwapByIdArgs = {
  id: Scalars['String'];
};


export type QueryStableSwapByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryStableSwapDayDataArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableSwapDayDataOrderByInput>>;
  where?: InputMaybe<StableSwapDayDataWhereInput>;
};


export type QueryStableSwapDayDataByIdArgs = {
  id: Scalars['String'];
};


export type QueryStableSwapDayDataByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryStableSwapDayDataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<StableSwapDayDataOrderByInput>;
  where?: InputMaybe<StableSwapDayDataWhereInput>;
};


export type QueryStableSwapEventByIdArgs = {
  id: Scalars['String'];
};


export type QueryStableSwapEventByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryStableSwapEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableSwapEventOrderByInput>>;
  where?: InputMaybe<StableSwapEventWhereInput>;
};


export type QueryStableSwapEventsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<StableSwapEventOrderByInput>;
  where?: InputMaybe<StableSwapEventWhereInput>;
};


export type QueryStableSwapExchangeByIdArgs = {
  id: Scalars['String'];
};


export type QueryStableSwapExchangeByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryStableSwapExchangesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableSwapExchangeOrderByInput>>;
  where?: InputMaybe<StableSwapExchangeWhereInput>;
};


export type QueryStableSwapExchangesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<StableSwapExchangeOrderByInput>;
  where?: InputMaybe<StableSwapExchangeWhereInput>;
};


export type QueryStableSwapHourDataArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableSwapHourDataOrderByInput>>;
  where?: InputMaybe<StableSwapHourDataWhereInput>;
};


export type QueryStableSwapHourDataByIdArgs = {
  id: Scalars['String'];
};


export type QueryStableSwapHourDataByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryStableSwapHourDataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<StableSwapHourDataOrderByInput>;
  where?: InputMaybe<StableSwapHourDataWhereInput>;
};


export type QueryStableSwapInfoByIdArgs = {
  id: Scalars['String'];
};


export type QueryStableSwapInfoByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryStableSwapInfosArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableSwapInfoOrderByInput>>;
  where?: InputMaybe<StableSwapInfoWhereInput>;
};


export type QueryStableSwapInfosConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<StableSwapInfoOrderByInput>;
  where?: InputMaybe<StableSwapInfoWhereInput>;
};


export type QueryStableSwapLiquidityPositionByIdArgs = {
  id: Scalars['String'];
};


export type QueryStableSwapLiquidityPositionByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryStableSwapLiquidityPositionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableSwapLiquidityPositionOrderByInput>>;
  where?: InputMaybe<StableSwapLiquidityPositionWhereInput>;
};


export type QueryStableSwapLiquidityPositionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<StableSwapLiquidityPositionOrderByInput>;
  where?: InputMaybe<StableSwapLiquidityPositionWhereInput>;
};


export type QueryStableSwapsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableSwapOrderByInput>>;
  where?: InputMaybe<StableSwapWhereInput>;
};


export type QueryStableSwapsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<StableSwapOrderByInput>;
  where?: InputMaybe<StableSwapWhereInput>;
};


export type QuerySwapByIdArgs = {
  id: Scalars['String'];
};


export type QuerySwapByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QuerySwapsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SwapOrderByInput>>;
  where?: InputMaybe<SwapWhereInput>;
};


export type QuerySwapsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<SwapOrderByInput>;
  where?: InputMaybe<SwapWhereInput>;
};


export type QueryTokenByIdArgs = {
  id: Scalars['String'];
};


export type QueryTokenByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryTokenDayDataArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TokenDayDataOrderByInput>>;
  where?: InputMaybe<TokenDayDataWhereInput>;
};


export type QueryTokenDayDataByIdArgs = {
  id: Scalars['String'];
};


export type QueryTokenDayDataByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryTokenDayDataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<TokenDayDataOrderByInput>;
  where?: InputMaybe<TokenDayDataWhereInput>;
};


export type QueryTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TokenOrderByInput>>;
  where?: InputMaybe<TokenWhereInput>;
};


export type QueryTokensConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<TokenOrderByInput>;
  where?: InputMaybe<TokenWhereInput>;
};


export type QueryTransactionByIdArgs = {
  id: Scalars['String'];
};


export type QueryTransactionByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TransactionOrderByInput>>;
  where?: InputMaybe<TransactionWhereInput>;
};


export type QueryTransactionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<TransactionOrderByInput>;
  where?: InputMaybe<TransactionWhereInput>;
};


export type QueryUserByIdArgs = {
  id: Scalars['String'];
};


export type QueryUserByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<UserOrderByInput>>;
  where?: InputMaybe<UserWhereInput>;
};


export type QueryUsersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<UserOrderByInput>;
  where?: InputMaybe<UserWhereInput>;
};


export type QueryZenlinkDayInfoByIdArgs = {
  id: Scalars['String'];
};


export type QueryZenlinkDayInfoByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryZenlinkDayInfosArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ZenlinkDayInfoOrderByInput>>;
  where?: InputMaybe<ZenlinkDayInfoWhereInput>;
};


export type QueryZenlinkDayInfosConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<ZenlinkDayInfoOrderByInput>;
  where?: InputMaybe<ZenlinkDayInfoWhereInput>;
};


export type QueryZenlinkInfoByIdArgs = {
  id: Scalars['String'];
};


export type QueryZenlinkInfoByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryZenlinkInfosArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ZenlinkInfoOrderByInput>>;
  where?: InputMaybe<ZenlinkInfoWhereInput>;
};


export type QueryZenlinkInfosConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<ZenlinkInfoOrderByInput>;
  where?: InputMaybe<ZenlinkInfoWhereInput>;
};

export type SquidStatus = {
  __typename?: 'SquidStatus';
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']>;
};

export type StableDayData = {
  __typename?: 'StableDayData';
  dailyVolumeUSD: Scalars['String'];
  date: Scalars['DateTime'];
  id: Scalars['String'];
  tvlUSD: Scalars['String'];
};

export type StableDayDataConnection = {
  __typename?: 'StableDayDataConnection';
  edges: Array<StableDayDataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type StableDayDataEdge = {
  __typename?: 'StableDayDataEdge';
  cursor: Scalars['String'];
  node: StableDayData;
};

export enum StableDayDataOrderByInput {
  DailyVolumeUsdAsc = 'dailyVolumeUSD_ASC',
  DailyVolumeUsdDesc = 'dailyVolumeUSD_DESC',
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TvlUsdAsc = 'tvlUSD_ASC',
  TvlUsdDesc = 'tvlUSD_DESC'
}

export type StableDayDataWhereInput = {
  AND?: InputMaybe<Array<StableDayDataWhereInput>>;
  OR?: InputMaybe<Array<StableDayDataWhereInput>>;
  dailyVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  dailyVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
  date_eq?: InputMaybe<Scalars['DateTime']>;
  date_gt?: InputMaybe<Scalars['DateTime']>;
  date_gte?: InputMaybe<Scalars['DateTime']>;
  date_in?: InputMaybe<Array<Scalars['DateTime']>>;
  date_isNull?: InputMaybe<Scalars['Boolean']>;
  date_lt?: InputMaybe<Scalars['DateTime']>;
  date_lte?: InputMaybe<Scalars['DateTime']>;
  date_not_eq?: InputMaybe<Scalars['DateTime']>;
  date_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_contains?: InputMaybe<Scalars['String']>;
  tvlUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  tvlUSD_endsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_eq?: InputMaybe<Scalars['String']>;
  tvlUSD_gt?: InputMaybe<Scalars['String']>;
  tvlUSD_gte?: InputMaybe<Scalars['String']>;
  tvlUSD_in?: InputMaybe<Array<Scalars['String']>>;
  tvlUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  tvlUSD_lt?: InputMaybe<Scalars['String']>;
  tvlUSD_lte?: InputMaybe<Scalars['String']>;
  tvlUSD_not_contains?: InputMaybe<Scalars['String']>;
  tvlUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  tvlUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_not_eq?: InputMaybe<Scalars['String']>;
  tvlUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  tvlUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_startsWith?: InputMaybe<Scalars['String']>;
};

export type StableSwap = {
  __typename?: 'StableSwap';
  a: Scalars['BigInt'];
  address: Scalars['String'];
  adminFee: Scalars['BigInt'];
  allTokens: Array<Scalars['String']>;
  balances: Array<Scalars['BigInt']>;
  baseSwapAddress: Scalars['String'];
  baseTokens: Array<Scalars['String']>;
  events: Array<StableSwapEvent>;
  exchanges: Array<StableSwapExchange>;
  id: Scalars['String'];
  lpToken: Scalars['String'];
  lpTotalSupply: Scalars['String'];
  numTokens: Scalars['Int'];
  stableSwapDayData: Array<StableSwapDayData>;
  stableSwapHourData: Array<StableSwapHourData>;
  stableSwapInfo: StableSwapInfo;
  swapFee: Scalars['BigInt'];
  tokens: Array<Scalars['String']>;
  /** BigDecimal */
  tvlUSD: Scalars['String'];
  virtualPrice: Scalars['BigInt'];
  /** BigDecimal */
  volumeUSD: Scalars['String'];
};


export type StableSwapEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableSwapEventOrderByInput>>;
  where?: InputMaybe<StableSwapEventWhereInput>;
};


export type StableSwapExchangesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableSwapExchangeOrderByInput>>;
  where?: InputMaybe<StableSwapExchangeWhereInput>;
};


export type StableSwapStableSwapDayDataArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableSwapDayDataOrderByInput>>;
  where?: InputMaybe<StableSwapDayDataWhereInput>;
};


export type StableSwapStableSwapHourDataArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableSwapHourDataOrderByInput>>;
  where?: InputMaybe<StableSwapHourDataWhereInput>;
};

export type StableSwapAddLiquidityEventData = {
  __typename?: 'StableSwapAddLiquidityEventData';
  fees: Array<Scalars['BigInt']>;
  invariant?: Maybe<Scalars['BigInt']>;
  lpTokenSupply: Scalars['BigInt'];
  provider: Scalars['Bytes'];
  tokenAmounts: Array<Scalars['BigInt']>;
};

export type StableSwapDayData = {
  __typename?: 'StableSwapDayData';
  dailyVolumeUSD: Scalars['String'];
  date: Scalars['DateTime'];
  id: Scalars['String'];
  stableSwap: StableSwap;
  tvlUSD: Scalars['String'];
};

export type StableSwapDayDataConnection = {
  __typename?: 'StableSwapDayDataConnection';
  edges: Array<StableSwapDayDataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type StableSwapDayDataEdge = {
  __typename?: 'StableSwapDayDataEdge';
  cursor: Scalars['String'];
  node: StableSwapDayData;
};

export enum StableSwapDayDataOrderByInput {
  DailyVolumeUsdAsc = 'dailyVolumeUSD_ASC',
  DailyVolumeUsdDesc = 'dailyVolumeUSD_DESC',
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  StableSwapAAsc = 'stableSwap_a_ASC',
  StableSwapADesc = 'stableSwap_a_DESC',
  StableSwapAddressAsc = 'stableSwap_address_ASC',
  StableSwapAddressDesc = 'stableSwap_address_DESC',
  StableSwapAdminFeeAsc = 'stableSwap_adminFee_ASC',
  StableSwapAdminFeeDesc = 'stableSwap_adminFee_DESC',
  StableSwapBaseSwapAddressAsc = 'stableSwap_baseSwapAddress_ASC',
  StableSwapBaseSwapAddressDesc = 'stableSwap_baseSwapAddress_DESC',
  StableSwapIdAsc = 'stableSwap_id_ASC',
  StableSwapIdDesc = 'stableSwap_id_DESC',
  StableSwapLpTokenAsc = 'stableSwap_lpToken_ASC',
  StableSwapLpTokenDesc = 'stableSwap_lpToken_DESC',
  StableSwapLpTotalSupplyAsc = 'stableSwap_lpTotalSupply_ASC',
  StableSwapLpTotalSupplyDesc = 'stableSwap_lpTotalSupply_DESC',
  StableSwapNumTokensAsc = 'stableSwap_numTokens_ASC',
  StableSwapNumTokensDesc = 'stableSwap_numTokens_DESC',
  StableSwapSwapFeeAsc = 'stableSwap_swapFee_ASC',
  StableSwapSwapFeeDesc = 'stableSwap_swapFee_DESC',
  StableSwapTvlUsdAsc = 'stableSwap_tvlUSD_ASC',
  StableSwapTvlUsdDesc = 'stableSwap_tvlUSD_DESC',
  StableSwapVirtualPriceAsc = 'stableSwap_virtualPrice_ASC',
  StableSwapVirtualPriceDesc = 'stableSwap_virtualPrice_DESC',
  StableSwapVolumeUsdAsc = 'stableSwap_volumeUSD_ASC',
  StableSwapVolumeUsdDesc = 'stableSwap_volumeUSD_DESC',
  TvlUsdAsc = 'tvlUSD_ASC',
  TvlUsdDesc = 'tvlUSD_DESC'
}

export type StableSwapDayDataWhereInput = {
  AND?: InputMaybe<Array<StableSwapDayDataWhereInput>>;
  OR?: InputMaybe<Array<StableSwapDayDataWhereInput>>;
  dailyVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  dailyVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
  date_eq?: InputMaybe<Scalars['DateTime']>;
  date_gt?: InputMaybe<Scalars['DateTime']>;
  date_gte?: InputMaybe<Scalars['DateTime']>;
  date_in?: InputMaybe<Array<Scalars['DateTime']>>;
  date_isNull?: InputMaybe<Scalars['Boolean']>;
  date_lt?: InputMaybe<Scalars['DateTime']>;
  date_lte?: InputMaybe<Scalars['DateTime']>;
  date_not_eq?: InputMaybe<Scalars['DateTime']>;
  date_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  stableSwap?: InputMaybe<StableSwapWhereInput>;
  stableSwap_isNull?: InputMaybe<Scalars['Boolean']>;
  tvlUSD_contains?: InputMaybe<Scalars['String']>;
  tvlUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  tvlUSD_endsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_eq?: InputMaybe<Scalars['String']>;
  tvlUSD_gt?: InputMaybe<Scalars['String']>;
  tvlUSD_gte?: InputMaybe<Scalars['String']>;
  tvlUSD_in?: InputMaybe<Array<Scalars['String']>>;
  tvlUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  tvlUSD_lt?: InputMaybe<Scalars['String']>;
  tvlUSD_lte?: InputMaybe<Scalars['String']>;
  tvlUSD_not_contains?: InputMaybe<Scalars['String']>;
  tvlUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  tvlUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_not_eq?: InputMaybe<Scalars['String']>;
  tvlUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  tvlUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_startsWith?: InputMaybe<Scalars['String']>;
};

export type StableSwapEdge = {
  __typename?: 'StableSwapEdge';
  cursor: Scalars['String'];
  node: StableSwap;
};

export type StableSwapEvent = {
  __typename?: 'StableSwapEvent';
  block: Scalars['BigInt'];
  data?: Maybe<StableSwapEventData>;
  id: Scalars['String'];
  stableSwap: StableSwap;
  timestamp: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
};

export type StableSwapEventData = StableSwapAddLiquidityEventData | StableSwapFlashLoanEventData | StableSwapNewFeeEventData | StableSwapRampAEventData | StableSwapRemoveLiquidityEventData | StableSwapStopRampAEventData;

export type StableSwapEventDataWhereInput = {
  adminFee_eq?: InputMaybe<Scalars['BigInt']>;
  adminFee_gt?: InputMaybe<Scalars['BigInt']>;
  adminFee_gte?: InputMaybe<Scalars['BigInt']>;
  adminFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  adminFee_isNull?: InputMaybe<Scalars['Boolean']>;
  adminFee_lt?: InputMaybe<Scalars['BigInt']>;
  adminFee_lte?: InputMaybe<Scalars['BigInt']>;
  adminFee_not_eq?: InputMaybe<Scalars['BigInt']>;
  adminFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountsOut_containsAll?: InputMaybe<Array<Scalars['BigInt']>>;
  amountsOut_containsAny?: InputMaybe<Array<Scalars['BigInt']>>;
  amountsOut_containsNone?: InputMaybe<Array<Scalars['BigInt']>>;
  amountsOut_isNull?: InputMaybe<Scalars['Boolean']>;
  caller_eq?: InputMaybe<Scalars['Bytes']>;
  caller_isNull?: InputMaybe<Scalars['Boolean']>;
  caller_not_eq?: InputMaybe<Scalars['Bytes']>;
  currentA_eq?: InputMaybe<Scalars['BigInt']>;
  currentA_gt?: InputMaybe<Scalars['BigInt']>;
  currentA_gte?: InputMaybe<Scalars['BigInt']>;
  currentA_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentA_isNull?: InputMaybe<Scalars['Boolean']>;
  currentA_lt?: InputMaybe<Scalars['BigInt']>;
  currentA_lte?: InputMaybe<Scalars['BigInt']>;
  currentA_not_eq?: InputMaybe<Scalars['BigInt']>;
  currentA_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fees_containsAll?: InputMaybe<Array<Scalars['BigInt']>>;
  fees_containsAny?: InputMaybe<Array<Scalars['BigInt']>>;
  fees_containsNone?: InputMaybe<Array<Scalars['BigInt']>>;
  fees_isNull?: InputMaybe<Scalars['Boolean']>;
  futureTime_eq?: InputMaybe<Scalars['BigInt']>;
  futureTime_gt?: InputMaybe<Scalars['BigInt']>;
  futureTime_gte?: InputMaybe<Scalars['BigInt']>;
  futureTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  futureTime_isNull?: InputMaybe<Scalars['Boolean']>;
  futureTime_lt?: InputMaybe<Scalars['BigInt']>;
  futureTime_lte?: InputMaybe<Scalars['BigInt']>;
  futureTime_not_eq?: InputMaybe<Scalars['BigInt']>;
  futureTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initialTime_eq?: InputMaybe<Scalars['BigInt']>;
  initialTime_gt?: InputMaybe<Scalars['BigInt']>;
  initialTime_gte?: InputMaybe<Scalars['BigInt']>;
  initialTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initialTime_isNull?: InputMaybe<Scalars['Boolean']>;
  initialTime_lt?: InputMaybe<Scalars['BigInt']>;
  initialTime_lte?: InputMaybe<Scalars['BigInt']>;
  initialTime_not_eq?: InputMaybe<Scalars['BigInt']>;
  initialTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  invariant_eq?: InputMaybe<Scalars['BigInt']>;
  invariant_gt?: InputMaybe<Scalars['BigInt']>;
  invariant_gte?: InputMaybe<Scalars['BigInt']>;
  invariant_in?: InputMaybe<Array<Scalars['BigInt']>>;
  invariant_isNull?: InputMaybe<Scalars['Boolean']>;
  invariant_lt?: InputMaybe<Scalars['BigInt']>;
  invariant_lte?: InputMaybe<Scalars['BigInt']>;
  invariant_not_eq?: InputMaybe<Scalars['BigInt']>;
  invariant_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  isTypeOf_contains?: InputMaybe<Scalars['String']>;
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>;
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>;
  isTypeOf_eq?: InputMaybe<Scalars['String']>;
  isTypeOf_gt?: InputMaybe<Scalars['String']>;
  isTypeOf_gte?: InputMaybe<Scalars['String']>;
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>;
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>;
  isTypeOf_lt?: InputMaybe<Scalars['String']>;
  isTypeOf_lte?: InputMaybe<Scalars['String']>;
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>;
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>;
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>;
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>;
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>;
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>;
  lpTokenSupply_eq?: InputMaybe<Scalars['BigInt']>;
  lpTokenSupply_gt?: InputMaybe<Scalars['BigInt']>;
  lpTokenSupply_gte?: InputMaybe<Scalars['BigInt']>;
  lpTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lpTokenSupply_isNull?: InputMaybe<Scalars['Boolean']>;
  lpTokenSupply_lt?: InputMaybe<Scalars['BigInt']>;
  lpTokenSupply_lte?: InputMaybe<Scalars['BigInt']>;
  lpTokenSupply_not_eq?: InputMaybe<Scalars['BigInt']>;
  lpTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newA_eq?: InputMaybe<Scalars['BigInt']>;
  newA_gt?: InputMaybe<Scalars['BigInt']>;
  newA_gte?: InputMaybe<Scalars['BigInt']>;
  newA_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newA_isNull?: InputMaybe<Scalars['Boolean']>;
  newA_lt?: InputMaybe<Scalars['BigInt']>;
  newA_lte?: InputMaybe<Scalars['BigInt']>;
  newA_not_eq?: InputMaybe<Scalars['BigInt']>;
  newA_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oldA_eq?: InputMaybe<Scalars['BigInt']>;
  oldA_gt?: InputMaybe<Scalars['BigInt']>;
  oldA_gte?: InputMaybe<Scalars['BigInt']>;
  oldA_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oldA_isNull?: InputMaybe<Scalars['Boolean']>;
  oldA_lt?: InputMaybe<Scalars['BigInt']>;
  oldA_lte?: InputMaybe<Scalars['BigInt']>;
  oldA_not_eq?: InputMaybe<Scalars['BigInt']>;
  oldA_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  provider_eq?: InputMaybe<Scalars['Bytes']>;
  provider_isNull?: InputMaybe<Scalars['Boolean']>;
  provider_not_eq?: InputMaybe<Scalars['Bytes']>;
  receiver_eq?: InputMaybe<Scalars['Bytes']>;
  receiver_isNull?: InputMaybe<Scalars['Boolean']>;
  receiver_not_eq?: InputMaybe<Scalars['Bytes']>;
  swapFee_eq?: InputMaybe<Scalars['BigInt']>;
  swapFee_gt?: InputMaybe<Scalars['BigInt']>;
  swapFee_gte?: InputMaybe<Scalars['BigInt']>;
  swapFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  swapFee_isNull?: InputMaybe<Scalars['Boolean']>;
  swapFee_lt?: InputMaybe<Scalars['BigInt']>;
  swapFee_lte?: InputMaybe<Scalars['BigInt']>;
  swapFee_not_eq?: InputMaybe<Scalars['BigInt']>;
  swapFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  time_eq?: InputMaybe<Scalars['BigInt']>;
  time_gt?: InputMaybe<Scalars['BigInt']>;
  time_gte?: InputMaybe<Scalars['BigInt']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']>>;
  time_isNull?: InputMaybe<Scalars['Boolean']>;
  time_lt?: InputMaybe<Scalars['BigInt']>;
  time_lte?: InputMaybe<Scalars['BigInt']>;
  time_not_eq?: InputMaybe<Scalars['BigInt']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenAmounts_containsAll?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenAmounts_containsAny?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenAmounts_containsNone?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenAmounts_isNull?: InputMaybe<Scalars['Boolean']>;
};

export type StableSwapEventEdge = {
  __typename?: 'StableSwapEventEdge';
  cursor: Scalars['String'];
  node: StableSwapEvent;
};

export enum StableSwapEventOrderByInput {
  BlockAsc = 'block_ASC',
  BlockDesc = 'block_DESC',
  DataAdminFeeAsc = 'data_adminFee_ASC',
  DataAdminFeeDesc = 'data_adminFee_DESC',
  DataCallerAsc = 'data_caller_ASC',
  DataCallerDesc = 'data_caller_DESC',
  DataCurrentAAsc = 'data_currentA_ASC',
  DataCurrentADesc = 'data_currentA_DESC',
  DataFutureTimeAsc = 'data_futureTime_ASC',
  DataFutureTimeDesc = 'data_futureTime_DESC',
  DataInitialTimeAsc = 'data_initialTime_ASC',
  DataInitialTimeDesc = 'data_initialTime_DESC',
  DataInvariantAsc = 'data_invariant_ASC',
  DataInvariantDesc = 'data_invariant_DESC',
  DataIsTypeOfAsc = 'data_isTypeOf_ASC',
  DataIsTypeOfDesc = 'data_isTypeOf_DESC',
  DataLpTokenSupplyAsc = 'data_lpTokenSupply_ASC',
  DataLpTokenSupplyDesc = 'data_lpTokenSupply_DESC',
  DataNewAAsc = 'data_newA_ASC',
  DataNewADesc = 'data_newA_DESC',
  DataOldAAsc = 'data_oldA_ASC',
  DataOldADesc = 'data_oldA_DESC',
  DataProviderAsc = 'data_provider_ASC',
  DataProviderDesc = 'data_provider_DESC',
  DataReceiverAsc = 'data_receiver_ASC',
  DataReceiverDesc = 'data_receiver_DESC',
  DataSwapFeeAsc = 'data_swapFee_ASC',
  DataSwapFeeDesc = 'data_swapFee_DESC',
  DataTimeAsc = 'data_time_ASC',
  DataTimeDesc = 'data_time_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  StableSwapAAsc = 'stableSwap_a_ASC',
  StableSwapADesc = 'stableSwap_a_DESC',
  StableSwapAddressAsc = 'stableSwap_address_ASC',
  StableSwapAddressDesc = 'stableSwap_address_DESC',
  StableSwapAdminFeeAsc = 'stableSwap_adminFee_ASC',
  StableSwapAdminFeeDesc = 'stableSwap_adminFee_DESC',
  StableSwapBaseSwapAddressAsc = 'stableSwap_baseSwapAddress_ASC',
  StableSwapBaseSwapAddressDesc = 'stableSwap_baseSwapAddress_DESC',
  StableSwapIdAsc = 'stableSwap_id_ASC',
  StableSwapIdDesc = 'stableSwap_id_DESC',
  StableSwapLpTokenAsc = 'stableSwap_lpToken_ASC',
  StableSwapLpTokenDesc = 'stableSwap_lpToken_DESC',
  StableSwapLpTotalSupplyAsc = 'stableSwap_lpTotalSupply_ASC',
  StableSwapLpTotalSupplyDesc = 'stableSwap_lpTotalSupply_DESC',
  StableSwapNumTokensAsc = 'stableSwap_numTokens_ASC',
  StableSwapNumTokensDesc = 'stableSwap_numTokens_DESC',
  StableSwapSwapFeeAsc = 'stableSwap_swapFee_ASC',
  StableSwapSwapFeeDesc = 'stableSwap_swapFee_DESC',
  StableSwapTvlUsdAsc = 'stableSwap_tvlUSD_ASC',
  StableSwapTvlUsdDesc = 'stableSwap_tvlUSD_DESC',
  StableSwapVirtualPriceAsc = 'stableSwap_virtualPrice_ASC',
  StableSwapVirtualPriceDesc = 'stableSwap_virtualPrice_DESC',
  StableSwapVolumeUsdAsc = 'stableSwap_volumeUSD_ASC',
  StableSwapVolumeUsdDesc = 'stableSwap_volumeUSD_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  TransactionAsc = 'transaction_ASC',
  TransactionDesc = 'transaction_DESC'
}

export type StableSwapEventWhereInput = {
  AND?: InputMaybe<Array<StableSwapEventWhereInput>>;
  OR?: InputMaybe<Array<StableSwapEventWhereInput>>;
  block_eq?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_isNull?: InputMaybe<Scalars['Boolean']>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_not_eq?: InputMaybe<Scalars['BigInt']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  data?: InputMaybe<StableSwapEventDataWhereInput>;
  data_isNull?: InputMaybe<Scalars['Boolean']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  stableSwap?: InputMaybe<StableSwapWhereInput>;
  stableSwap_isNull?: InputMaybe<Scalars['Boolean']>;
  timestamp_eq?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_eq?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction_eq?: InputMaybe<Scalars['Bytes']>;
  transaction_isNull?: InputMaybe<Scalars['Boolean']>;
  transaction_not_eq?: InputMaybe<Scalars['Bytes']>;
};

export type StableSwapEventsConnection = {
  __typename?: 'StableSwapEventsConnection';
  edges: Array<StableSwapEventEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type StableSwapExchange = {
  __typename?: 'StableSwapExchange';
  block: Scalars['BigInt'];
  data?: Maybe<StableSwapExchangeData>;
  id: Scalars['String'];
  stableSwap: StableSwap;
  timestamp: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
};

export type StableSwapExchangeData = StableSwapTokenExchangeData | StableSwapTokenExchangeUnderlyingData;

export type StableSwapExchangeDataWhereInput = {
  boughtId_eq?: InputMaybe<Scalars['BigInt']>;
  boughtId_gt?: InputMaybe<Scalars['BigInt']>;
  boughtId_gte?: InputMaybe<Scalars['BigInt']>;
  boughtId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  boughtId_isNull?: InputMaybe<Scalars['Boolean']>;
  boughtId_lt?: InputMaybe<Scalars['BigInt']>;
  boughtId_lte?: InputMaybe<Scalars['BigInt']>;
  boughtId_not_eq?: InputMaybe<Scalars['BigInt']>;
  boughtId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  buyer_eq?: InputMaybe<Scalars['Bytes']>;
  buyer_isNull?: InputMaybe<Scalars['Boolean']>;
  buyer_not_eq?: InputMaybe<Scalars['Bytes']>;
  isTypeOf_contains?: InputMaybe<Scalars['String']>;
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>;
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>;
  isTypeOf_eq?: InputMaybe<Scalars['String']>;
  isTypeOf_gt?: InputMaybe<Scalars['String']>;
  isTypeOf_gte?: InputMaybe<Scalars['String']>;
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>;
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>;
  isTypeOf_lt?: InputMaybe<Scalars['String']>;
  isTypeOf_lte?: InputMaybe<Scalars['String']>;
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>;
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>;
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>;
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>;
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>;
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>;
  soldId_eq?: InputMaybe<Scalars['BigInt']>;
  soldId_gt?: InputMaybe<Scalars['BigInt']>;
  soldId_gte?: InputMaybe<Scalars['BigInt']>;
  soldId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  soldId_isNull?: InputMaybe<Scalars['Boolean']>;
  soldId_lt?: InputMaybe<Scalars['BigInt']>;
  soldId_lte?: InputMaybe<Scalars['BigInt']>;
  soldId_not_eq?: InputMaybe<Scalars['BigInt']>;
  soldId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokensBought_eq?: InputMaybe<Scalars['BigInt']>;
  tokensBought_gt?: InputMaybe<Scalars['BigInt']>;
  tokensBought_gte?: InputMaybe<Scalars['BigInt']>;
  tokensBought_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokensBought_isNull?: InputMaybe<Scalars['Boolean']>;
  tokensBought_lt?: InputMaybe<Scalars['BigInt']>;
  tokensBought_lte?: InputMaybe<Scalars['BigInt']>;
  tokensBought_not_eq?: InputMaybe<Scalars['BigInt']>;
  tokensBought_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokensSold_eq?: InputMaybe<Scalars['BigInt']>;
  tokensSold_gt?: InputMaybe<Scalars['BigInt']>;
  tokensSold_gte?: InputMaybe<Scalars['BigInt']>;
  tokensSold_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokensSold_isNull?: InputMaybe<Scalars['Boolean']>;
  tokensSold_lt?: InputMaybe<Scalars['BigInt']>;
  tokensSold_lte?: InputMaybe<Scalars['BigInt']>;
  tokensSold_not_eq?: InputMaybe<Scalars['BigInt']>;
  tokensSold_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type StableSwapExchangeEdge = {
  __typename?: 'StableSwapExchangeEdge';
  cursor: Scalars['String'];
  node: StableSwapExchange;
};

export enum StableSwapExchangeOrderByInput {
  BlockAsc = 'block_ASC',
  BlockDesc = 'block_DESC',
  DataBoughtIdAsc = 'data_boughtId_ASC',
  DataBoughtIdDesc = 'data_boughtId_DESC',
  DataBuyerAsc = 'data_buyer_ASC',
  DataBuyerDesc = 'data_buyer_DESC',
  DataIsTypeOfAsc = 'data_isTypeOf_ASC',
  DataIsTypeOfDesc = 'data_isTypeOf_DESC',
  DataSoldIdAsc = 'data_soldId_ASC',
  DataSoldIdDesc = 'data_soldId_DESC',
  DataTokensBoughtAsc = 'data_tokensBought_ASC',
  DataTokensBoughtDesc = 'data_tokensBought_DESC',
  DataTokensSoldAsc = 'data_tokensSold_ASC',
  DataTokensSoldDesc = 'data_tokensSold_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  StableSwapAAsc = 'stableSwap_a_ASC',
  StableSwapADesc = 'stableSwap_a_DESC',
  StableSwapAddressAsc = 'stableSwap_address_ASC',
  StableSwapAddressDesc = 'stableSwap_address_DESC',
  StableSwapAdminFeeAsc = 'stableSwap_adminFee_ASC',
  StableSwapAdminFeeDesc = 'stableSwap_adminFee_DESC',
  StableSwapBaseSwapAddressAsc = 'stableSwap_baseSwapAddress_ASC',
  StableSwapBaseSwapAddressDesc = 'stableSwap_baseSwapAddress_DESC',
  StableSwapIdAsc = 'stableSwap_id_ASC',
  StableSwapIdDesc = 'stableSwap_id_DESC',
  StableSwapLpTokenAsc = 'stableSwap_lpToken_ASC',
  StableSwapLpTokenDesc = 'stableSwap_lpToken_DESC',
  StableSwapLpTotalSupplyAsc = 'stableSwap_lpTotalSupply_ASC',
  StableSwapLpTotalSupplyDesc = 'stableSwap_lpTotalSupply_DESC',
  StableSwapNumTokensAsc = 'stableSwap_numTokens_ASC',
  StableSwapNumTokensDesc = 'stableSwap_numTokens_DESC',
  StableSwapSwapFeeAsc = 'stableSwap_swapFee_ASC',
  StableSwapSwapFeeDesc = 'stableSwap_swapFee_DESC',
  StableSwapTvlUsdAsc = 'stableSwap_tvlUSD_ASC',
  StableSwapTvlUsdDesc = 'stableSwap_tvlUSD_DESC',
  StableSwapVirtualPriceAsc = 'stableSwap_virtualPrice_ASC',
  StableSwapVirtualPriceDesc = 'stableSwap_virtualPrice_DESC',
  StableSwapVolumeUsdAsc = 'stableSwap_volumeUSD_ASC',
  StableSwapVolumeUsdDesc = 'stableSwap_volumeUSD_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  TransactionAsc = 'transaction_ASC',
  TransactionDesc = 'transaction_DESC'
}

export type StableSwapExchangeWhereInput = {
  AND?: InputMaybe<Array<StableSwapExchangeWhereInput>>;
  OR?: InputMaybe<Array<StableSwapExchangeWhereInput>>;
  block_eq?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_isNull?: InputMaybe<Scalars['Boolean']>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_not_eq?: InputMaybe<Scalars['BigInt']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  data?: InputMaybe<StableSwapExchangeDataWhereInput>;
  data_isNull?: InputMaybe<Scalars['Boolean']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  stableSwap?: InputMaybe<StableSwapWhereInput>;
  stableSwap_isNull?: InputMaybe<Scalars['Boolean']>;
  timestamp_eq?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_eq?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction_eq?: InputMaybe<Scalars['Bytes']>;
  transaction_isNull?: InputMaybe<Scalars['Boolean']>;
  transaction_not_eq?: InputMaybe<Scalars['Bytes']>;
};

export type StableSwapExchangesConnection = {
  __typename?: 'StableSwapExchangesConnection';
  edges: Array<StableSwapExchangeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type StableSwapFlashLoanEventData = {
  __typename?: 'StableSwapFlashLoanEventData';
  amountsOut: Array<Scalars['BigInt']>;
  caller: Scalars['Bytes'];
  receiver: Scalars['Bytes'];
};

export type StableSwapHourData = {
  __typename?: 'StableSwapHourData';
  hourStartUnix: Scalars['BigInt'];
  hourlyVolumeUSD: Scalars['String'];
  id: Scalars['String'];
  stableSwap: StableSwap;
  tvlUSD: Scalars['String'];
};

export type StableSwapHourDataConnection = {
  __typename?: 'StableSwapHourDataConnection';
  edges: Array<StableSwapHourDataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type StableSwapHourDataEdge = {
  __typename?: 'StableSwapHourDataEdge';
  cursor: Scalars['String'];
  node: StableSwapHourData;
};

export enum StableSwapHourDataOrderByInput {
  HourStartUnixAsc = 'hourStartUnix_ASC',
  HourStartUnixDesc = 'hourStartUnix_DESC',
  HourlyVolumeUsdAsc = 'hourlyVolumeUSD_ASC',
  HourlyVolumeUsdDesc = 'hourlyVolumeUSD_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  StableSwapAAsc = 'stableSwap_a_ASC',
  StableSwapADesc = 'stableSwap_a_DESC',
  StableSwapAddressAsc = 'stableSwap_address_ASC',
  StableSwapAddressDesc = 'stableSwap_address_DESC',
  StableSwapAdminFeeAsc = 'stableSwap_adminFee_ASC',
  StableSwapAdminFeeDesc = 'stableSwap_adminFee_DESC',
  StableSwapBaseSwapAddressAsc = 'stableSwap_baseSwapAddress_ASC',
  StableSwapBaseSwapAddressDesc = 'stableSwap_baseSwapAddress_DESC',
  StableSwapIdAsc = 'stableSwap_id_ASC',
  StableSwapIdDesc = 'stableSwap_id_DESC',
  StableSwapLpTokenAsc = 'stableSwap_lpToken_ASC',
  StableSwapLpTokenDesc = 'stableSwap_lpToken_DESC',
  StableSwapLpTotalSupplyAsc = 'stableSwap_lpTotalSupply_ASC',
  StableSwapLpTotalSupplyDesc = 'stableSwap_lpTotalSupply_DESC',
  StableSwapNumTokensAsc = 'stableSwap_numTokens_ASC',
  StableSwapNumTokensDesc = 'stableSwap_numTokens_DESC',
  StableSwapSwapFeeAsc = 'stableSwap_swapFee_ASC',
  StableSwapSwapFeeDesc = 'stableSwap_swapFee_DESC',
  StableSwapTvlUsdAsc = 'stableSwap_tvlUSD_ASC',
  StableSwapTvlUsdDesc = 'stableSwap_tvlUSD_DESC',
  StableSwapVirtualPriceAsc = 'stableSwap_virtualPrice_ASC',
  StableSwapVirtualPriceDesc = 'stableSwap_virtualPrice_DESC',
  StableSwapVolumeUsdAsc = 'stableSwap_volumeUSD_ASC',
  StableSwapVolumeUsdDesc = 'stableSwap_volumeUSD_DESC',
  TvlUsdAsc = 'tvlUSD_ASC',
  TvlUsdDesc = 'tvlUSD_DESC'
}

export type StableSwapHourDataWhereInput = {
  AND?: InputMaybe<Array<StableSwapHourDataWhereInput>>;
  OR?: InputMaybe<Array<StableSwapHourDataWhereInput>>;
  hourStartUnix_eq?: InputMaybe<Scalars['BigInt']>;
  hourStartUnix_gt?: InputMaybe<Scalars['BigInt']>;
  hourStartUnix_gte?: InputMaybe<Scalars['BigInt']>;
  hourStartUnix_in?: InputMaybe<Array<Scalars['BigInt']>>;
  hourStartUnix_isNull?: InputMaybe<Scalars['Boolean']>;
  hourStartUnix_lt?: InputMaybe<Scalars['BigInt']>;
  hourStartUnix_lte?: InputMaybe<Scalars['BigInt']>;
  hourStartUnix_not_eq?: InputMaybe<Scalars['BigInt']>;
  hourStartUnix_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  hourlyVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  hourlyVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  hourlyVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  hourlyVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  hourlyVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  stableSwap?: InputMaybe<StableSwapWhereInput>;
  stableSwap_isNull?: InputMaybe<Scalars['Boolean']>;
  tvlUSD_contains?: InputMaybe<Scalars['String']>;
  tvlUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  tvlUSD_endsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_eq?: InputMaybe<Scalars['String']>;
  tvlUSD_gt?: InputMaybe<Scalars['String']>;
  tvlUSD_gte?: InputMaybe<Scalars['String']>;
  tvlUSD_in?: InputMaybe<Array<Scalars['String']>>;
  tvlUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  tvlUSD_lt?: InputMaybe<Scalars['String']>;
  tvlUSD_lte?: InputMaybe<Scalars['String']>;
  tvlUSD_not_contains?: InputMaybe<Scalars['String']>;
  tvlUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  tvlUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_not_eq?: InputMaybe<Scalars['String']>;
  tvlUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  tvlUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_startsWith?: InputMaybe<Scalars['String']>;
};

export type StableSwapInfo = {
  __typename?: 'StableSwapInfo';
  id: Scalars['String'];
  poolCount: Scalars['Int'];
  swaps: Array<StableSwap>;
  /** BigDecimal */
  totalTvlUSD: Scalars['String'];
  /** BigDecimal */
  totalVolumeUSD: Scalars['String'];
  txCount: Scalars['Int'];
};


export type StableSwapInfoSwapsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableSwapOrderByInput>>;
  where?: InputMaybe<StableSwapWhereInput>;
};

export type StableSwapInfoEdge = {
  __typename?: 'StableSwapInfoEdge';
  cursor: Scalars['String'];
  node: StableSwapInfo;
};

export enum StableSwapInfoOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PoolCountAsc = 'poolCount_ASC',
  PoolCountDesc = 'poolCount_DESC',
  TotalTvlUsdAsc = 'totalTvlUSD_ASC',
  TotalTvlUsdDesc = 'totalTvlUSD_DESC',
  TotalVolumeUsdAsc = 'totalVolumeUSD_ASC',
  TotalVolumeUsdDesc = 'totalVolumeUSD_DESC',
  TxCountAsc = 'txCount_ASC',
  TxCountDesc = 'txCount_DESC'
}

export type StableSwapInfoWhereInput = {
  AND?: InputMaybe<Array<StableSwapInfoWhereInput>>;
  OR?: InputMaybe<Array<StableSwapInfoWhereInput>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  poolCount_eq?: InputMaybe<Scalars['Int']>;
  poolCount_gt?: InputMaybe<Scalars['Int']>;
  poolCount_gte?: InputMaybe<Scalars['Int']>;
  poolCount_in?: InputMaybe<Array<Scalars['Int']>>;
  poolCount_isNull?: InputMaybe<Scalars['Boolean']>;
  poolCount_lt?: InputMaybe<Scalars['Int']>;
  poolCount_lte?: InputMaybe<Scalars['Int']>;
  poolCount_not_eq?: InputMaybe<Scalars['Int']>;
  poolCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  swaps_every?: InputMaybe<StableSwapWhereInput>;
  swaps_none?: InputMaybe<StableSwapWhereInput>;
  swaps_some?: InputMaybe<StableSwapWhereInput>;
  totalTvlUSD_contains?: InputMaybe<Scalars['String']>;
  totalTvlUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalTvlUSD_endsWith?: InputMaybe<Scalars['String']>;
  totalTvlUSD_eq?: InputMaybe<Scalars['String']>;
  totalTvlUSD_gt?: InputMaybe<Scalars['String']>;
  totalTvlUSD_gte?: InputMaybe<Scalars['String']>;
  totalTvlUSD_in?: InputMaybe<Array<Scalars['String']>>;
  totalTvlUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  totalTvlUSD_lt?: InputMaybe<Scalars['String']>;
  totalTvlUSD_lte?: InputMaybe<Scalars['String']>;
  totalTvlUSD_not_contains?: InputMaybe<Scalars['String']>;
  totalTvlUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalTvlUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  totalTvlUSD_not_eq?: InputMaybe<Scalars['String']>;
  totalTvlUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalTvlUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  totalTvlUSD_startsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  totalVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  totalVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
  txCount_eq?: InputMaybe<Scalars['Int']>;
  txCount_gt?: InputMaybe<Scalars['Int']>;
  txCount_gte?: InputMaybe<Scalars['Int']>;
  txCount_in?: InputMaybe<Array<Scalars['Int']>>;
  txCount_isNull?: InputMaybe<Scalars['Boolean']>;
  txCount_lt?: InputMaybe<Scalars['Int']>;
  txCount_lte?: InputMaybe<Scalars['Int']>;
  txCount_not_eq?: InputMaybe<Scalars['Int']>;
  txCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export type StableSwapInfosConnection = {
  __typename?: 'StableSwapInfosConnection';
  edges: Array<StableSwapInfoEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type StableSwapLiquidityPosition = {
  __typename?: 'StableSwapLiquidityPosition';
  id: Scalars['String'];
  liquidityTokenBalance: Scalars['String'];
  stableSwap: StableSwap;
  user: User;
};

export type StableSwapLiquidityPositionEdge = {
  __typename?: 'StableSwapLiquidityPositionEdge';
  cursor: Scalars['String'];
  node: StableSwapLiquidityPosition;
};

export enum StableSwapLiquidityPositionOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LiquidityTokenBalanceAsc = 'liquidityTokenBalance_ASC',
  LiquidityTokenBalanceDesc = 'liquidityTokenBalance_DESC',
  StableSwapAAsc = 'stableSwap_a_ASC',
  StableSwapADesc = 'stableSwap_a_DESC',
  StableSwapAddressAsc = 'stableSwap_address_ASC',
  StableSwapAddressDesc = 'stableSwap_address_DESC',
  StableSwapAdminFeeAsc = 'stableSwap_adminFee_ASC',
  StableSwapAdminFeeDesc = 'stableSwap_adminFee_DESC',
  StableSwapBaseSwapAddressAsc = 'stableSwap_baseSwapAddress_ASC',
  StableSwapBaseSwapAddressDesc = 'stableSwap_baseSwapAddress_DESC',
  StableSwapIdAsc = 'stableSwap_id_ASC',
  StableSwapIdDesc = 'stableSwap_id_DESC',
  StableSwapLpTokenAsc = 'stableSwap_lpToken_ASC',
  StableSwapLpTokenDesc = 'stableSwap_lpToken_DESC',
  StableSwapLpTotalSupplyAsc = 'stableSwap_lpTotalSupply_ASC',
  StableSwapLpTotalSupplyDesc = 'stableSwap_lpTotalSupply_DESC',
  StableSwapNumTokensAsc = 'stableSwap_numTokens_ASC',
  StableSwapNumTokensDesc = 'stableSwap_numTokens_DESC',
  StableSwapSwapFeeAsc = 'stableSwap_swapFee_ASC',
  StableSwapSwapFeeDesc = 'stableSwap_swapFee_DESC',
  StableSwapTvlUsdAsc = 'stableSwap_tvlUSD_ASC',
  StableSwapTvlUsdDesc = 'stableSwap_tvlUSD_DESC',
  StableSwapVirtualPriceAsc = 'stableSwap_virtualPrice_ASC',
  StableSwapVirtualPriceDesc = 'stableSwap_virtualPrice_DESC',
  StableSwapVolumeUsdAsc = 'stableSwap_volumeUSD_ASC',
  StableSwapVolumeUsdDesc = 'stableSwap_volumeUSD_DESC',
  UserIdAsc = 'user_id_ASC',
  UserIdDesc = 'user_id_DESC',
  UserUsdSwappedAsc = 'user_usdSwapped_ASC',
  UserUsdSwappedDesc = 'user_usdSwapped_DESC'
}

export type StableSwapLiquidityPositionWhereInput = {
  AND?: InputMaybe<Array<StableSwapLiquidityPositionWhereInput>>;
  OR?: InputMaybe<Array<StableSwapLiquidityPositionWhereInput>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_contains?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_containsInsensitive?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_endsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_eq?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityTokenBalance_isNull?: InputMaybe<Scalars['Boolean']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_contains?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_endsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_eq?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityTokenBalance_not_startsWith?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance_startsWith?: InputMaybe<Scalars['String']>;
  stableSwap?: InputMaybe<StableSwapWhereInput>;
  stableSwap_isNull?: InputMaybe<Scalars['Boolean']>;
  user?: InputMaybe<UserWhereInput>;
  user_isNull?: InputMaybe<Scalars['Boolean']>;
};

export type StableSwapLiquidityPositionsConnection = {
  __typename?: 'StableSwapLiquidityPositionsConnection';
  edges: Array<StableSwapLiquidityPositionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type StableSwapNewFeeEventData = {
  __typename?: 'StableSwapNewFeeEventData';
  adminFee: Scalars['BigInt'];
  swapFee: Scalars['BigInt'];
};

export enum StableSwapOrderByInput {
  AAsc = 'a_ASC',
  ADesc = 'a_DESC',
  AddressAsc = 'address_ASC',
  AddressDesc = 'address_DESC',
  AdminFeeAsc = 'adminFee_ASC',
  AdminFeeDesc = 'adminFee_DESC',
  BaseSwapAddressAsc = 'baseSwapAddress_ASC',
  BaseSwapAddressDesc = 'baseSwapAddress_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LpTokenAsc = 'lpToken_ASC',
  LpTokenDesc = 'lpToken_DESC',
  LpTotalSupplyAsc = 'lpTotalSupply_ASC',
  LpTotalSupplyDesc = 'lpTotalSupply_DESC',
  NumTokensAsc = 'numTokens_ASC',
  NumTokensDesc = 'numTokens_DESC',
  StableSwapInfoIdAsc = 'stableSwapInfo_id_ASC',
  StableSwapInfoIdDesc = 'stableSwapInfo_id_DESC',
  StableSwapInfoPoolCountAsc = 'stableSwapInfo_poolCount_ASC',
  StableSwapInfoPoolCountDesc = 'stableSwapInfo_poolCount_DESC',
  StableSwapInfoTotalTvlUsdAsc = 'stableSwapInfo_totalTvlUSD_ASC',
  StableSwapInfoTotalTvlUsdDesc = 'stableSwapInfo_totalTvlUSD_DESC',
  StableSwapInfoTotalVolumeUsdAsc = 'stableSwapInfo_totalVolumeUSD_ASC',
  StableSwapInfoTotalVolumeUsdDesc = 'stableSwapInfo_totalVolumeUSD_DESC',
  StableSwapInfoTxCountAsc = 'stableSwapInfo_txCount_ASC',
  StableSwapInfoTxCountDesc = 'stableSwapInfo_txCount_DESC',
  SwapFeeAsc = 'swapFee_ASC',
  SwapFeeDesc = 'swapFee_DESC',
  TvlUsdAsc = 'tvlUSD_ASC',
  TvlUsdDesc = 'tvlUSD_DESC',
  VirtualPriceAsc = 'virtualPrice_ASC',
  VirtualPriceDesc = 'virtualPrice_DESC',
  VolumeUsdAsc = 'volumeUSD_ASC',
  VolumeUsdDesc = 'volumeUSD_DESC'
}

export type StableSwapRampAEventData = {
  __typename?: 'StableSwapRampAEventData';
  futureTime: Scalars['BigInt'];
  initialTime: Scalars['BigInt'];
  newA: Scalars['BigInt'];
  oldA: Scalars['BigInt'];
};

export type StableSwapRemoveLiquidityEventData = {
  __typename?: 'StableSwapRemoveLiquidityEventData';
  fees?: Maybe<Array<Scalars['BigInt']>>;
  lpTokenSupply?: Maybe<Scalars['BigInt']>;
  provider: Scalars['Bytes'];
  tokenAmounts: Array<Scalars['BigInt']>;
};

export type StableSwapStopRampAEventData = {
  __typename?: 'StableSwapStopRampAEventData';
  currentA: Scalars['BigInt'];
  time: Scalars['BigInt'];
};

export type StableSwapTokenExchangeData = {
  __typename?: 'StableSwapTokenExchangeData';
  boughtId: Scalars['BigInt'];
  buyer: Scalars['Bytes'];
  soldId: Scalars['BigInt'];
  tokensBought: Scalars['BigInt'];
  tokensSold: Scalars['BigInt'];
};

export type StableSwapTokenExchangeUnderlyingData = {
  __typename?: 'StableSwapTokenExchangeUnderlyingData';
  boughtId: Scalars['BigInt'];
  buyer: Scalars['Bytes'];
  soldId: Scalars['BigInt'];
  tokensBought: Scalars['BigInt'];
  tokensSold: Scalars['BigInt'];
};

export type StableSwapWhereInput = {
  AND?: InputMaybe<Array<StableSwapWhereInput>>;
  OR?: InputMaybe<Array<StableSwapWhereInput>>;
  a_eq?: InputMaybe<Scalars['BigInt']>;
  a_gt?: InputMaybe<Scalars['BigInt']>;
  a_gte?: InputMaybe<Scalars['BigInt']>;
  a_in?: InputMaybe<Array<Scalars['BigInt']>>;
  a_isNull?: InputMaybe<Scalars['Boolean']>;
  a_lt?: InputMaybe<Scalars['BigInt']>;
  a_lte?: InputMaybe<Scalars['BigInt']>;
  a_not_eq?: InputMaybe<Scalars['BigInt']>;
  a_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  address_contains?: InputMaybe<Scalars['String']>;
  address_containsInsensitive?: InputMaybe<Scalars['String']>;
  address_endsWith?: InputMaybe<Scalars['String']>;
  address_eq?: InputMaybe<Scalars['String']>;
  address_gt?: InputMaybe<Scalars['String']>;
  address_gte?: InputMaybe<Scalars['String']>;
  address_in?: InputMaybe<Array<Scalars['String']>>;
  address_isNull?: InputMaybe<Scalars['Boolean']>;
  address_lt?: InputMaybe<Scalars['String']>;
  address_lte?: InputMaybe<Scalars['String']>;
  address_not_contains?: InputMaybe<Scalars['String']>;
  address_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  address_not_endsWith?: InputMaybe<Scalars['String']>;
  address_not_eq?: InputMaybe<Scalars['String']>;
  address_not_in?: InputMaybe<Array<Scalars['String']>>;
  address_not_startsWith?: InputMaybe<Scalars['String']>;
  address_startsWith?: InputMaybe<Scalars['String']>;
  adminFee_eq?: InputMaybe<Scalars['BigInt']>;
  adminFee_gt?: InputMaybe<Scalars['BigInt']>;
  adminFee_gte?: InputMaybe<Scalars['BigInt']>;
  adminFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  adminFee_isNull?: InputMaybe<Scalars['Boolean']>;
  adminFee_lt?: InputMaybe<Scalars['BigInt']>;
  adminFee_lte?: InputMaybe<Scalars['BigInt']>;
  adminFee_not_eq?: InputMaybe<Scalars['BigInt']>;
  adminFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  allTokens_containsAll?: InputMaybe<Array<Scalars['String']>>;
  allTokens_containsAny?: InputMaybe<Array<Scalars['String']>>;
  allTokens_containsNone?: InputMaybe<Array<Scalars['String']>>;
  allTokens_isNull?: InputMaybe<Scalars['Boolean']>;
  balances_containsAll?: InputMaybe<Array<Scalars['BigInt']>>;
  balances_containsAny?: InputMaybe<Array<Scalars['BigInt']>>;
  balances_containsNone?: InputMaybe<Array<Scalars['BigInt']>>;
  balances_isNull?: InputMaybe<Scalars['Boolean']>;
  baseSwapAddress_contains?: InputMaybe<Scalars['String']>;
  baseSwapAddress_containsInsensitive?: InputMaybe<Scalars['String']>;
  baseSwapAddress_endsWith?: InputMaybe<Scalars['String']>;
  baseSwapAddress_eq?: InputMaybe<Scalars['String']>;
  baseSwapAddress_gt?: InputMaybe<Scalars['String']>;
  baseSwapAddress_gte?: InputMaybe<Scalars['String']>;
  baseSwapAddress_in?: InputMaybe<Array<Scalars['String']>>;
  baseSwapAddress_isNull?: InputMaybe<Scalars['Boolean']>;
  baseSwapAddress_lt?: InputMaybe<Scalars['String']>;
  baseSwapAddress_lte?: InputMaybe<Scalars['String']>;
  baseSwapAddress_not_contains?: InputMaybe<Scalars['String']>;
  baseSwapAddress_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  baseSwapAddress_not_endsWith?: InputMaybe<Scalars['String']>;
  baseSwapAddress_not_eq?: InputMaybe<Scalars['String']>;
  baseSwapAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  baseSwapAddress_not_startsWith?: InputMaybe<Scalars['String']>;
  baseSwapAddress_startsWith?: InputMaybe<Scalars['String']>;
  baseTokens_containsAll?: InputMaybe<Array<Scalars['String']>>;
  baseTokens_containsAny?: InputMaybe<Array<Scalars['String']>>;
  baseTokens_containsNone?: InputMaybe<Array<Scalars['String']>>;
  baseTokens_isNull?: InputMaybe<Scalars['Boolean']>;
  events_every?: InputMaybe<StableSwapEventWhereInput>;
  events_none?: InputMaybe<StableSwapEventWhereInput>;
  events_some?: InputMaybe<StableSwapEventWhereInput>;
  exchanges_every?: InputMaybe<StableSwapExchangeWhereInput>;
  exchanges_none?: InputMaybe<StableSwapExchangeWhereInput>;
  exchanges_some?: InputMaybe<StableSwapExchangeWhereInput>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  lpToken_contains?: InputMaybe<Scalars['String']>;
  lpToken_containsInsensitive?: InputMaybe<Scalars['String']>;
  lpToken_endsWith?: InputMaybe<Scalars['String']>;
  lpToken_eq?: InputMaybe<Scalars['String']>;
  lpToken_gt?: InputMaybe<Scalars['String']>;
  lpToken_gte?: InputMaybe<Scalars['String']>;
  lpToken_in?: InputMaybe<Array<Scalars['String']>>;
  lpToken_isNull?: InputMaybe<Scalars['Boolean']>;
  lpToken_lt?: InputMaybe<Scalars['String']>;
  lpToken_lte?: InputMaybe<Scalars['String']>;
  lpToken_not_contains?: InputMaybe<Scalars['String']>;
  lpToken_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  lpToken_not_endsWith?: InputMaybe<Scalars['String']>;
  lpToken_not_eq?: InputMaybe<Scalars['String']>;
  lpToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  lpToken_not_startsWith?: InputMaybe<Scalars['String']>;
  lpToken_startsWith?: InputMaybe<Scalars['String']>;
  lpTotalSupply_contains?: InputMaybe<Scalars['String']>;
  lpTotalSupply_containsInsensitive?: InputMaybe<Scalars['String']>;
  lpTotalSupply_endsWith?: InputMaybe<Scalars['String']>;
  lpTotalSupply_eq?: InputMaybe<Scalars['String']>;
  lpTotalSupply_gt?: InputMaybe<Scalars['String']>;
  lpTotalSupply_gte?: InputMaybe<Scalars['String']>;
  lpTotalSupply_in?: InputMaybe<Array<Scalars['String']>>;
  lpTotalSupply_isNull?: InputMaybe<Scalars['Boolean']>;
  lpTotalSupply_lt?: InputMaybe<Scalars['String']>;
  lpTotalSupply_lte?: InputMaybe<Scalars['String']>;
  lpTotalSupply_not_contains?: InputMaybe<Scalars['String']>;
  lpTotalSupply_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  lpTotalSupply_not_endsWith?: InputMaybe<Scalars['String']>;
  lpTotalSupply_not_eq?: InputMaybe<Scalars['String']>;
  lpTotalSupply_not_in?: InputMaybe<Array<Scalars['String']>>;
  lpTotalSupply_not_startsWith?: InputMaybe<Scalars['String']>;
  lpTotalSupply_startsWith?: InputMaybe<Scalars['String']>;
  numTokens_eq?: InputMaybe<Scalars['Int']>;
  numTokens_gt?: InputMaybe<Scalars['Int']>;
  numTokens_gte?: InputMaybe<Scalars['Int']>;
  numTokens_in?: InputMaybe<Array<Scalars['Int']>>;
  numTokens_isNull?: InputMaybe<Scalars['Boolean']>;
  numTokens_lt?: InputMaybe<Scalars['Int']>;
  numTokens_lte?: InputMaybe<Scalars['Int']>;
  numTokens_not_eq?: InputMaybe<Scalars['Int']>;
  numTokens_not_in?: InputMaybe<Array<Scalars['Int']>>;
  stableSwapDayData_every?: InputMaybe<StableSwapDayDataWhereInput>;
  stableSwapDayData_none?: InputMaybe<StableSwapDayDataWhereInput>;
  stableSwapDayData_some?: InputMaybe<StableSwapDayDataWhereInput>;
  stableSwapHourData_every?: InputMaybe<StableSwapHourDataWhereInput>;
  stableSwapHourData_none?: InputMaybe<StableSwapHourDataWhereInput>;
  stableSwapHourData_some?: InputMaybe<StableSwapHourDataWhereInput>;
  stableSwapInfo?: InputMaybe<StableSwapInfoWhereInput>;
  stableSwapInfo_isNull?: InputMaybe<Scalars['Boolean']>;
  swapFee_eq?: InputMaybe<Scalars['BigInt']>;
  swapFee_gt?: InputMaybe<Scalars['BigInt']>;
  swapFee_gte?: InputMaybe<Scalars['BigInt']>;
  swapFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  swapFee_isNull?: InputMaybe<Scalars['Boolean']>;
  swapFee_lt?: InputMaybe<Scalars['BigInt']>;
  swapFee_lte?: InputMaybe<Scalars['BigInt']>;
  swapFee_not_eq?: InputMaybe<Scalars['BigInt']>;
  swapFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokens_containsAll?: InputMaybe<Array<Scalars['String']>>;
  tokens_containsAny?: InputMaybe<Array<Scalars['String']>>;
  tokens_containsNone?: InputMaybe<Array<Scalars['String']>>;
  tokens_isNull?: InputMaybe<Scalars['Boolean']>;
  tvlUSD_contains?: InputMaybe<Scalars['String']>;
  tvlUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  tvlUSD_endsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_eq?: InputMaybe<Scalars['String']>;
  tvlUSD_gt?: InputMaybe<Scalars['String']>;
  tvlUSD_gte?: InputMaybe<Scalars['String']>;
  tvlUSD_in?: InputMaybe<Array<Scalars['String']>>;
  tvlUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  tvlUSD_lt?: InputMaybe<Scalars['String']>;
  tvlUSD_lte?: InputMaybe<Scalars['String']>;
  tvlUSD_not_contains?: InputMaybe<Scalars['String']>;
  tvlUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  tvlUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_not_eq?: InputMaybe<Scalars['String']>;
  tvlUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  tvlUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_startsWith?: InputMaybe<Scalars['String']>;
  virtualPrice_eq?: InputMaybe<Scalars['BigInt']>;
  virtualPrice_gt?: InputMaybe<Scalars['BigInt']>;
  virtualPrice_gte?: InputMaybe<Scalars['BigInt']>;
  virtualPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  virtualPrice_isNull?: InputMaybe<Scalars['Boolean']>;
  virtualPrice_lt?: InputMaybe<Scalars['BigInt']>;
  virtualPrice_lte?: InputMaybe<Scalars['BigInt']>;
  virtualPrice_not_eq?: InputMaybe<Scalars['BigInt']>;
  virtualPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volumeUSD_contains?: InputMaybe<Scalars['String']>;
  volumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  volumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  volumeUSD_eq?: InputMaybe<Scalars['String']>;
  volumeUSD_gt?: InputMaybe<Scalars['String']>;
  volumeUSD_gte?: InputMaybe<Scalars['String']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  volumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  volumeUSD_lt?: InputMaybe<Scalars['String']>;
  volumeUSD_lte?: InputMaybe<Scalars['String']>;
  volumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  volumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  volumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  volumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  volumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  volumeUSD_startsWith?: InputMaybe<Scalars['String']>;
};

export type StableSwapsConnection = {
  __typename?: 'StableSwapsConnection';
  edges: Array<StableSwapEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Swap = {
  __typename?: 'Swap';
  amount0In: Scalars['String'];
  amount0Out: Scalars['String'];
  amount1In: Scalars['String'];
  amount1Out: Scalars['String'];
  amountUSD: Scalars['String'];
  from: Scalars['String'];
  id: Scalars['String'];
  logIndex?: Maybe<Scalars['Int']>;
  pair: Pair;
  sender: Scalars['String'];
  timestamp: Scalars['DateTime'];
  to: Scalars['String'];
  transaction: Transaction;
};

export type SwapEdge = {
  __typename?: 'SwapEdge';
  cursor: Scalars['String'];
  node: Swap;
};

export enum SwapOrderByInput {
  Amount0InAsc = 'amount0In_ASC',
  Amount0InDesc = 'amount0In_DESC',
  Amount0OutAsc = 'amount0Out_ASC',
  Amount0OutDesc = 'amount0Out_DESC',
  Amount1InAsc = 'amount1In_ASC',
  Amount1InDesc = 'amount1In_DESC',
  Amount1OutAsc = 'amount1Out_ASC',
  Amount1OutDesc = 'amount1Out_DESC',
  AmountUsdAsc = 'amountUSD_ASC',
  AmountUsdDesc = 'amountUSD_DESC',
  FromAsc = 'from_ASC',
  FromDesc = 'from_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LogIndexAsc = 'logIndex_ASC',
  LogIndexDesc = 'logIndex_DESC',
  PairCreatedAtBlockNumberAsc = 'pair_createdAtBlockNumber_ASC',
  PairCreatedAtBlockNumberDesc = 'pair_createdAtBlockNumber_DESC',
  PairCreatedAtTimestampAsc = 'pair_createdAtTimestamp_ASC',
  PairCreatedAtTimestampDesc = 'pair_createdAtTimestamp_DESC',
  PairIdAsc = 'pair_id_ASC',
  PairIdDesc = 'pair_id_DESC',
  PairLiquidityProviderCountAsc = 'pair_liquidityProviderCount_ASC',
  PairLiquidityProviderCountDesc = 'pair_liquidityProviderCount_DESC',
  PairReserve0Asc = 'pair_reserve0_ASC',
  PairReserve0Desc = 'pair_reserve0_DESC',
  PairReserve1Asc = 'pair_reserve1_ASC',
  PairReserve1Desc = 'pair_reserve1_DESC',
  PairReserveEthAsc = 'pair_reserveETH_ASC',
  PairReserveEthDesc = 'pair_reserveETH_DESC',
  PairReserveUsdAsc = 'pair_reserveUSD_ASC',
  PairReserveUsdDesc = 'pair_reserveUSD_DESC',
  PairToken0PriceAsc = 'pair_token0Price_ASC',
  PairToken0PriceDesc = 'pair_token0Price_DESC',
  PairToken1PriceAsc = 'pair_token1Price_ASC',
  PairToken1PriceDesc = 'pair_token1Price_DESC',
  PairTotalSupplyAsc = 'pair_totalSupply_ASC',
  PairTotalSupplyDesc = 'pair_totalSupply_DESC',
  PairTrackedReserveEthAsc = 'pair_trackedReserveETH_ASC',
  PairTrackedReserveEthDesc = 'pair_trackedReserveETH_DESC',
  PairTxCountAsc = 'pair_txCount_ASC',
  PairTxCountDesc = 'pair_txCount_DESC',
  PairUntrackedVolumeUsdAsc = 'pair_untrackedVolumeUSD_ASC',
  PairUntrackedVolumeUsdDesc = 'pair_untrackedVolumeUSD_DESC',
  PairVolumeToken0Asc = 'pair_volumeToken0_ASC',
  PairVolumeToken0Desc = 'pair_volumeToken0_DESC',
  PairVolumeToken1Asc = 'pair_volumeToken1_ASC',
  PairVolumeToken1Desc = 'pair_volumeToken1_DESC',
  PairVolumeUsdAsc = 'pair_volumeUSD_ASC',
  PairVolumeUsdDesc = 'pair_volumeUSD_DESC',
  SenderAsc = 'sender_ASC',
  SenderDesc = 'sender_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  ToAsc = 'to_ASC',
  ToDesc = 'to_DESC',
  TransactionBlockNumberAsc = 'transaction_blockNumber_ASC',
  TransactionBlockNumberDesc = 'transaction_blockNumber_DESC',
  TransactionIdAsc = 'transaction_id_ASC',
  TransactionIdDesc = 'transaction_id_DESC',
  TransactionTimestampAsc = 'transaction_timestamp_ASC',
  TransactionTimestampDesc = 'transaction_timestamp_DESC'
}

export type SwapWhereInput = {
  AND?: InputMaybe<Array<SwapWhereInput>>;
  OR?: InputMaybe<Array<SwapWhereInput>>;
  amount0In_contains?: InputMaybe<Scalars['String']>;
  amount0In_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount0In_endsWith?: InputMaybe<Scalars['String']>;
  amount0In_eq?: InputMaybe<Scalars['String']>;
  amount0In_gt?: InputMaybe<Scalars['String']>;
  amount0In_gte?: InputMaybe<Scalars['String']>;
  amount0In_in?: InputMaybe<Array<Scalars['String']>>;
  amount0In_isNull?: InputMaybe<Scalars['Boolean']>;
  amount0In_lt?: InputMaybe<Scalars['String']>;
  amount0In_lte?: InputMaybe<Scalars['String']>;
  amount0In_not_contains?: InputMaybe<Scalars['String']>;
  amount0In_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount0In_not_endsWith?: InputMaybe<Scalars['String']>;
  amount0In_not_eq?: InputMaybe<Scalars['String']>;
  amount0In_not_in?: InputMaybe<Array<Scalars['String']>>;
  amount0In_not_startsWith?: InputMaybe<Scalars['String']>;
  amount0In_startsWith?: InputMaybe<Scalars['String']>;
  amount0Out_contains?: InputMaybe<Scalars['String']>;
  amount0Out_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount0Out_endsWith?: InputMaybe<Scalars['String']>;
  amount0Out_eq?: InputMaybe<Scalars['String']>;
  amount0Out_gt?: InputMaybe<Scalars['String']>;
  amount0Out_gte?: InputMaybe<Scalars['String']>;
  amount0Out_in?: InputMaybe<Array<Scalars['String']>>;
  amount0Out_isNull?: InputMaybe<Scalars['Boolean']>;
  amount0Out_lt?: InputMaybe<Scalars['String']>;
  amount0Out_lte?: InputMaybe<Scalars['String']>;
  amount0Out_not_contains?: InputMaybe<Scalars['String']>;
  amount0Out_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount0Out_not_endsWith?: InputMaybe<Scalars['String']>;
  amount0Out_not_eq?: InputMaybe<Scalars['String']>;
  amount0Out_not_in?: InputMaybe<Array<Scalars['String']>>;
  amount0Out_not_startsWith?: InputMaybe<Scalars['String']>;
  amount0Out_startsWith?: InputMaybe<Scalars['String']>;
  amount1In_contains?: InputMaybe<Scalars['String']>;
  amount1In_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount1In_endsWith?: InputMaybe<Scalars['String']>;
  amount1In_eq?: InputMaybe<Scalars['String']>;
  amount1In_gt?: InputMaybe<Scalars['String']>;
  amount1In_gte?: InputMaybe<Scalars['String']>;
  amount1In_in?: InputMaybe<Array<Scalars['String']>>;
  amount1In_isNull?: InputMaybe<Scalars['Boolean']>;
  amount1In_lt?: InputMaybe<Scalars['String']>;
  amount1In_lte?: InputMaybe<Scalars['String']>;
  amount1In_not_contains?: InputMaybe<Scalars['String']>;
  amount1In_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount1In_not_endsWith?: InputMaybe<Scalars['String']>;
  amount1In_not_eq?: InputMaybe<Scalars['String']>;
  amount1In_not_in?: InputMaybe<Array<Scalars['String']>>;
  amount1In_not_startsWith?: InputMaybe<Scalars['String']>;
  amount1In_startsWith?: InputMaybe<Scalars['String']>;
  amount1Out_contains?: InputMaybe<Scalars['String']>;
  amount1Out_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount1Out_endsWith?: InputMaybe<Scalars['String']>;
  amount1Out_eq?: InputMaybe<Scalars['String']>;
  amount1Out_gt?: InputMaybe<Scalars['String']>;
  amount1Out_gte?: InputMaybe<Scalars['String']>;
  amount1Out_in?: InputMaybe<Array<Scalars['String']>>;
  amount1Out_isNull?: InputMaybe<Scalars['Boolean']>;
  amount1Out_lt?: InputMaybe<Scalars['String']>;
  amount1Out_lte?: InputMaybe<Scalars['String']>;
  amount1Out_not_contains?: InputMaybe<Scalars['String']>;
  amount1Out_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  amount1Out_not_endsWith?: InputMaybe<Scalars['String']>;
  amount1Out_not_eq?: InputMaybe<Scalars['String']>;
  amount1Out_not_in?: InputMaybe<Array<Scalars['String']>>;
  amount1Out_not_startsWith?: InputMaybe<Scalars['String']>;
  amount1Out_startsWith?: InputMaybe<Scalars['String']>;
  amountUSD_contains?: InputMaybe<Scalars['String']>;
  amountUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  amountUSD_endsWith?: InputMaybe<Scalars['String']>;
  amountUSD_eq?: InputMaybe<Scalars['String']>;
  amountUSD_gt?: InputMaybe<Scalars['String']>;
  amountUSD_gte?: InputMaybe<Scalars['String']>;
  amountUSD_in?: InputMaybe<Array<Scalars['String']>>;
  amountUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  amountUSD_lt?: InputMaybe<Scalars['String']>;
  amountUSD_lte?: InputMaybe<Scalars['String']>;
  amountUSD_not_contains?: InputMaybe<Scalars['String']>;
  amountUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  amountUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  amountUSD_not_eq?: InputMaybe<Scalars['String']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  amountUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  amountUSD_startsWith?: InputMaybe<Scalars['String']>;
  from_contains?: InputMaybe<Scalars['String']>;
  from_containsInsensitive?: InputMaybe<Scalars['String']>;
  from_endsWith?: InputMaybe<Scalars['String']>;
  from_eq?: InputMaybe<Scalars['String']>;
  from_gt?: InputMaybe<Scalars['String']>;
  from_gte?: InputMaybe<Scalars['String']>;
  from_in?: InputMaybe<Array<Scalars['String']>>;
  from_isNull?: InputMaybe<Scalars['Boolean']>;
  from_lt?: InputMaybe<Scalars['String']>;
  from_lte?: InputMaybe<Scalars['String']>;
  from_not_contains?: InputMaybe<Scalars['String']>;
  from_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  from_not_endsWith?: InputMaybe<Scalars['String']>;
  from_not_eq?: InputMaybe<Scalars['String']>;
  from_not_in?: InputMaybe<Array<Scalars['String']>>;
  from_not_startsWith?: InputMaybe<Scalars['String']>;
  from_startsWith?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  logIndex_eq?: InputMaybe<Scalars['Int']>;
  logIndex_gt?: InputMaybe<Scalars['Int']>;
  logIndex_gte?: InputMaybe<Scalars['Int']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']>>;
  logIndex_isNull?: InputMaybe<Scalars['Boolean']>;
  logIndex_lt?: InputMaybe<Scalars['Int']>;
  logIndex_lte?: InputMaybe<Scalars['Int']>;
  logIndex_not_eq?: InputMaybe<Scalars['Int']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']>>;
  pair?: InputMaybe<PairWhereInput>;
  pair_isNull?: InputMaybe<Scalars['Boolean']>;
  sender_contains?: InputMaybe<Scalars['String']>;
  sender_containsInsensitive?: InputMaybe<Scalars['String']>;
  sender_endsWith?: InputMaybe<Scalars['String']>;
  sender_eq?: InputMaybe<Scalars['String']>;
  sender_gt?: InputMaybe<Scalars['String']>;
  sender_gte?: InputMaybe<Scalars['String']>;
  sender_in?: InputMaybe<Array<Scalars['String']>>;
  sender_isNull?: InputMaybe<Scalars['Boolean']>;
  sender_lt?: InputMaybe<Scalars['String']>;
  sender_lte?: InputMaybe<Scalars['String']>;
  sender_not_contains?: InputMaybe<Scalars['String']>;
  sender_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  sender_not_endsWith?: InputMaybe<Scalars['String']>;
  sender_not_eq?: InputMaybe<Scalars['String']>;
  sender_not_in?: InputMaybe<Array<Scalars['String']>>;
  sender_not_startsWith?: InputMaybe<Scalars['String']>;
  sender_startsWith?: InputMaybe<Scalars['String']>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
  to_contains?: InputMaybe<Scalars['String']>;
  to_containsInsensitive?: InputMaybe<Scalars['String']>;
  to_endsWith?: InputMaybe<Scalars['String']>;
  to_eq?: InputMaybe<Scalars['String']>;
  to_gt?: InputMaybe<Scalars['String']>;
  to_gte?: InputMaybe<Scalars['String']>;
  to_in?: InputMaybe<Array<Scalars['String']>>;
  to_isNull?: InputMaybe<Scalars['Boolean']>;
  to_lt?: InputMaybe<Scalars['String']>;
  to_lte?: InputMaybe<Scalars['String']>;
  to_not_contains?: InputMaybe<Scalars['String']>;
  to_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  to_not_endsWith?: InputMaybe<Scalars['String']>;
  to_not_eq?: InputMaybe<Scalars['String']>;
  to_not_in?: InputMaybe<Array<Scalars['String']>>;
  to_not_startsWith?: InputMaybe<Scalars['String']>;
  to_startsWith?: InputMaybe<Scalars['String']>;
  transaction?: InputMaybe<TransactionWhereInput>;
  transaction_isNull?: InputMaybe<Scalars['Boolean']>;
};

export type SwapsConnection = {
  __typename?: 'SwapsConnection';
  edges: Array<SwapEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Token = {
  __typename?: 'Token';
  decimals: Scalars['Int'];
  /** BigDecimal */
  derivedETH: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  pairBase: Array<Pair>;
  pairDayDataBase: Array<PairDayData>;
  pairDayDataQuote: Array<PairDayData>;
  pairQuote: Array<Pair>;
  symbol: Scalars['String'];
  tokenDayData: Array<TokenDayData>;
  /** BigDecimal */
  totalLiquidity: Scalars['String'];
  totalSupply: Scalars['String'];
  /** BigDecimal */
  tradeVolume: Scalars['String'];
  /** BigDecimal */
  tradeVolumeUSD: Scalars['String'];
  txCount: Scalars['Int'];
  /** BigDecimal */
  untrackedVolumeUSD: Scalars['String'];
};


export type TokenPairBaseArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PairOrderByInput>>;
  where?: InputMaybe<PairWhereInput>;
};


export type TokenPairDayDataBaseArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PairDayDataOrderByInput>>;
  where?: InputMaybe<PairDayDataWhereInput>;
};


export type TokenPairDayDataQuoteArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PairDayDataOrderByInput>>;
  where?: InputMaybe<PairDayDataWhereInput>;
};


export type TokenPairQuoteArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PairOrderByInput>>;
  where?: InputMaybe<PairWhereInput>;
};


export type TokenTokenDayDataArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TokenDayDataOrderByInput>>;
  where?: InputMaybe<TokenDayDataWhereInput>;
};

export type TokenDayData = {
  __typename?: 'TokenDayData';
  dailyTxns: Scalars['Int'];
  dailyVolumeETH: Scalars['String'];
  dailyVolumeToken: Scalars['String'];
  dailyVolumeUSD: Scalars['String'];
  date: Scalars['DateTime'];
  id: Scalars['String'];
  priceUSD: Scalars['String'];
  token: Token;
  totalLiquidityETH: Scalars['String'];
  totalLiquidityToken: Scalars['String'];
  totalLiquidityUSD: Scalars['String'];
};

export type TokenDayDataConnection = {
  __typename?: 'TokenDayDataConnection';
  edges: Array<TokenDayDataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type TokenDayDataEdge = {
  __typename?: 'TokenDayDataEdge';
  cursor: Scalars['String'];
  node: TokenDayData;
};

export enum TokenDayDataOrderByInput {
  DailyTxnsAsc = 'dailyTxns_ASC',
  DailyTxnsDesc = 'dailyTxns_DESC',
  DailyVolumeEthAsc = 'dailyVolumeETH_ASC',
  DailyVolumeEthDesc = 'dailyVolumeETH_DESC',
  DailyVolumeTokenAsc = 'dailyVolumeToken_ASC',
  DailyVolumeTokenDesc = 'dailyVolumeToken_DESC',
  DailyVolumeUsdAsc = 'dailyVolumeUSD_ASC',
  DailyVolumeUsdDesc = 'dailyVolumeUSD_DESC',
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PriceUsdAsc = 'priceUSD_ASC',
  PriceUsdDesc = 'priceUSD_DESC',
  TokenDecimalsAsc = 'token_decimals_ASC',
  TokenDecimalsDesc = 'token_decimals_DESC',
  TokenDerivedEthAsc = 'token_derivedETH_ASC',
  TokenDerivedEthDesc = 'token_derivedETH_DESC',
  TokenIdAsc = 'token_id_ASC',
  TokenIdDesc = 'token_id_DESC',
  TokenNameAsc = 'token_name_ASC',
  TokenNameDesc = 'token_name_DESC',
  TokenSymbolAsc = 'token_symbol_ASC',
  TokenSymbolDesc = 'token_symbol_DESC',
  TokenTotalLiquidityAsc = 'token_totalLiquidity_ASC',
  TokenTotalLiquidityDesc = 'token_totalLiquidity_DESC',
  TokenTotalSupplyAsc = 'token_totalSupply_ASC',
  TokenTotalSupplyDesc = 'token_totalSupply_DESC',
  TokenTradeVolumeUsdAsc = 'token_tradeVolumeUSD_ASC',
  TokenTradeVolumeUsdDesc = 'token_tradeVolumeUSD_DESC',
  TokenTradeVolumeAsc = 'token_tradeVolume_ASC',
  TokenTradeVolumeDesc = 'token_tradeVolume_DESC',
  TokenTxCountAsc = 'token_txCount_ASC',
  TokenTxCountDesc = 'token_txCount_DESC',
  TokenUntrackedVolumeUsdAsc = 'token_untrackedVolumeUSD_ASC',
  TokenUntrackedVolumeUsdDesc = 'token_untrackedVolumeUSD_DESC',
  TotalLiquidityEthAsc = 'totalLiquidityETH_ASC',
  TotalLiquidityEthDesc = 'totalLiquidityETH_DESC',
  TotalLiquidityTokenAsc = 'totalLiquidityToken_ASC',
  TotalLiquidityTokenDesc = 'totalLiquidityToken_DESC',
  TotalLiquidityUsdAsc = 'totalLiquidityUSD_ASC',
  TotalLiquidityUsdDesc = 'totalLiquidityUSD_DESC'
}

export type TokenDayDataWhereInput = {
  AND?: InputMaybe<Array<TokenDayDataWhereInput>>;
  OR?: InputMaybe<Array<TokenDayDataWhereInput>>;
  dailyTxns_eq?: InputMaybe<Scalars['Int']>;
  dailyTxns_gt?: InputMaybe<Scalars['Int']>;
  dailyTxns_gte?: InputMaybe<Scalars['Int']>;
  dailyTxns_in?: InputMaybe<Array<Scalars['Int']>>;
  dailyTxns_isNull?: InputMaybe<Scalars['Boolean']>;
  dailyTxns_lt?: InputMaybe<Scalars['Int']>;
  dailyTxns_lte?: InputMaybe<Scalars['Int']>;
  dailyTxns_not_eq?: InputMaybe<Scalars['Int']>;
  dailyTxns_not_in?: InputMaybe<Array<Scalars['Int']>>;
  dailyVolumeETH_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_gt?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_gte?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeETH_isNull?: InputMaybe<Scalars['Boolean']>;
  dailyVolumeETH_lt?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_lte?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_not_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_not_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_not_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_not_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeETH_not_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeETH_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeToken_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeToken_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeToken_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeToken_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeToken_gt?: InputMaybe<Scalars['String']>;
  dailyVolumeToken_gte?: InputMaybe<Scalars['String']>;
  dailyVolumeToken_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeToken_isNull?: InputMaybe<Scalars['Boolean']>;
  dailyVolumeToken_lt?: InputMaybe<Scalars['String']>;
  dailyVolumeToken_lte?: InputMaybe<Scalars['String']>;
  dailyVolumeToken_not_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeToken_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeToken_not_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeToken_not_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeToken_not_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeToken_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  dailyVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
  date_eq?: InputMaybe<Scalars['DateTime']>;
  date_gt?: InputMaybe<Scalars['DateTime']>;
  date_gte?: InputMaybe<Scalars['DateTime']>;
  date_in?: InputMaybe<Array<Scalars['DateTime']>>;
  date_isNull?: InputMaybe<Scalars['Boolean']>;
  date_lt?: InputMaybe<Scalars['DateTime']>;
  date_lte?: InputMaybe<Scalars['DateTime']>;
  date_not_eq?: InputMaybe<Scalars['DateTime']>;
  date_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  priceUSD_contains?: InputMaybe<Scalars['String']>;
  priceUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  priceUSD_endsWith?: InputMaybe<Scalars['String']>;
  priceUSD_eq?: InputMaybe<Scalars['String']>;
  priceUSD_gt?: InputMaybe<Scalars['String']>;
  priceUSD_gte?: InputMaybe<Scalars['String']>;
  priceUSD_in?: InputMaybe<Array<Scalars['String']>>;
  priceUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  priceUSD_lt?: InputMaybe<Scalars['String']>;
  priceUSD_lte?: InputMaybe<Scalars['String']>;
  priceUSD_not_contains?: InputMaybe<Scalars['String']>;
  priceUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  priceUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  priceUSD_not_eq?: InputMaybe<Scalars['String']>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  priceUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  priceUSD_startsWith?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<TokenWhereInput>;
  token_isNull?: InputMaybe<Scalars['Boolean']>;
  totalLiquidityETH_contains?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_eq?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_gt?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_gte?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityETH_isNull?: InputMaybe<Scalars['Boolean']>;
  totalLiquidityETH_lt?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_lte?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_contains?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_eq?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityETH_not_startsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityETH_startsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityToken_contains?: InputMaybe<Scalars['String']>;
  totalLiquidityToken_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidityToken_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityToken_eq?: InputMaybe<Scalars['String']>;
  totalLiquidityToken_gt?: InputMaybe<Scalars['String']>;
  totalLiquidityToken_gte?: InputMaybe<Scalars['String']>;
  totalLiquidityToken_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityToken_isNull?: InputMaybe<Scalars['Boolean']>;
  totalLiquidityToken_lt?: InputMaybe<Scalars['String']>;
  totalLiquidityToken_lte?: InputMaybe<Scalars['String']>;
  totalLiquidityToken_not_contains?: InputMaybe<Scalars['String']>;
  totalLiquidityToken_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidityToken_not_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityToken_not_eq?: InputMaybe<Scalars['String']>;
  totalLiquidityToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityToken_not_startsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityToken_startsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_contains?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_eq?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_contains?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_eq?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidityUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  totalLiquidityUSD_startsWith?: InputMaybe<Scalars['String']>;
};

export type TokenEdge = {
  __typename?: 'TokenEdge';
  cursor: Scalars['String'];
  node: Token;
};

export enum TokenOrderByInput {
  DecimalsAsc = 'decimals_ASC',
  DecimalsDesc = 'decimals_DESC',
  DerivedEthAsc = 'derivedETH_ASC',
  DerivedEthDesc = 'derivedETH_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SymbolAsc = 'symbol_ASC',
  SymbolDesc = 'symbol_DESC',
  TotalLiquidityAsc = 'totalLiquidity_ASC',
  TotalLiquidityDesc = 'totalLiquidity_DESC',
  TotalSupplyAsc = 'totalSupply_ASC',
  TotalSupplyDesc = 'totalSupply_DESC',
  TradeVolumeUsdAsc = 'tradeVolumeUSD_ASC',
  TradeVolumeUsdDesc = 'tradeVolumeUSD_DESC',
  TradeVolumeAsc = 'tradeVolume_ASC',
  TradeVolumeDesc = 'tradeVolume_DESC',
  TxCountAsc = 'txCount_ASC',
  TxCountDesc = 'txCount_DESC',
  UntrackedVolumeUsdAsc = 'untrackedVolumeUSD_ASC',
  UntrackedVolumeUsdDesc = 'untrackedVolumeUSD_DESC'
}

export type TokenWhereInput = {
  AND?: InputMaybe<Array<TokenWhereInput>>;
  OR?: InputMaybe<Array<TokenWhereInput>>;
  decimals_eq?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_isNull?: InputMaybe<Scalars['Boolean']>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not_eq?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  derivedETH_contains?: InputMaybe<Scalars['String']>;
  derivedETH_containsInsensitive?: InputMaybe<Scalars['String']>;
  derivedETH_endsWith?: InputMaybe<Scalars['String']>;
  derivedETH_eq?: InputMaybe<Scalars['String']>;
  derivedETH_gt?: InputMaybe<Scalars['String']>;
  derivedETH_gte?: InputMaybe<Scalars['String']>;
  derivedETH_in?: InputMaybe<Array<Scalars['String']>>;
  derivedETH_isNull?: InputMaybe<Scalars['Boolean']>;
  derivedETH_lt?: InputMaybe<Scalars['String']>;
  derivedETH_lte?: InputMaybe<Scalars['String']>;
  derivedETH_not_contains?: InputMaybe<Scalars['String']>;
  derivedETH_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  derivedETH_not_endsWith?: InputMaybe<Scalars['String']>;
  derivedETH_not_eq?: InputMaybe<Scalars['String']>;
  derivedETH_not_in?: InputMaybe<Array<Scalars['String']>>;
  derivedETH_not_startsWith?: InputMaybe<Scalars['String']>;
  derivedETH_startsWith?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_endsWith?: InputMaybe<Scalars['String']>;
  name_eq?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_not_endsWith?: InputMaybe<Scalars['String']>;
  name_not_eq?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']>;
  name_startsWith?: InputMaybe<Scalars['String']>;
  pairBase_every?: InputMaybe<PairWhereInput>;
  pairBase_none?: InputMaybe<PairWhereInput>;
  pairBase_some?: InputMaybe<PairWhereInput>;
  pairDayDataBase_every?: InputMaybe<PairDayDataWhereInput>;
  pairDayDataBase_none?: InputMaybe<PairDayDataWhereInput>;
  pairDayDataBase_some?: InputMaybe<PairDayDataWhereInput>;
  pairDayDataQuote_every?: InputMaybe<PairDayDataWhereInput>;
  pairDayDataQuote_none?: InputMaybe<PairDayDataWhereInput>;
  pairDayDataQuote_some?: InputMaybe<PairDayDataWhereInput>;
  pairQuote_every?: InputMaybe<PairWhereInput>;
  pairQuote_none?: InputMaybe<PairWhereInput>;
  pairQuote_some?: InputMaybe<PairWhereInput>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_containsInsensitive?: InputMaybe<Scalars['String']>;
  symbol_endsWith?: InputMaybe<Scalars['String']>;
  symbol_eq?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_isNull?: InputMaybe<Scalars['Boolean']>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  symbol_not_endsWith?: InputMaybe<Scalars['String']>;
  symbol_not_eq?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_startsWith?: InputMaybe<Scalars['String']>;
  symbol_startsWith?: InputMaybe<Scalars['String']>;
  tokenDayData_every?: InputMaybe<TokenDayDataWhereInput>;
  tokenDayData_none?: InputMaybe<TokenDayDataWhereInput>;
  tokenDayData_some?: InputMaybe<TokenDayDataWhereInput>;
  totalLiquidity_contains?: InputMaybe<Scalars['String']>;
  totalLiquidity_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidity_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidity_eq?: InputMaybe<Scalars['String']>;
  totalLiquidity_gt?: InputMaybe<Scalars['String']>;
  totalLiquidity_gte?: InputMaybe<Scalars['String']>;
  totalLiquidity_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidity_isNull?: InputMaybe<Scalars['Boolean']>;
  totalLiquidity_lt?: InputMaybe<Scalars['String']>;
  totalLiquidity_lte?: InputMaybe<Scalars['String']>;
  totalLiquidity_not_contains?: InputMaybe<Scalars['String']>;
  totalLiquidity_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalLiquidity_not_endsWith?: InputMaybe<Scalars['String']>;
  totalLiquidity_not_eq?: InputMaybe<Scalars['String']>;
  totalLiquidity_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalLiquidity_not_startsWith?: InputMaybe<Scalars['String']>;
  totalLiquidity_startsWith?: InputMaybe<Scalars['String']>;
  totalSupply_contains?: InputMaybe<Scalars['String']>;
  totalSupply_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalSupply_endsWith?: InputMaybe<Scalars['String']>;
  totalSupply_eq?: InputMaybe<Scalars['String']>;
  totalSupply_gt?: InputMaybe<Scalars['String']>;
  totalSupply_gte?: InputMaybe<Scalars['String']>;
  totalSupply_in?: InputMaybe<Array<Scalars['String']>>;
  totalSupply_isNull?: InputMaybe<Scalars['Boolean']>;
  totalSupply_lt?: InputMaybe<Scalars['String']>;
  totalSupply_lte?: InputMaybe<Scalars['String']>;
  totalSupply_not_contains?: InputMaybe<Scalars['String']>;
  totalSupply_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalSupply_not_endsWith?: InputMaybe<Scalars['String']>;
  totalSupply_not_eq?: InputMaybe<Scalars['String']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalSupply_not_startsWith?: InputMaybe<Scalars['String']>;
  totalSupply_startsWith?: InputMaybe<Scalars['String']>;
  tradeVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  tradeVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  tradeVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  tradeVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  tradeVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  tradeVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  tradeVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  tradeVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  tradeVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  tradeVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  tradeVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  tradeVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  tradeVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  tradeVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  tradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  tradeVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  tradeVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
  tradeVolume_contains?: InputMaybe<Scalars['String']>;
  tradeVolume_containsInsensitive?: InputMaybe<Scalars['String']>;
  tradeVolume_endsWith?: InputMaybe<Scalars['String']>;
  tradeVolume_eq?: InputMaybe<Scalars['String']>;
  tradeVolume_gt?: InputMaybe<Scalars['String']>;
  tradeVolume_gte?: InputMaybe<Scalars['String']>;
  tradeVolume_in?: InputMaybe<Array<Scalars['String']>>;
  tradeVolume_isNull?: InputMaybe<Scalars['Boolean']>;
  tradeVolume_lt?: InputMaybe<Scalars['String']>;
  tradeVolume_lte?: InputMaybe<Scalars['String']>;
  tradeVolume_not_contains?: InputMaybe<Scalars['String']>;
  tradeVolume_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  tradeVolume_not_endsWith?: InputMaybe<Scalars['String']>;
  tradeVolume_not_eq?: InputMaybe<Scalars['String']>;
  tradeVolume_not_in?: InputMaybe<Array<Scalars['String']>>;
  tradeVolume_not_startsWith?: InputMaybe<Scalars['String']>;
  tradeVolume_startsWith?: InputMaybe<Scalars['String']>;
  txCount_eq?: InputMaybe<Scalars['Int']>;
  txCount_gt?: InputMaybe<Scalars['Int']>;
  txCount_gte?: InputMaybe<Scalars['Int']>;
  txCount_in?: InputMaybe<Array<Scalars['Int']>>;
  txCount_isNull?: InputMaybe<Scalars['Boolean']>;
  txCount_lt?: InputMaybe<Scalars['Int']>;
  txCount_lte?: InputMaybe<Scalars['Int']>;
  txCount_not_eq?: InputMaybe<Scalars['Int']>;
  txCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  untrackedVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  untrackedVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  untrackedVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  untrackedVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
};

export type TokensConnection = {
  __typename?: 'TokensConnection';
  edges: Array<TokenEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Transaction = {
  __typename?: 'Transaction';
  blockNumber: Scalars['BigInt'];
  burns: Array<Scalars['String']>;
  id: Scalars['String'];
  mints: Array<Scalars['String']>;
  swaps: Array<Scalars['String']>;
  timestamp: Scalars['DateTime'];
};

export type TransactionEdge = {
  __typename?: 'TransactionEdge';
  cursor: Scalars['String'];
  node: Transaction;
};

export enum TransactionOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberDesc = 'blockNumber_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC'
}

export type TransactionWhereInput = {
  AND?: InputMaybe<Array<TransactionWhereInput>>;
  OR?: InputMaybe<Array<TransactionWhereInput>>;
  blockNumber_eq?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_eq?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  burns_containsAll?: InputMaybe<Array<Scalars['String']>>;
  burns_containsAny?: InputMaybe<Array<Scalars['String']>>;
  burns_containsNone?: InputMaybe<Array<Scalars['String']>>;
  burns_isNull?: InputMaybe<Scalars['Boolean']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  mints_containsAll?: InputMaybe<Array<Scalars['String']>>;
  mints_containsAny?: InputMaybe<Array<Scalars['String']>>;
  mints_containsNone?: InputMaybe<Array<Scalars['String']>>;
  mints_isNull?: InputMaybe<Scalars['Boolean']>;
  swaps_containsAll?: InputMaybe<Array<Scalars['String']>>;
  swaps_containsAny?: InputMaybe<Array<Scalars['String']>>;
  swaps_containsNone?: InputMaybe<Array<Scalars['String']>>;
  swaps_isNull?: InputMaybe<Scalars['Boolean']>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
};

export type TransactionsConnection = {
  __typename?: 'TransactionsConnection';
  edges: Array<TransactionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  liquidityPositions: Array<LiquidityPosition>;
  stableSwapLiquidityPositions: Array<StableSwapLiquidityPosition>;
  /** BigDecimal */
  usdSwapped: Scalars['String'];
};


export type UserLiquidityPositionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<LiquidityPositionOrderByInput>>;
  where?: InputMaybe<LiquidityPositionWhereInput>;
};


export type UserStableSwapLiquidityPositionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableSwapLiquidityPositionOrderByInput>>;
  where?: InputMaybe<StableSwapLiquidityPositionWhereInput>;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String'];
  node: User;
};

export enum UserOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  UsdSwappedAsc = 'usdSwapped_ASC',
  UsdSwappedDesc = 'usdSwapped_DESC'
}

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  liquidityPositions_every?: InputMaybe<LiquidityPositionWhereInput>;
  liquidityPositions_none?: InputMaybe<LiquidityPositionWhereInput>;
  liquidityPositions_some?: InputMaybe<LiquidityPositionWhereInput>;
  stableSwapLiquidityPositions_every?: InputMaybe<StableSwapLiquidityPositionWhereInput>;
  stableSwapLiquidityPositions_none?: InputMaybe<StableSwapLiquidityPositionWhereInput>;
  stableSwapLiquidityPositions_some?: InputMaybe<StableSwapLiquidityPositionWhereInput>;
  usdSwapped_contains?: InputMaybe<Scalars['String']>;
  usdSwapped_containsInsensitive?: InputMaybe<Scalars['String']>;
  usdSwapped_endsWith?: InputMaybe<Scalars['String']>;
  usdSwapped_eq?: InputMaybe<Scalars['String']>;
  usdSwapped_gt?: InputMaybe<Scalars['String']>;
  usdSwapped_gte?: InputMaybe<Scalars['String']>;
  usdSwapped_in?: InputMaybe<Array<Scalars['String']>>;
  usdSwapped_isNull?: InputMaybe<Scalars['Boolean']>;
  usdSwapped_lt?: InputMaybe<Scalars['String']>;
  usdSwapped_lte?: InputMaybe<Scalars['String']>;
  usdSwapped_not_contains?: InputMaybe<Scalars['String']>;
  usdSwapped_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  usdSwapped_not_endsWith?: InputMaybe<Scalars['String']>;
  usdSwapped_not_eq?: InputMaybe<Scalars['String']>;
  usdSwapped_not_in?: InputMaybe<Array<Scalars['String']>>;
  usdSwapped_not_startsWith?: InputMaybe<Scalars['String']>;
  usdSwapped_startsWith?: InputMaybe<Scalars['String']>;
};

export type UsersConnection = {
  __typename?: 'UsersConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type WhereIdInput = {
  id: Scalars['String'];
};

export type ZenlinkDayInfo = {
  __typename?: 'ZenlinkDayInfo';
  dailyVolumeUSD: Scalars['String'];
  date: Scalars['DateTime'];
  id: Scalars['String'];
  stableInfo: StableSwapDayData;
  standardInfo: FactoryDayData;
  tvlUSD: Scalars['String'];
};

export type ZenlinkDayInfoEdge = {
  __typename?: 'ZenlinkDayInfoEdge';
  cursor: Scalars['String'];
  node: ZenlinkDayInfo;
};

export enum ZenlinkDayInfoOrderByInput {
  DailyVolumeUsdAsc = 'dailyVolumeUSD_ASC',
  DailyVolumeUsdDesc = 'dailyVolumeUSD_DESC',
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  StableInfoDailyVolumeUsdAsc = 'stableInfo_dailyVolumeUSD_ASC',
  StableInfoDailyVolumeUsdDesc = 'stableInfo_dailyVolumeUSD_DESC',
  StableInfoDateAsc = 'stableInfo_date_ASC',
  StableInfoDateDesc = 'stableInfo_date_DESC',
  StableInfoIdAsc = 'stableInfo_id_ASC',
  StableInfoIdDesc = 'stableInfo_id_DESC',
  StableInfoTvlUsdAsc = 'stableInfo_tvlUSD_ASC',
  StableInfoTvlUsdDesc = 'stableInfo_tvlUSD_DESC',
  StandardInfoDailyVolumeEthAsc = 'standardInfo_dailyVolumeETH_ASC',
  StandardInfoDailyVolumeEthDesc = 'standardInfo_dailyVolumeETH_DESC',
  StandardInfoDailyVolumeUsdAsc = 'standardInfo_dailyVolumeUSD_ASC',
  StandardInfoDailyVolumeUsdDesc = 'standardInfo_dailyVolumeUSD_DESC',
  StandardInfoDailyVolumeUntrackedAsc = 'standardInfo_dailyVolumeUntracked_ASC',
  StandardInfoDailyVolumeUntrackedDesc = 'standardInfo_dailyVolumeUntracked_DESC',
  StandardInfoDateAsc = 'standardInfo_date_ASC',
  StandardInfoDateDesc = 'standardInfo_date_DESC',
  StandardInfoIdAsc = 'standardInfo_id_ASC',
  StandardInfoIdDesc = 'standardInfo_id_DESC',
  StandardInfoTotalLiquidityEthAsc = 'standardInfo_totalLiquidityETH_ASC',
  StandardInfoTotalLiquidityEthDesc = 'standardInfo_totalLiquidityETH_DESC',
  StandardInfoTotalLiquidityUsdAsc = 'standardInfo_totalLiquidityUSD_ASC',
  StandardInfoTotalLiquidityUsdDesc = 'standardInfo_totalLiquidityUSD_DESC',
  StandardInfoTotalVolumeEthAsc = 'standardInfo_totalVolumeETH_ASC',
  StandardInfoTotalVolumeEthDesc = 'standardInfo_totalVolumeETH_DESC',
  StandardInfoTotalVolumeUsdAsc = 'standardInfo_totalVolumeUSD_ASC',
  StandardInfoTotalVolumeUsdDesc = 'standardInfo_totalVolumeUSD_DESC',
  StandardInfoTxCountAsc = 'standardInfo_txCount_ASC',
  StandardInfoTxCountDesc = 'standardInfo_txCount_DESC',
  TvlUsdAsc = 'tvlUSD_ASC',
  TvlUsdDesc = 'tvlUSD_DESC'
}

export type ZenlinkDayInfoWhereInput = {
  AND?: InputMaybe<Array<ZenlinkDayInfoWhereInput>>;
  OR?: InputMaybe<Array<ZenlinkDayInfoWhereInput>>;
  dailyVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  dailyVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  dailyVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  dailyVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
  date_eq?: InputMaybe<Scalars['DateTime']>;
  date_gt?: InputMaybe<Scalars['DateTime']>;
  date_gte?: InputMaybe<Scalars['DateTime']>;
  date_in?: InputMaybe<Array<Scalars['DateTime']>>;
  date_isNull?: InputMaybe<Scalars['Boolean']>;
  date_lt?: InputMaybe<Scalars['DateTime']>;
  date_lte?: InputMaybe<Scalars['DateTime']>;
  date_not_eq?: InputMaybe<Scalars['DateTime']>;
  date_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  stableInfo?: InputMaybe<StableSwapDayDataWhereInput>;
  stableInfo_isNull?: InputMaybe<Scalars['Boolean']>;
  standardInfo?: InputMaybe<FactoryDayDataWhereInput>;
  standardInfo_isNull?: InputMaybe<Scalars['Boolean']>;
  tvlUSD_contains?: InputMaybe<Scalars['String']>;
  tvlUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  tvlUSD_endsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_eq?: InputMaybe<Scalars['String']>;
  tvlUSD_gt?: InputMaybe<Scalars['String']>;
  tvlUSD_gte?: InputMaybe<Scalars['String']>;
  tvlUSD_in?: InputMaybe<Array<Scalars['String']>>;
  tvlUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  tvlUSD_lt?: InputMaybe<Scalars['String']>;
  tvlUSD_lte?: InputMaybe<Scalars['String']>;
  tvlUSD_not_contains?: InputMaybe<Scalars['String']>;
  tvlUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  tvlUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_not_eq?: InputMaybe<Scalars['String']>;
  tvlUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  tvlUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  tvlUSD_startsWith?: InputMaybe<Scalars['String']>;
};

export type ZenlinkDayInfosConnection = {
  __typename?: 'ZenlinkDayInfosConnection';
  edges: Array<ZenlinkDayInfoEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ZenlinkInfo = {
  __typename?: 'ZenlinkInfo';
  factory: Factory;
  id: Scalars['String'];
  stableSwapInfo: StableSwapInfo;
  /** BigDecimal */
  totalTvlUSD: Scalars['String'];
  /** BigDecimal */
  totalVolumeUSD: Scalars['String'];
  txCount: Scalars['Int'];
  updatedDate: Scalars['DateTime'];
};

export type ZenlinkInfoEdge = {
  __typename?: 'ZenlinkInfoEdge';
  cursor: Scalars['String'];
  node: ZenlinkInfo;
};

export enum ZenlinkInfoOrderByInput {
  FactoryIdAsc = 'factory_id_ASC',
  FactoryIdDesc = 'factory_id_DESC',
  FactoryPairCountAsc = 'factory_pairCount_ASC',
  FactoryPairCountDesc = 'factory_pairCount_DESC',
  FactoryTotalLiquidityEthAsc = 'factory_totalLiquidityETH_ASC',
  FactoryTotalLiquidityEthDesc = 'factory_totalLiquidityETH_DESC',
  FactoryTotalLiquidityUsdAsc = 'factory_totalLiquidityUSD_ASC',
  FactoryTotalLiquidityUsdDesc = 'factory_totalLiquidityUSD_DESC',
  FactoryTotalVolumeEthAsc = 'factory_totalVolumeETH_ASC',
  FactoryTotalVolumeEthDesc = 'factory_totalVolumeETH_DESC',
  FactoryTotalVolumeUsdAsc = 'factory_totalVolumeUSD_ASC',
  FactoryTotalVolumeUsdDesc = 'factory_totalVolumeUSD_DESC',
  FactoryTxCountAsc = 'factory_txCount_ASC',
  FactoryTxCountDesc = 'factory_txCount_DESC',
  FactoryUntrackedVolumeUsdAsc = 'factory_untrackedVolumeUSD_ASC',
  FactoryUntrackedVolumeUsdDesc = 'factory_untrackedVolumeUSD_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  StableSwapInfoIdAsc = 'stableSwapInfo_id_ASC',
  StableSwapInfoIdDesc = 'stableSwapInfo_id_DESC',
  StableSwapInfoPoolCountAsc = 'stableSwapInfo_poolCount_ASC',
  StableSwapInfoPoolCountDesc = 'stableSwapInfo_poolCount_DESC',
  StableSwapInfoTotalTvlUsdAsc = 'stableSwapInfo_totalTvlUSD_ASC',
  StableSwapInfoTotalTvlUsdDesc = 'stableSwapInfo_totalTvlUSD_DESC',
  StableSwapInfoTotalVolumeUsdAsc = 'stableSwapInfo_totalVolumeUSD_ASC',
  StableSwapInfoTotalVolumeUsdDesc = 'stableSwapInfo_totalVolumeUSD_DESC',
  StableSwapInfoTxCountAsc = 'stableSwapInfo_txCount_ASC',
  StableSwapInfoTxCountDesc = 'stableSwapInfo_txCount_DESC',
  TotalTvlUsdAsc = 'totalTvlUSD_ASC',
  TotalTvlUsdDesc = 'totalTvlUSD_DESC',
  TotalVolumeUsdAsc = 'totalVolumeUSD_ASC',
  TotalVolumeUsdDesc = 'totalVolumeUSD_DESC',
  TxCountAsc = 'txCount_ASC',
  TxCountDesc = 'txCount_DESC',
  UpdatedDateAsc = 'updatedDate_ASC',
  UpdatedDateDesc = 'updatedDate_DESC'
}

export type ZenlinkInfoWhereInput = {
  AND?: InputMaybe<Array<ZenlinkInfoWhereInput>>;
  OR?: InputMaybe<Array<ZenlinkInfoWhereInput>>;
  factory?: InputMaybe<FactoryWhereInput>;
  factory_isNull?: InputMaybe<Scalars['Boolean']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  stableSwapInfo?: InputMaybe<StableSwapInfoWhereInput>;
  stableSwapInfo_isNull?: InputMaybe<Scalars['Boolean']>;
  totalTvlUSD_contains?: InputMaybe<Scalars['String']>;
  totalTvlUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalTvlUSD_endsWith?: InputMaybe<Scalars['String']>;
  totalTvlUSD_eq?: InputMaybe<Scalars['String']>;
  totalTvlUSD_gt?: InputMaybe<Scalars['String']>;
  totalTvlUSD_gte?: InputMaybe<Scalars['String']>;
  totalTvlUSD_in?: InputMaybe<Array<Scalars['String']>>;
  totalTvlUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  totalTvlUSD_lt?: InputMaybe<Scalars['String']>;
  totalTvlUSD_lte?: InputMaybe<Scalars['String']>;
  totalTvlUSD_not_contains?: InputMaybe<Scalars['String']>;
  totalTvlUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalTvlUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  totalTvlUSD_not_eq?: InputMaybe<Scalars['String']>;
  totalTvlUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalTvlUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  totalTvlUSD_startsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_contains?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_endsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_eq?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_gt?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_gte?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_in?: InputMaybe<Array<Scalars['String']>>;
  totalVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']>;
  totalVolumeUSD_lt?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_lte?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_contains?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_endsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_eq?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_not_in?: InputMaybe<Array<Scalars['String']>>;
  totalVolumeUSD_not_startsWith?: InputMaybe<Scalars['String']>;
  totalVolumeUSD_startsWith?: InputMaybe<Scalars['String']>;
  txCount_eq?: InputMaybe<Scalars['Int']>;
  txCount_gt?: InputMaybe<Scalars['Int']>;
  txCount_gte?: InputMaybe<Scalars['Int']>;
  txCount_in?: InputMaybe<Array<Scalars['Int']>>;
  txCount_isNull?: InputMaybe<Scalars['Boolean']>;
  txCount_lt?: InputMaybe<Scalars['Int']>;
  txCount_lte?: InputMaybe<Scalars['Int']>;
  txCount_not_eq?: InputMaybe<Scalars['Int']>;
  txCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedDate_eq?: InputMaybe<Scalars['DateTime']>;
  updatedDate_gt?: InputMaybe<Scalars['DateTime']>;
  updatedDate_gte?: InputMaybe<Scalars['DateTime']>;
  updatedDate_in?: InputMaybe<Array<Scalars['DateTime']>>;
  updatedDate_isNull?: InputMaybe<Scalars['Boolean']>;
  updatedDate_lt?: InputMaybe<Scalars['DateTime']>;
  updatedDate_lte?: InputMaybe<Scalars['DateTime']>;
  updatedDate_not_eq?: InputMaybe<Scalars['DateTime']>;
  updatedDate_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
};

export type ZenlinkInfosConnection = {
  __typename?: 'ZenlinkInfosConnection';
  edges: Array<ZenlinkInfoEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type DaySnapshotsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ZenlinkDayInfoOrderByInput> | ZenlinkDayInfoOrderByInput>;
}>;


export type DaySnapshotsQuery = { __typename?: 'Query', zenlinkDayInfos: Array<{ __typename?: 'ZenlinkDayInfo', dailyVolumeUSD: string, tvlUSD: string, date: any }> };

export type PairByIdQueryVariables = Exact<{
  id: Scalars['String'];
  hourDataOrderBy?: InputMaybe<Array<PairHourDataOrderByInput> | PairHourDataOrderByInput>;
  hourDataLimit?: InputMaybe<Scalars['Int']>;
  dayDataOrderBy?: InputMaybe<Array<PairDayDataOrderByInput> | PairDayDataOrderByInput>;
  dayDataLimit?: InputMaybe<Scalars['Int']>;
}>;


export type PairByIdQuery = { __typename?: 'Query', pairById?: { __typename?: 'Pair', id: string, totalSupply: string, reserve0: string, reserve1: string, reserveUSD: string, token0: { __typename?: 'Token', id: string, name: string, decimals: number, symbol: string }, token1: { __typename?: 'Token', id: string, name: string, decimals: number, symbol: string }, pairHourData: Array<{ __typename?: 'PairHourData', id: string, hourlyVolumeUSD: string, reserveUSD: string, hourStartUnix: any }>, pairDayData: Array<{ __typename?: 'PairDayData', id: string, dailyVolumeUSD: string, reserveUSD: string, date: any }> } };

export type PairsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PairOrderByInput> | PairOrderByInput>;
  hourDataOrderBy?: InputMaybe<Array<PairHourDataOrderByInput> | PairHourDataOrderByInput>;
  hourDataLimit?: InputMaybe<Scalars['Int']>;
  dayDataOrderBy?: InputMaybe<Array<PairDayDataOrderByInput> | PairDayDataOrderByInput>;
  dayDataLimit?: InputMaybe<Scalars['Int']>;
}>;


export type PairsQuery = { __typename?: 'Query', pairs: Array<{ __typename?: 'Pair', id: string, totalSupply: string, reserve0: string, reserve1: string, reserveUSD: string, token0: { __typename?: 'Token', id: string, name: string, decimals: number, symbol: string }, token1: { __typename?: 'Token', id: string, name: string, decimals: number, symbol: string }, pairHourData: Array<{ __typename?: 'PairHourData', id: string, hourlyVolumeUSD: string, reserveUSD: string, hourStartUnix: any }>, pairDayData: Array<{ __typename?: 'PairDayData', id: string, dailyVolumeUSD: string, reserveUSD: string, date: any }> }> };

export type StableSwapByIdQueryVariables = Exact<{
  id: Scalars['String'];
  hourDataOrderBy?: InputMaybe<Array<StableSwapHourDataOrderByInput> | StableSwapHourDataOrderByInput>;
  hourDataLimit?: InputMaybe<Scalars['Int']>;
  dayDataOrderBy?: InputMaybe<Array<StableSwapDayDataOrderByInput> | StableSwapDayDataOrderByInput>;
  dayDataLimit?: InputMaybe<Scalars['Int']>;
}>;


export type StableSwapByIdQuery = { __typename?: 'Query', stableSwapById?: { __typename?: 'StableSwap', id: string, address: string, lpToken: string, lpTotalSupply: string, tokens: Array<string>, balances: Array<any>, swapFee: any, tvlUSD: string, stableSwapHourData: Array<{ __typename?: 'StableSwapHourData', id: string, hourStartUnix: any, hourlyVolumeUSD: string, tvlUSD: string }>, stableSwapDayData: Array<{ __typename?: 'StableSwapDayData', id: string, tvlUSD: string, dailyVolumeUSD: string, date: any }> } };

export type StableSwapsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StableSwapOrderByInput> | StableSwapOrderByInput>;
  hourDataOrderBy?: InputMaybe<Array<StableSwapHourDataOrderByInput> | StableSwapHourDataOrderByInput>;
  hourDataLimit?: InputMaybe<Scalars['Int']>;
  dayDataOrderBy?: InputMaybe<Array<StableSwapDayDataOrderByInput> | StableSwapDayDataOrderByInput>;
  dayDataLimit?: InputMaybe<Scalars['Int']>;
}>;


export type StableSwapsQuery = { __typename?: 'Query', stableSwaps: Array<{ __typename?: 'StableSwap', id: string, address: string, lpToken: string, lpTotalSupply: string, tokens: Array<string>, balances: Array<any>, swapFee: any, tvlUSD: string, stableSwapHourData: Array<{ __typename?: 'StableSwapHourData', id: string, hourStartUnix: any, hourlyVolumeUSD: string, tvlUSD: string }>, stableSwapDayData: Array<{ __typename?: 'StableSwapDayData', id: string, tvlUSD: string, dailyVolumeUSD: string, date: any }> }> };

export type TokenPricesQueryVariables = Exact<{
  where?: InputMaybe<TokenWhereInput>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type TokenPricesQuery = { __typename?: 'Query', tokens: Array<{ __typename?: 'Token', id: string, derivedETH: string, totalLiquidity: string }>, bundleById?: { __typename?: 'Bundle', ethPrice: string } };

export type TokensQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type TokensQuery = { __typename?: 'Query', tokens: Array<{ __typename?: 'Token', id: string, symbol: string, name: string, decimals: number }> };

export type TxStatusQueryVariables = Exact<{
  hash?: InputMaybe<Scalars['String']>;
}>;


export type TxStatusQuery = { __typename?: 'Query', extrinsics: Array<{ __typename?: 'Extrinsic', id: string, hash: string, success: boolean, block: { __typename?: 'Block', height: number, timestamp: any } }> };

export type UserPoolsQueryVariables = Exact<{
  id: Scalars['String'];
  pairPositionsWhere?: InputMaybe<LiquidityPositionWhereInput>;
  pairPositionsLimit?: InputMaybe<Scalars['Int']>;
  pairDayDataOrderBy?: InputMaybe<Array<PairDayDataOrderByInput> | PairDayDataOrderByInput>;
  pairDayDataLimit?: InputMaybe<Scalars['Int']>;
  stableSwapPositionsWhere?: InputMaybe<StableSwapLiquidityPositionWhereInput>;
  stableSwapPositionsLimit?: InputMaybe<Scalars['Int']>;
  stableSwapDayDataOrderBy?: InputMaybe<Array<StableSwapDayDataOrderByInput> | StableSwapDayDataOrderByInput>;
  stableSwapDayDataLimit?: InputMaybe<Scalars['Int']>;
}>;


export type UserPoolsQuery = { __typename?: 'Query', userById?: { __typename?: 'User', liquidityPositions: Array<{ __typename?: 'LiquidityPosition', id: string, liquidityTokenBalance: string, pair: { __typename?: 'Pair', id: string, totalSupply: string, reserve0: string, reserve1: string, reserveUSD: string, token0: { __typename?: 'Token', id: string, name: string, decimals: number, symbol: string }, token1: { __typename?: 'Token', id: string, name: string, decimals: number, symbol: string }, pairDayData: Array<{ __typename?: 'PairDayData', id: string, dailyVolumeUSD: string, reserveUSD: string, date: any }> } }>, stableSwapLiquidityPositions: Array<{ __typename?: 'StableSwapLiquidityPosition', id: string, liquidityTokenBalance: string, stableSwap: { __typename?: 'StableSwap', id: string, lpToken: string, address: string, lpTotalSupply: string, tokens: Array<string>, balances: Array<any>, swapFee: any, tvlUSD: string, stableSwapDayData: Array<{ __typename?: 'StableSwapDayData', id: string, tvlUSD: string, dailyVolumeUSD: string, date: any }> } }> } };


export const DaySnapshotsDocument = gql`
    query daySnapshots($limit: Int, $orderBy: [ZenlinkDayInfoOrderByInput!]) {
  zenlinkDayInfos(orderBy: $orderBy, limit: $limit) {
    dailyVolumeUSD
    tvlUSD
    date
  }
}
    `;

/**
 * __useDaySnapshotsQuery__
 *
 * To run a query within a React component, call `useDaySnapshotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDaySnapshotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDaySnapshotsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useDaySnapshotsQuery(baseOptions?: Apollo.QueryHookOptions<DaySnapshotsQuery, DaySnapshotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DaySnapshotsQuery, DaySnapshotsQueryVariables>(DaySnapshotsDocument, options);
      }
export function useDaySnapshotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DaySnapshotsQuery, DaySnapshotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DaySnapshotsQuery, DaySnapshotsQueryVariables>(DaySnapshotsDocument, options);
        }
export type DaySnapshotsQueryHookResult = ReturnType<typeof useDaySnapshotsQuery>;
export type DaySnapshotsLazyQueryHookResult = ReturnType<typeof useDaySnapshotsLazyQuery>;
export type DaySnapshotsQueryResult = Apollo.QueryResult<DaySnapshotsQuery, DaySnapshotsQueryVariables>;
export const PairByIdDocument = gql`
    query pairById($id: String!, $hourDataOrderBy: [PairHourDataOrderByInput!], $hourDataLimit: Int, $dayDataOrderBy: [PairDayDataOrderByInput!], $dayDataLimit: Int) {
  pairById(id: $id) {
    token0 {
      id
      name
      decimals
      symbol
    }
    token1 {
      id
      name
      decimals
      symbol
    }
    id
    totalSupply
    reserve0
    reserve1
    reserveUSD
    pairHourData(orderBy: $hourDataOrderBy, limit: $hourDataLimit) {
      id
      hourlyVolumeUSD
      reserveUSD
      hourStartUnix
    }
    pairDayData(orderBy: $dayDataOrderBy, limit: $dayDataLimit) {
      id
      dailyVolumeUSD
      reserveUSD
      date
    }
  }
}
    `;

/**
 * __usePairByIdQuery__
 *
 * To run a query within a React component, call `usePairByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `usePairByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePairByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *      hourDataOrderBy: // value for 'hourDataOrderBy'
 *      hourDataLimit: // value for 'hourDataLimit'
 *      dayDataOrderBy: // value for 'dayDataOrderBy'
 *      dayDataLimit: // value for 'dayDataLimit'
 *   },
 * });
 */
export function usePairByIdQuery(baseOptions: Apollo.QueryHookOptions<PairByIdQuery, PairByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PairByIdQuery, PairByIdQueryVariables>(PairByIdDocument, options);
      }
export function usePairByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PairByIdQuery, PairByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PairByIdQuery, PairByIdQueryVariables>(PairByIdDocument, options);
        }
export type PairByIdQueryHookResult = ReturnType<typeof usePairByIdQuery>;
export type PairByIdLazyQueryHookResult = ReturnType<typeof usePairByIdLazyQuery>;
export type PairByIdQueryResult = Apollo.QueryResult<PairByIdQuery, PairByIdQueryVariables>;
export const PairsDocument = gql`
    query pairs($limit: Int, $orderBy: [PairOrderByInput!], $hourDataOrderBy: [PairHourDataOrderByInput!], $hourDataLimit: Int, $dayDataOrderBy: [PairDayDataOrderByInput!], $dayDataLimit: Int) {
  pairs(limit: $limit, orderBy: $orderBy) {
    token0 {
      id
      name
      decimals
      symbol
    }
    token1 {
      id
      name
      decimals
      symbol
    }
    id
    totalSupply
    reserve0
    reserve1
    reserveUSD
    pairHourData(orderBy: $hourDataOrderBy, limit: $hourDataLimit) {
      id
      hourlyVolumeUSD
      reserveUSD
      hourStartUnix
    }
    pairDayData(orderBy: $dayDataOrderBy, limit: $dayDataLimit) {
      id
      dailyVolumeUSD
      reserveUSD
      date
    }
  }
}
    `;

/**
 * __usePairsQuery__
 *
 * To run a query within a React component, call `usePairsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePairsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePairsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      orderBy: // value for 'orderBy'
 *      hourDataOrderBy: // value for 'hourDataOrderBy'
 *      hourDataLimit: // value for 'hourDataLimit'
 *      dayDataOrderBy: // value for 'dayDataOrderBy'
 *      dayDataLimit: // value for 'dayDataLimit'
 *   },
 * });
 */
export function usePairsQuery(baseOptions?: Apollo.QueryHookOptions<PairsQuery, PairsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PairsQuery, PairsQueryVariables>(PairsDocument, options);
      }
export function usePairsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PairsQuery, PairsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PairsQuery, PairsQueryVariables>(PairsDocument, options);
        }
export type PairsQueryHookResult = ReturnType<typeof usePairsQuery>;
export type PairsLazyQueryHookResult = ReturnType<typeof usePairsLazyQuery>;
export type PairsQueryResult = Apollo.QueryResult<PairsQuery, PairsQueryVariables>;
export const StableSwapByIdDocument = gql`
    query stableSwapById($id: String!, $hourDataOrderBy: [StableSwapHourDataOrderByInput!], $hourDataLimit: Int, $dayDataOrderBy: [StableSwapDayDataOrderByInput!], $dayDataLimit: Int) {
  stableSwapById(id: $id) {
    id
    address
    lpToken
    lpTotalSupply
    tokens
    balances
    swapFee
    tvlUSD
    stableSwapHourData(orderBy: $hourDataOrderBy, limit: $hourDataLimit) {
      id
      hourStartUnix
      hourlyVolumeUSD
      tvlUSD
    }
    stableSwapDayData(orderBy: $dayDataOrderBy, limit: $dayDataLimit) {
      id
      tvlUSD
      dailyVolumeUSD
      date
    }
  }
}
    `;

/**
 * __useStableSwapByIdQuery__
 *
 * To run a query within a React component, call `useStableSwapByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useStableSwapByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStableSwapByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *      hourDataOrderBy: // value for 'hourDataOrderBy'
 *      hourDataLimit: // value for 'hourDataLimit'
 *      dayDataOrderBy: // value for 'dayDataOrderBy'
 *      dayDataLimit: // value for 'dayDataLimit'
 *   },
 * });
 */
export function useStableSwapByIdQuery(baseOptions: Apollo.QueryHookOptions<StableSwapByIdQuery, StableSwapByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StableSwapByIdQuery, StableSwapByIdQueryVariables>(StableSwapByIdDocument, options);
      }
export function useStableSwapByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StableSwapByIdQuery, StableSwapByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StableSwapByIdQuery, StableSwapByIdQueryVariables>(StableSwapByIdDocument, options);
        }
export type StableSwapByIdQueryHookResult = ReturnType<typeof useStableSwapByIdQuery>;
export type StableSwapByIdLazyQueryHookResult = ReturnType<typeof useStableSwapByIdLazyQuery>;
export type StableSwapByIdQueryResult = Apollo.QueryResult<StableSwapByIdQuery, StableSwapByIdQueryVariables>;
export const StableSwapsDocument = gql`
    query stableSwaps($limit: Int, $orderBy: [StableSwapOrderByInput!], $hourDataOrderBy: [StableSwapHourDataOrderByInput!], $hourDataLimit: Int, $dayDataOrderBy: [StableSwapDayDataOrderByInput!], $dayDataLimit: Int) {
  stableSwaps(limit: $limit, orderBy: $orderBy) {
    id
    address
    lpToken
    lpTotalSupply
    tokens
    balances
    swapFee
    tvlUSD
    stableSwapHourData(orderBy: $hourDataOrderBy, limit: $hourDataLimit) {
      id
      hourStartUnix
      hourlyVolumeUSD
      tvlUSD
    }
    stableSwapDayData(orderBy: $dayDataOrderBy, limit: $dayDataLimit) {
      id
      tvlUSD
      dailyVolumeUSD
      date
    }
  }
}
    `;

/**
 * __useStableSwapsQuery__
 *
 * To run a query within a React component, call `useStableSwapsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStableSwapsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStableSwapsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      orderBy: // value for 'orderBy'
 *      hourDataOrderBy: // value for 'hourDataOrderBy'
 *      hourDataLimit: // value for 'hourDataLimit'
 *      dayDataOrderBy: // value for 'dayDataOrderBy'
 *      dayDataLimit: // value for 'dayDataLimit'
 *   },
 * });
 */
export function useStableSwapsQuery(baseOptions?: Apollo.QueryHookOptions<StableSwapsQuery, StableSwapsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StableSwapsQuery, StableSwapsQueryVariables>(StableSwapsDocument, options);
      }
export function useStableSwapsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StableSwapsQuery, StableSwapsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StableSwapsQuery, StableSwapsQueryVariables>(StableSwapsDocument, options);
        }
export type StableSwapsQueryHookResult = ReturnType<typeof useStableSwapsQuery>;
export type StableSwapsLazyQueryHookResult = ReturnType<typeof useStableSwapsLazyQuery>;
export type StableSwapsQueryResult = Apollo.QueryResult<StableSwapsQuery, StableSwapsQueryVariables>;
export const TokenPricesDocument = gql`
    query tokenPrices($where: TokenWhereInput, $limit: Int) {
  tokens(where: $where, limit: $limit) {
    id
    derivedETH
    totalLiquidity
  }
  bundleById(id: "1") {
    ethPrice
  }
}
    `;

/**
 * __useTokenPricesQuery__
 *
 * To run a query within a React component, call `useTokenPricesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenPricesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenPricesQuery({
 *   variables: {
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useTokenPricesQuery(baseOptions?: Apollo.QueryHookOptions<TokenPricesQuery, TokenPricesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenPricesQuery, TokenPricesQueryVariables>(TokenPricesDocument, options);
      }
export function useTokenPricesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenPricesQuery, TokenPricesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenPricesQuery, TokenPricesQueryVariables>(TokenPricesDocument, options);
        }
export type TokenPricesQueryHookResult = ReturnType<typeof useTokenPricesQuery>;
export type TokenPricesLazyQueryHookResult = ReturnType<typeof useTokenPricesLazyQuery>;
export type TokenPricesQueryResult = Apollo.QueryResult<TokenPricesQuery, TokenPricesQueryVariables>;
export const TokensDocument = gql`
    query tokens($ids: [String!], $limit: Int) {
  tokens(where: {id_in: $ids}, limit: $limit) {
    id
    symbol
    name
    decimals
  }
}
    `;

/**
 * __useTokensQuery__
 *
 * To run a query within a React component, call `useTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokensQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useTokensQuery(baseOptions?: Apollo.QueryHookOptions<TokensQuery, TokensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokensQuery, TokensQueryVariables>(TokensDocument, options);
      }
export function useTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokensQuery, TokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokensQuery, TokensQueryVariables>(TokensDocument, options);
        }
export type TokensQueryHookResult = ReturnType<typeof useTokensQuery>;
export type TokensLazyQueryHookResult = ReturnType<typeof useTokensLazyQuery>;
export type TokensQueryResult = Apollo.QueryResult<TokensQuery, TokensQueryVariables>;
export const TxStatusDocument = gql`
    query txStatus($hash: String) {
  extrinsics(limit: 1, where: {hash_eq: $hash}) {
    id
    hash
    success
    block {
      height
      timestamp
    }
  }
}
    `;

/**
 * __useTxStatusQuery__
 *
 * To run a query within a React component, call `useTxStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useTxStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTxStatusQuery({
 *   variables: {
 *      hash: // value for 'hash'
 *   },
 * });
 */
export function useTxStatusQuery(baseOptions?: Apollo.QueryHookOptions<TxStatusQuery, TxStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TxStatusQuery, TxStatusQueryVariables>(TxStatusDocument, options);
      }
export function useTxStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TxStatusQuery, TxStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TxStatusQuery, TxStatusQueryVariables>(TxStatusDocument, options);
        }
export type TxStatusQueryHookResult = ReturnType<typeof useTxStatusQuery>;
export type TxStatusLazyQueryHookResult = ReturnType<typeof useTxStatusLazyQuery>;
export type TxStatusQueryResult = Apollo.QueryResult<TxStatusQuery, TxStatusQueryVariables>;
export const UserPoolsDocument = gql`
    query userPools($id: String!, $pairPositionsWhere: LiquidityPositionWhereInput, $pairPositionsLimit: Int, $pairDayDataOrderBy: [PairDayDataOrderByInput!], $pairDayDataLimit: Int, $stableSwapPositionsWhere: StableSwapLiquidityPositionWhereInput, $stableSwapPositionsLimit: Int, $stableSwapDayDataOrderBy: [StableSwapDayDataOrderByInput!], $stableSwapDayDataLimit: Int) {
  userById(id: $id) {
    liquidityPositions(where: $pairPositionsWhere, limit: $pairPositionsLimit) {
      id
      liquidityTokenBalance
      pair {
        token0 {
          id
          name
          decimals
          symbol
        }
        token1 {
          id
          name
          decimals
          symbol
        }
        id
        totalSupply
        reserve0
        reserve1
        reserveUSD
        pairDayData(orderBy: $pairDayDataOrderBy, limit: $pairDayDataLimit) {
          id
          dailyVolumeUSD
          reserveUSD
          date
        }
      }
    }
    stableSwapLiquidityPositions(
      where: $stableSwapPositionsWhere
      limit: $stableSwapPositionsLimit
    ) {
      id
      liquidityTokenBalance
      stableSwap {
        id
        lpToken
        address
        lpTotalSupply
        tokens
        balances
        swapFee
        tvlUSD
        stableSwapDayData(
          orderBy: $stableSwapDayDataOrderBy
          limit: $stableSwapDayDataLimit
        ) {
          id
          tvlUSD
          dailyVolumeUSD
          date
        }
      }
    }
  }
}
    `;

/**
 * __useUserPoolsQuery__
 *
 * To run a query within a React component, call `useUserPoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserPoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserPoolsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      pairPositionsWhere: // value for 'pairPositionsWhere'
 *      pairPositionsLimit: // value for 'pairPositionsLimit'
 *      pairDayDataOrderBy: // value for 'pairDayDataOrderBy'
 *      pairDayDataLimit: // value for 'pairDayDataLimit'
 *      stableSwapPositionsWhere: // value for 'stableSwapPositionsWhere'
 *      stableSwapPositionsLimit: // value for 'stableSwapPositionsLimit'
 *      stableSwapDayDataOrderBy: // value for 'stableSwapDayDataOrderBy'
 *      stableSwapDayDataLimit: // value for 'stableSwapDayDataLimit'
 *   },
 * });
 */
export function useUserPoolsQuery(baseOptions: Apollo.QueryHookOptions<UserPoolsQuery, UserPoolsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserPoolsQuery, UserPoolsQueryVariables>(UserPoolsDocument, options);
      }
export function useUserPoolsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserPoolsQuery, UserPoolsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserPoolsQuery, UserPoolsQueryVariables>(UserPoolsDocument, options);
        }
export type UserPoolsQueryHookResult = ReturnType<typeof useUserPoolsQuery>;
export type UserPoolsLazyQueryHookResult = ReturnType<typeof useUserPoolsLazyQuery>;
export type UserPoolsQueryResult = Apollo.QueryResult<UserPoolsQuery, UserPoolsQueryVariables>;