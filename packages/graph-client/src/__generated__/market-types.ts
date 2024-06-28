import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  DateTime: { input: any; output: any; }
};

export type Burn = {
  __typename?: 'Burn';
  amountUSD: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  market: Market;
  netLpBurned: Scalars['BigDecimal']['output'];
  netPtOut: Scalars['BigDecimal']['output'];
  netSyOut: Scalars['BigDecimal']['output'];
  receiverPt: Scalars['String']['output'];
  receiverSy: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type BurnEdge = {
  __typename?: 'BurnEdge';
  cursor: Scalars['String']['output'];
  node: Burn;
};

export enum BurnOrderByInput {
  AmountUsdAsc = 'amountUSD_ASC',
  AmountUsdAscNullsFirst = 'amountUSD_ASC_NULLS_FIRST',
  AmountUsdAscNullsLast = 'amountUSD_ASC_NULLS_LAST',
  AmountUsdDesc = 'amountUSD_DESC',
  AmountUsdDescNullsFirst = 'amountUSD_DESC_NULLS_FIRST',
  AmountUsdDescNullsLast = 'amountUSD_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  MarketDecimalsAsc = 'market_decimals_ASC',
  MarketDecimalsAscNullsFirst = 'market_decimals_ASC_NULLS_FIRST',
  MarketDecimalsAscNullsLast = 'market_decimals_ASC_NULLS_LAST',
  MarketDecimalsDesc = 'market_decimals_DESC',
  MarketDecimalsDescNullsFirst = 'market_decimals_DESC_NULLS_FIRST',
  MarketDecimalsDescNullsLast = 'market_decimals_DESC_NULLS_LAST',
  MarketExpiryAsc = 'market_expiry_ASC',
  MarketExpiryAscNullsFirst = 'market_expiry_ASC_NULLS_FIRST',
  MarketExpiryAscNullsLast = 'market_expiry_ASC_NULLS_LAST',
  MarketExpiryDesc = 'market_expiry_DESC',
  MarketExpiryDescNullsFirst = 'market_expiry_DESC_NULLS_FIRST',
  MarketExpiryDescNullsLast = 'market_expiry_DESC_NULLS_LAST',
  MarketFeeUsdAsc = 'market_feeUSD_ASC',
  MarketFeeUsdAscNullsFirst = 'market_feeUSD_ASC_NULLS_FIRST',
  MarketFeeUsdAscNullsLast = 'market_feeUSD_ASC_NULLS_LAST',
  MarketFeeUsdDesc = 'market_feeUSD_DESC',
  MarketFeeUsdDescNullsFirst = 'market_feeUSD_DESC_NULLS_FIRST',
  MarketFeeUsdDescNullsLast = 'market_feeUSD_DESC_NULLS_LAST',
  MarketIdAsc = 'market_id_ASC',
  MarketIdAscNullsFirst = 'market_id_ASC_NULLS_FIRST',
  MarketIdAscNullsLast = 'market_id_ASC_NULLS_LAST',
  MarketIdDesc = 'market_id_DESC',
  MarketIdDescNullsFirst = 'market_id_DESC_NULLS_FIRST',
  MarketIdDescNullsLast = 'market_id_DESC_NULLS_LAST',
  MarketNameAsc = 'market_name_ASC',
  MarketNameAscNullsFirst = 'market_name_ASC_NULLS_FIRST',
  MarketNameAscNullsLast = 'market_name_ASC_NULLS_LAST',
  MarketNameDesc = 'market_name_DESC',
  MarketNameDescNullsFirst = 'market_name_DESC_NULLS_FIRST',
  MarketNameDescNullsLast = 'market_name_DESC_NULLS_LAST',
  MarketPriceUsdAsc = 'market_priceUSD_ASC',
  MarketPriceUsdAscNullsFirst = 'market_priceUSD_ASC_NULLS_FIRST',
  MarketPriceUsdAscNullsLast = 'market_priceUSD_ASC_NULLS_LAST',
  MarketPriceUsdDesc = 'market_priceUSD_DESC',
  MarketPriceUsdDescNullsFirst = 'market_priceUSD_DESC_NULLS_FIRST',
  MarketPriceUsdDescNullsLast = 'market_priceUSD_DESC_NULLS_LAST',
  MarketReserveUsdAsc = 'market_reserveUSD_ASC',
  MarketReserveUsdAscNullsFirst = 'market_reserveUSD_ASC_NULLS_FIRST',
  MarketReserveUsdAscNullsLast = 'market_reserveUSD_ASC_NULLS_LAST',
  MarketReserveUsdDesc = 'market_reserveUSD_DESC',
  MarketReserveUsdDescNullsFirst = 'market_reserveUSD_DESC_NULLS_FIRST',
  MarketReserveUsdDescNullsLast = 'market_reserveUSD_DESC_NULLS_LAST',
  MarketSymbolAsc = 'market_symbol_ASC',
  MarketSymbolAscNullsFirst = 'market_symbol_ASC_NULLS_FIRST',
  MarketSymbolAscNullsLast = 'market_symbol_ASC_NULLS_LAST',
  MarketSymbolDesc = 'market_symbol_DESC',
  MarketSymbolDescNullsFirst = 'market_symbol_DESC_NULLS_FIRST',
  MarketSymbolDescNullsLast = 'market_symbol_DESC_NULLS_LAST',
  MarketTotalLpAsc = 'market_totalLp_ASC',
  MarketTotalLpAscNullsFirst = 'market_totalLp_ASC_NULLS_FIRST',
  MarketTotalLpAscNullsLast = 'market_totalLp_ASC_NULLS_LAST',
  MarketTotalLpDesc = 'market_totalLp_DESC',
  MarketTotalLpDescNullsFirst = 'market_totalLp_DESC_NULLS_FIRST',
  MarketTotalLpDescNullsLast = 'market_totalLp_DESC_NULLS_LAST',
  MarketTotalPtAsc = 'market_totalPt_ASC',
  MarketTotalPtAscNullsFirst = 'market_totalPt_ASC_NULLS_FIRST',
  MarketTotalPtAscNullsLast = 'market_totalPt_ASC_NULLS_LAST',
  MarketTotalPtDesc = 'market_totalPt_DESC',
  MarketTotalPtDescNullsFirst = 'market_totalPt_DESC_NULLS_FIRST',
  MarketTotalPtDescNullsLast = 'market_totalPt_DESC_NULLS_LAST',
  MarketTotalSyAsc = 'market_totalSy_ASC',
  MarketTotalSyAscNullsFirst = 'market_totalSy_ASC_NULLS_FIRST',
  MarketTotalSyAscNullsLast = 'market_totalSy_ASC_NULLS_LAST',
  MarketTotalSyDesc = 'market_totalSy_DESC',
  MarketTotalSyDescNullsFirst = 'market_totalSy_DESC_NULLS_FIRST',
  MarketTotalSyDescNullsLast = 'market_totalSy_DESC_NULLS_LAST',
  MarketVolumeUsdAsc = 'market_volumeUSD_ASC',
  MarketVolumeUsdAscNullsFirst = 'market_volumeUSD_ASC_NULLS_FIRST',
  MarketVolumeUsdAscNullsLast = 'market_volumeUSD_ASC_NULLS_LAST',
  MarketVolumeUsdDesc = 'market_volumeUSD_DESC',
  MarketVolumeUsdDescNullsFirst = 'market_volumeUSD_DESC_NULLS_FIRST',
  MarketVolumeUsdDescNullsLast = 'market_volumeUSD_DESC_NULLS_LAST',
  NetLpBurnedAsc = 'netLpBurned_ASC',
  NetLpBurnedAscNullsFirst = 'netLpBurned_ASC_NULLS_FIRST',
  NetLpBurnedAscNullsLast = 'netLpBurned_ASC_NULLS_LAST',
  NetLpBurnedDesc = 'netLpBurned_DESC',
  NetLpBurnedDescNullsFirst = 'netLpBurned_DESC_NULLS_FIRST',
  NetLpBurnedDescNullsLast = 'netLpBurned_DESC_NULLS_LAST',
  NetPtOutAsc = 'netPtOut_ASC',
  NetPtOutAscNullsFirst = 'netPtOut_ASC_NULLS_FIRST',
  NetPtOutAscNullsLast = 'netPtOut_ASC_NULLS_LAST',
  NetPtOutDesc = 'netPtOut_DESC',
  NetPtOutDescNullsFirst = 'netPtOut_DESC_NULLS_FIRST',
  NetPtOutDescNullsLast = 'netPtOut_DESC_NULLS_LAST',
  NetSyOutAsc = 'netSyOut_ASC',
  NetSyOutAscNullsFirst = 'netSyOut_ASC_NULLS_FIRST',
  NetSyOutAscNullsLast = 'netSyOut_ASC_NULLS_LAST',
  NetSyOutDesc = 'netSyOut_DESC',
  NetSyOutDescNullsFirst = 'netSyOut_DESC_NULLS_FIRST',
  NetSyOutDescNullsLast = 'netSyOut_DESC_NULLS_LAST',
  ReceiverPtAsc = 'receiverPt_ASC',
  ReceiverPtAscNullsFirst = 'receiverPt_ASC_NULLS_FIRST',
  ReceiverPtAscNullsLast = 'receiverPt_ASC_NULLS_LAST',
  ReceiverPtDesc = 'receiverPt_DESC',
  ReceiverPtDescNullsFirst = 'receiverPt_DESC_NULLS_FIRST',
  ReceiverPtDescNullsLast = 'receiverPt_DESC_NULLS_LAST',
  ReceiverSyAsc = 'receiverSy_ASC',
  ReceiverSyAscNullsFirst = 'receiverSy_ASC_NULLS_FIRST',
  ReceiverSyAscNullsLast = 'receiverSy_ASC_NULLS_LAST',
  ReceiverSyDesc = 'receiverSy_DESC',
  ReceiverSyDescNullsFirst = 'receiverSy_DESC_NULLS_FIRST',
  ReceiverSyDescNullsLast = 'receiverSy_DESC_NULLS_LAST',
  TimestampAsc = 'timestamp_ASC',
  TimestampAscNullsFirst = 'timestamp_ASC_NULLS_FIRST',
  TimestampAscNullsLast = 'timestamp_ASC_NULLS_LAST',
  TimestampDesc = 'timestamp_DESC',
  TimestampDescNullsFirst = 'timestamp_DESC_NULLS_FIRST',
  TimestampDescNullsLast = 'timestamp_DESC_NULLS_LAST'
}

export type BurnWhereInput = {
  AND?: InputMaybe<Array<BurnWhereInput>>;
  OR?: InputMaybe<Array<BurnWhereInput>>;
  amountUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  amountUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  amountUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  market?: InputMaybe<MarketWhereInput>;
  market_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  netLpBurned_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netLpBurned_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netLpBurned_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netLpBurned_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netLpBurned_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  netLpBurned_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netLpBurned_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netLpBurned_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netLpBurned_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netPtOut_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtOut_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtOut_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtOut_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netPtOut_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  netPtOut_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtOut_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtOut_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtOut_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netSyOut_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyOut_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyOut_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyOut_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netSyOut_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  netSyOut_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyOut_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyOut_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyOut_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  receiverPt_contains?: InputMaybe<Scalars['String']['input']>;
  receiverPt_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  receiverPt_endsWith?: InputMaybe<Scalars['String']['input']>;
  receiverPt_eq?: InputMaybe<Scalars['String']['input']>;
  receiverPt_gt?: InputMaybe<Scalars['String']['input']>;
  receiverPt_gte?: InputMaybe<Scalars['String']['input']>;
  receiverPt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  receiverPt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  receiverPt_lt?: InputMaybe<Scalars['String']['input']>;
  receiverPt_lte?: InputMaybe<Scalars['String']['input']>;
  receiverPt_not_contains?: InputMaybe<Scalars['String']['input']>;
  receiverPt_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  receiverPt_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  receiverPt_not_eq?: InputMaybe<Scalars['String']['input']>;
  receiverPt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  receiverPt_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  receiverPt_startsWith?: InputMaybe<Scalars['String']['input']>;
  receiverSy_contains?: InputMaybe<Scalars['String']['input']>;
  receiverSy_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  receiverSy_endsWith?: InputMaybe<Scalars['String']['input']>;
  receiverSy_eq?: InputMaybe<Scalars['String']['input']>;
  receiverSy_gt?: InputMaybe<Scalars['String']['input']>;
  receiverSy_gte?: InputMaybe<Scalars['String']['input']>;
  receiverSy_in?: InputMaybe<Array<Scalars['String']['input']>>;
  receiverSy_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  receiverSy_lt?: InputMaybe<Scalars['String']['input']>;
  receiverSy_lte?: InputMaybe<Scalars['String']['input']>;
  receiverSy_not_contains?: InputMaybe<Scalars['String']['input']>;
  receiverSy_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  receiverSy_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  receiverSy_not_eq?: InputMaybe<Scalars['String']['input']>;
  receiverSy_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  receiverSy_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  receiverSy_startsWith?: InputMaybe<Scalars['String']['input']>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type BurnsConnection = {
  __typename?: 'BurnsConnection';
  edges: Array<BurnEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type FactoriesConnection = {
  __typename?: 'FactoriesConnection';
  edges: Array<FactoryEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Factory = {
  __typename?: 'Factory';
  id: Scalars['String']['output'];
  marketCount: Scalars['Int']['output'];
  totalFeeUSD: Scalars['Float']['output'];
  totalLiquidityUSD: Scalars['Float']['output'];
  totalVolumeUSD: Scalars['Float']['output'];
};

export type FactoryDayData = {
  __typename?: 'FactoryDayData';
  dailyFeeUSD: Scalars['Float']['output'];
  dailyVolumeUSD: Scalars['Float']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  totalFeeUSD: Scalars['Float']['output'];
  totalLiquidityUSD: Scalars['Float']['output'];
  totalVolumeUSD: Scalars['Float']['output'];
};

export type FactoryDayDataConnection = {
  __typename?: 'FactoryDayDataConnection';
  edges: Array<FactoryDayDataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type FactoryDayDataEdge = {
  __typename?: 'FactoryDayDataEdge';
  cursor: Scalars['String']['output'];
  node: FactoryDayData;
};

export enum FactoryDayDataOrderByInput {
  DailyFeeUsdAsc = 'dailyFeeUSD_ASC',
  DailyFeeUsdAscNullsFirst = 'dailyFeeUSD_ASC_NULLS_FIRST',
  DailyFeeUsdAscNullsLast = 'dailyFeeUSD_ASC_NULLS_LAST',
  DailyFeeUsdDesc = 'dailyFeeUSD_DESC',
  DailyFeeUsdDescNullsFirst = 'dailyFeeUSD_DESC_NULLS_FIRST',
  DailyFeeUsdDescNullsLast = 'dailyFeeUSD_DESC_NULLS_LAST',
  DailyVolumeUsdAsc = 'dailyVolumeUSD_ASC',
  DailyVolumeUsdAscNullsFirst = 'dailyVolumeUSD_ASC_NULLS_FIRST',
  DailyVolumeUsdAscNullsLast = 'dailyVolumeUSD_ASC_NULLS_LAST',
  DailyVolumeUsdDesc = 'dailyVolumeUSD_DESC',
  DailyVolumeUsdDescNullsFirst = 'dailyVolumeUSD_DESC_NULLS_FIRST',
  DailyVolumeUsdDescNullsLast = 'dailyVolumeUSD_DESC_NULLS_LAST',
  DateAsc = 'date_ASC',
  DateAscNullsFirst = 'date_ASC_NULLS_FIRST',
  DateAscNullsLast = 'date_ASC_NULLS_LAST',
  DateDesc = 'date_DESC',
  DateDescNullsFirst = 'date_DESC_NULLS_FIRST',
  DateDescNullsLast = 'date_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  TotalFeeUsdAsc = 'totalFeeUSD_ASC',
  TotalFeeUsdAscNullsFirst = 'totalFeeUSD_ASC_NULLS_FIRST',
  TotalFeeUsdAscNullsLast = 'totalFeeUSD_ASC_NULLS_LAST',
  TotalFeeUsdDesc = 'totalFeeUSD_DESC',
  TotalFeeUsdDescNullsFirst = 'totalFeeUSD_DESC_NULLS_FIRST',
  TotalFeeUsdDescNullsLast = 'totalFeeUSD_DESC_NULLS_LAST',
  TotalLiquidityUsdAsc = 'totalLiquidityUSD_ASC',
  TotalLiquidityUsdAscNullsFirst = 'totalLiquidityUSD_ASC_NULLS_FIRST',
  TotalLiquidityUsdAscNullsLast = 'totalLiquidityUSD_ASC_NULLS_LAST',
  TotalLiquidityUsdDesc = 'totalLiquidityUSD_DESC',
  TotalLiquidityUsdDescNullsFirst = 'totalLiquidityUSD_DESC_NULLS_FIRST',
  TotalLiquidityUsdDescNullsLast = 'totalLiquidityUSD_DESC_NULLS_LAST',
  TotalVolumeUsdAsc = 'totalVolumeUSD_ASC',
  TotalVolumeUsdAscNullsFirst = 'totalVolumeUSD_ASC_NULLS_FIRST',
  TotalVolumeUsdAscNullsLast = 'totalVolumeUSD_ASC_NULLS_LAST',
  TotalVolumeUsdDesc = 'totalVolumeUSD_DESC',
  TotalVolumeUsdDescNullsFirst = 'totalVolumeUSD_DESC_NULLS_FIRST',
  TotalVolumeUsdDescNullsLast = 'totalVolumeUSD_DESC_NULLS_LAST'
}

export type FactoryDayDataWhereInput = {
  AND?: InputMaybe<Array<FactoryDayDataWhereInput>>;
  OR?: InputMaybe<Array<FactoryDayDataWhereInput>>;
  dailyFeeUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  dailyFeeUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  dailyFeeUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  dailyFeeUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  dailyFeeUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  dailyFeeUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  dailyFeeUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  dailyFeeUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  dailyFeeUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  dailyVolumeUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  dailyVolumeUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  dailyVolumeUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  dailyVolumeUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  dailyVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  dailyVolumeUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  dailyVolumeUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  dailyVolumeUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  dailyVolumeUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  date_eq?: InputMaybe<Scalars['DateTime']['input']>;
  date_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  date_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  date_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  totalFeeUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  totalFeeUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  totalFeeUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  totalFeeUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  totalFeeUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalFeeUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  totalFeeUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  totalFeeUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  totalFeeUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  totalLiquidityUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  totalLiquidityUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  totalLiquidityUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  totalVolumeUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  totalVolumeUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  totalVolumeUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  totalVolumeUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  totalVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalVolumeUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  totalVolumeUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  totalVolumeUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  totalVolumeUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type FactoryEdge = {
  __typename?: 'FactoryEdge';
  cursor: Scalars['String']['output'];
  node: Factory;
};

export enum FactoryOrderByInput {
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  MarketCountAsc = 'marketCount_ASC',
  MarketCountAscNullsFirst = 'marketCount_ASC_NULLS_FIRST',
  MarketCountAscNullsLast = 'marketCount_ASC_NULLS_LAST',
  MarketCountDesc = 'marketCount_DESC',
  MarketCountDescNullsFirst = 'marketCount_DESC_NULLS_FIRST',
  MarketCountDescNullsLast = 'marketCount_DESC_NULLS_LAST',
  TotalFeeUsdAsc = 'totalFeeUSD_ASC',
  TotalFeeUsdAscNullsFirst = 'totalFeeUSD_ASC_NULLS_FIRST',
  TotalFeeUsdAscNullsLast = 'totalFeeUSD_ASC_NULLS_LAST',
  TotalFeeUsdDesc = 'totalFeeUSD_DESC',
  TotalFeeUsdDescNullsFirst = 'totalFeeUSD_DESC_NULLS_FIRST',
  TotalFeeUsdDescNullsLast = 'totalFeeUSD_DESC_NULLS_LAST',
  TotalLiquidityUsdAsc = 'totalLiquidityUSD_ASC',
  TotalLiquidityUsdAscNullsFirst = 'totalLiquidityUSD_ASC_NULLS_FIRST',
  TotalLiquidityUsdAscNullsLast = 'totalLiquidityUSD_ASC_NULLS_LAST',
  TotalLiquidityUsdDesc = 'totalLiquidityUSD_DESC',
  TotalLiquidityUsdDescNullsFirst = 'totalLiquidityUSD_DESC_NULLS_FIRST',
  TotalLiquidityUsdDescNullsLast = 'totalLiquidityUSD_DESC_NULLS_LAST',
  TotalVolumeUsdAsc = 'totalVolumeUSD_ASC',
  TotalVolumeUsdAscNullsFirst = 'totalVolumeUSD_ASC_NULLS_FIRST',
  TotalVolumeUsdAscNullsLast = 'totalVolumeUSD_ASC_NULLS_LAST',
  TotalVolumeUsdDesc = 'totalVolumeUSD_DESC',
  TotalVolumeUsdDescNullsFirst = 'totalVolumeUSD_DESC_NULLS_FIRST',
  TotalVolumeUsdDescNullsLast = 'totalVolumeUSD_DESC_NULLS_LAST'
}

export type FactoryWhereInput = {
  AND?: InputMaybe<Array<FactoryWhereInput>>;
  OR?: InputMaybe<Array<FactoryWhereInput>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  marketCount_eq?: InputMaybe<Scalars['Int']['input']>;
  marketCount_gt?: InputMaybe<Scalars['Int']['input']>;
  marketCount_gte?: InputMaybe<Scalars['Int']['input']>;
  marketCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  marketCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  marketCount_lt?: InputMaybe<Scalars['Int']['input']>;
  marketCount_lte?: InputMaybe<Scalars['Int']['input']>;
  marketCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  marketCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalFeeUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  totalFeeUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  totalFeeUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  totalFeeUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  totalFeeUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalFeeUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  totalFeeUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  totalFeeUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  totalFeeUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  totalLiquidityUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  totalLiquidityUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  totalLiquidityUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  totalVolumeUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  totalVolumeUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  totalVolumeUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  totalVolumeUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  totalVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalVolumeUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  totalVolumeUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  totalVolumeUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  totalVolumeUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type Market = {
  __typename?: 'Market';
  burns: Array<Burn>;
  decimals: Scalars['Int']['output'];
  expiry: Scalars['BigDecimal']['output'];
  feeUSD: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  marketDayData: Array<MarketDayData>;
  marketHourData: Array<MarketHourData>;
  mints: Array<Mint>;
  name: Scalars['String']['output'];
  priceUSD: Scalars['Float']['output'];
  pt: Pt;
  reserveUSD: Scalars['Float']['output'];
  swaps: Array<Swap>;
  sy: Sy;
  symbol: Scalars['String']['output'];
  totalLp: Scalars['BigDecimal']['output'];
  totalPt: Scalars['BigDecimal']['output'];
  totalSy: Scalars['BigDecimal']['output'];
  volumeUSD: Scalars['Float']['output'];
  yt: Yt;
};


export type MarketBurnsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BurnOrderByInput>>;
  where?: InputMaybe<BurnWhereInput>;
};


export type MarketMarketDayDataArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MarketDayDataOrderByInput>>;
  where?: InputMaybe<MarketDayDataWhereInput>;
};


export type MarketMarketHourDataArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MarketHourDataOrderByInput>>;
  where?: InputMaybe<MarketHourDataWhereInput>;
};


export type MarketMintsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MintOrderByInput>>;
  where?: InputMaybe<MintWhereInput>;
};


export type MarketSwapsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SwapOrderByInput>>;
  where?: InputMaybe<SwapWhereInput>;
};

export type MarketDayData = {
  __typename?: 'MarketDayData';
  baseAssetPrice: Scalars['Float']['output'];
  dailyFeeUSD: Scalars['Float']['output'];
  dailyVolumeUSD: Scalars['Float']['output'];
  date: Scalars['DateTime']['output'];
  fixedROI: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  impliedAPY: Scalars['Float']['output'];
  longYieldROI: Scalars['Float']['output'];
  market: Market;
  ptPrice: Scalars['Float']['output'];
  reserveUSD: Scalars['Float']['output'];
  totalLp: Scalars['BigDecimal']['output'];
  totalPt: Scalars['BigDecimal']['output'];
  totalSy: Scalars['BigDecimal']['output'];
  underlyingAPY: Scalars['Float']['output'];
  yieldTokenPrice: Scalars['Float']['output'];
  ytPrice: Scalars['Float']['output'];
};

export type MarketDayDataConnection = {
  __typename?: 'MarketDayDataConnection';
  edges: Array<MarketDayDataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type MarketDayDataEdge = {
  __typename?: 'MarketDayDataEdge';
  cursor: Scalars['String']['output'];
  node: MarketDayData;
};

export enum MarketDayDataOrderByInput {
  BaseAssetPriceAsc = 'baseAssetPrice_ASC',
  BaseAssetPriceAscNullsFirst = 'baseAssetPrice_ASC_NULLS_FIRST',
  BaseAssetPriceAscNullsLast = 'baseAssetPrice_ASC_NULLS_LAST',
  BaseAssetPriceDesc = 'baseAssetPrice_DESC',
  BaseAssetPriceDescNullsFirst = 'baseAssetPrice_DESC_NULLS_FIRST',
  BaseAssetPriceDescNullsLast = 'baseAssetPrice_DESC_NULLS_LAST',
  DailyFeeUsdAsc = 'dailyFeeUSD_ASC',
  DailyFeeUsdAscNullsFirst = 'dailyFeeUSD_ASC_NULLS_FIRST',
  DailyFeeUsdAscNullsLast = 'dailyFeeUSD_ASC_NULLS_LAST',
  DailyFeeUsdDesc = 'dailyFeeUSD_DESC',
  DailyFeeUsdDescNullsFirst = 'dailyFeeUSD_DESC_NULLS_FIRST',
  DailyFeeUsdDescNullsLast = 'dailyFeeUSD_DESC_NULLS_LAST',
  DailyVolumeUsdAsc = 'dailyVolumeUSD_ASC',
  DailyVolumeUsdAscNullsFirst = 'dailyVolumeUSD_ASC_NULLS_FIRST',
  DailyVolumeUsdAscNullsLast = 'dailyVolumeUSD_ASC_NULLS_LAST',
  DailyVolumeUsdDesc = 'dailyVolumeUSD_DESC',
  DailyVolumeUsdDescNullsFirst = 'dailyVolumeUSD_DESC_NULLS_FIRST',
  DailyVolumeUsdDescNullsLast = 'dailyVolumeUSD_DESC_NULLS_LAST',
  DateAsc = 'date_ASC',
  DateAscNullsFirst = 'date_ASC_NULLS_FIRST',
  DateAscNullsLast = 'date_ASC_NULLS_LAST',
  DateDesc = 'date_DESC',
  DateDescNullsFirst = 'date_DESC_NULLS_FIRST',
  DateDescNullsLast = 'date_DESC_NULLS_LAST',
  FixedRoiAsc = 'fixedROI_ASC',
  FixedRoiAscNullsFirst = 'fixedROI_ASC_NULLS_FIRST',
  FixedRoiAscNullsLast = 'fixedROI_ASC_NULLS_LAST',
  FixedRoiDesc = 'fixedROI_DESC',
  FixedRoiDescNullsFirst = 'fixedROI_DESC_NULLS_FIRST',
  FixedRoiDescNullsLast = 'fixedROI_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  ImpliedApyAsc = 'impliedAPY_ASC',
  ImpliedApyAscNullsFirst = 'impliedAPY_ASC_NULLS_FIRST',
  ImpliedApyAscNullsLast = 'impliedAPY_ASC_NULLS_LAST',
  ImpliedApyDesc = 'impliedAPY_DESC',
  ImpliedApyDescNullsFirst = 'impliedAPY_DESC_NULLS_FIRST',
  ImpliedApyDescNullsLast = 'impliedAPY_DESC_NULLS_LAST',
  LongYieldRoiAsc = 'longYieldROI_ASC',
  LongYieldRoiAscNullsFirst = 'longYieldROI_ASC_NULLS_FIRST',
  LongYieldRoiAscNullsLast = 'longYieldROI_ASC_NULLS_LAST',
  LongYieldRoiDesc = 'longYieldROI_DESC',
  LongYieldRoiDescNullsFirst = 'longYieldROI_DESC_NULLS_FIRST',
  LongYieldRoiDescNullsLast = 'longYieldROI_DESC_NULLS_LAST',
  MarketDecimalsAsc = 'market_decimals_ASC',
  MarketDecimalsAscNullsFirst = 'market_decimals_ASC_NULLS_FIRST',
  MarketDecimalsAscNullsLast = 'market_decimals_ASC_NULLS_LAST',
  MarketDecimalsDesc = 'market_decimals_DESC',
  MarketDecimalsDescNullsFirst = 'market_decimals_DESC_NULLS_FIRST',
  MarketDecimalsDescNullsLast = 'market_decimals_DESC_NULLS_LAST',
  MarketExpiryAsc = 'market_expiry_ASC',
  MarketExpiryAscNullsFirst = 'market_expiry_ASC_NULLS_FIRST',
  MarketExpiryAscNullsLast = 'market_expiry_ASC_NULLS_LAST',
  MarketExpiryDesc = 'market_expiry_DESC',
  MarketExpiryDescNullsFirst = 'market_expiry_DESC_NULLS_FIRST',
  MarketExpiryDescNullsLast = 'market_expiry_DESC_NULLS_LAST',
  MarketFeeUsdAsc = 'market_feeUSD_ASC',
  MarketFeeUsdAscNullsFirst = 'market_feeUSD_ASC_NULLS_FIRST',
  MarketFeeUsdAscNullsLast = 'market_feeUSD_ASC_NULLS_LAST',
  MarketFeeUsdDesc = 'market_feeUSD_DESC',
  MarketFeeUsdDescNullsFirst = 'market_feeUSD_DESC_NULLS_FIRST',
  MarketFeeUsdDescNullsLast = 'market_feeUSD_DESC_NULLS_LAST',
  MarketIdAsc = 'market_id_ASC',
  MarketIdAscNullsFirst = 'market_id_ASC_NULLS_FIRST',
  MarketIdAscNullsLast = 'market_id_ASC_NULLS_LAST',
  MarketIdDesc = 'market_id_DESC',
  MarketIdDescNullsFirst = 'market_id_DESC_NULLS_FIRST',
  MarketIdDescNullsLast = 'market_id_DESC_NULLS_LAST',
  MarketNameAsc = 'market_name_ASC',
  MarketNameAscNullsFirst = 'market_name_ASC_NULLS_FIRST',
  MarketNameAscNullsLast = 'market_name_ASC_NULLS_LAST',
  MarketNameDesc = 'market_name_DESC',
  MarketNameDescNullsFirst = 'market_name_DESC_NULLS_FIRST',
  MarketNameDescNullsLast = 'market_name_DESC_NULLS_LAST',
  MarketPriceUsdAsc = 'market_priceUSD_ASC',
  MarketPriceUsdAscNullsFirst = 'market_priceUSD_ASC_NULLS_FIRST',
  MarketPriceUsdAscNullsLast = 'market_priceUSD_ASC_NULLS_LAST',
  MarketPriceUsdDesc = 'market_priceUSD_DESC',
  MarketPriceUsdDescNullsFirst = 'market_priceUSD_DESC_NULLS_FIRST',
  MarketPriceUsdDescNullsLast = 'market_priceUSD_DESC_NULLS_LAST',
  MarketReserveUsdAsc = 'market_reserveUSD_ASC',
  MarketReserveUsdAscNullsFirst = 'market_reserveUSD_ASC_NULLS_FIRST',
  MarketReserveUsdAscNullsLast = 'market_reserveUSD_ASC_NULLS_LAST',
  MarketReserveUsdDesc = 'market_reserveUSD_DESC',
  MarketReserveUsdDescNullsFirst = 'market_reserveUSD_DESC_NULLS_FIRST',
  MarketReserveUsdDescNullsLast = 'market_reserveUSD_DESC_NULLS_LAST',
  MarketSymbolAsc = 'market_symbol_ASC',
  MarketSymbolAscNullsFirst = 'market_symbol_ASC_NULLS_FIRST',
  MarketSymbolAscNullsLast = 'market_symbol_ASC_NULLS_LAST',
  MarketSymbolDesc = 'market_symbol_DESC',
  MarketSymbolDescNullsFirst = 'market_symbol_DESC_NULLS_FIRST',
  MarketSymbolDescNullsLast = 'market_symbol_DESC_NULLS_LAST',
  MarketTotalLpAsc = 'market_totalLp_ASC',
  MarketTotalLpAscNullsFirst = 'market_totalLp_ASC_NULLS_FIRST',
  MarketTotalLpAscNullsLast = 'market_totalLp_ASC_NULLS_LAST',
  MarketTotalLpDesc = 'market_totalLp_DESC',
  MarketTotalLpDescNullsFirst = 'market_totalLp_DESC_NULLS_FIRST',
  MarketTotalLpDescNullsLast = 'market_totalLp_DESC_NULLS_LAST',
  MarketTotalPtAsc = 'market_totalPt_ASC',
  MarketTotalPtAscNullsFirst = 'market_totalPt_ASC_NULLS_FIRST',
  MarketTotalPtAscNullsLast = 'market_totalPt_ASC_NULLS_LAST',
  MarketTotalPtDesc = 'market_totalPt_DESC',
  MarketTotalPtDescNullsFirst = 'market_totalPt_DESC_NULLS_FIRST',
  MarketTotalPtDescNullsLast = 'market_totalPt_DESC_NULLS_LAST',
  MarketTotalSyAsc = 'market_totalSy_ASC',
  MarketTotalSyAscNullsFirst = 'market_totalSy_ASC_NULLS_FIRST',
  MarketTotalSyAscNullsLast = 'market_totalSy_ASC_NULLS_LAST',
  MarketTotalSyDesc = 'market_totalSy_DESC',
  MarketTotalSyDescNullsFirst = 'market_totalSy_DESC_NULLS_FIRST',
  MarketTotalSyDescNullsLast = 'market_totalSy_DESC_NULLS_LAST',
  MarketVolumeUsdAsc = 'market_volumeUSD_ASC',
  MarketVolumeUsdAscNullsFirst = 'market_volumeUSD_ASC_NULLS_FIRST',
  MarketVolumeUsdAscNullsLast = 'market_volumeUSD_ASC_NULLS_LAST',
  MarketVolumeUsdDesc = 'market_volumeUSD_DESC',
  MarketVolumeUsdDescNullsFirst = 'market_volumeUSD_DESC_NULLS_FIRST',
  MarketVolumeUsdDescNullsLast = 'market_volumeUSD_DESC_NULLS_LAST',
  PtPriceAsc = 'ptPrice_ASC',
  PtPriceAscNullsFirst = 'ptPrice_ASC_NULLS_FIRST',
  PtPriceAscNullsLast = 'ptPrice_ASC_NULLS_LAST',
  PtPriceDesc = 'ptPrice_DESC',
  PtPriceDescNullsFirst = 'ptPrice_DESC_NULLS_FIRST',
  PtPriceDescNullsLast = 'ptPrice_DESC_NULLS_LAST',
  ReserveUsdAsc = 'reserveUSD_ASC',
  ReserveUsdAscNullsFirst = 'reserveUSD_ASC_NULLS_FIRST',
  ReserveUsdAscNullsLast = 'reserveUSD_ASC_NULLS_LAST',
  ReserveUsdDesc = 'reserveUSD_DESC',
  ReserveUsdDescNullsFirst = 'reserveUSD_DESC_NULLS_FIRST',
  ReserveUsdDescNullsLast = 'reserveUSD_DESC_NULLS_LAST',
  TotalLpAsc = 'totalLp_ASC',
  TotalLpAscNullsFirst = 'totalLp_ASC_NULLS_FIRST',
  TotalLpAscNullsLast = 'totalLp_ASC_NULLS_LAST',
  TotalLpDesc = 'totalLp_DESC',
  TotalLpDescNullsFirst = 'totalLp_DESC_NULLS_FIRST',
  TotalLpDescNullsLast = 'totalLp_DESC_NULLS_LAST',
  TotalPtAsc = 'totalPt_ASC',
  TotalPtAscNullsFirst = 'totalPt_ASC_NULLS_FIRST',
  TotalPtAscNullsLast = 'totalPt_ASC_NULLS_LAST',
  TotalPtDesc = 'totalPt_DESC',
  TotalPtDescNullsFirst = 'totalPt_DESC_NULLS_FIRST',
  TotalPtDescNullsLast = 'totalPt_DESC_NULLS_LAST',
  TotalSyAsc = 'totalSy_ASC',
  TotalSyAscNullsFirst = 'totalSy_ASC_NULLS_FIRST',
  TotalSyAscNullsLast = 'totalSy_ASC_NULLS_LAST',
  TotalSyDesc = 'totalSy_DESC',
  TotalSyDescNullsFirst = 'totalSy_DESC_NULLS_FIRST',
  TotalSyDescNullsLast = 'totalSy_DESC_NULLS_LAST',
  UnderlyingApyAsc = 'underlyingAPY_ASC',
  UnderlyingApyAscNullsFirst = 'underlyingAPY_ASC_NULLS_FIRST',
  UnderlyingApyAscNullsLast = 'underlyingAPY_ASC_NULLS_LAST',
  UnderlyingApyDesc = 'underlyingAPY_DESC',
  UnderlyingApyDescNullsFirst = 'underlyingAPY_DESC_NULLS_FIRST',
  UnderlyingApyDescNullsLast = 'underlyingAPY_DESC_NULLS_LAST',
  YieldTokenPriceAsc = 'yieldTokenPrice_ASC',
  YieldTokenPriceAscNullsFirst = 'yieldTokenPrice_ASC_NULLS_FIRST',
  YieldTokenPriceAscNullsLast = 'yieldTokenPrice_ASC_NULLS_LAST',
  YieldTokenPriceDesc = 'yieldTokenPrice_DESC',
  YieldTokenPriceDescNullsFirst = 'yieldTokenPrice_DESC_NULLS_FIRST',
  YieldTokenPriceDescNullsLast = 'yieldTokenPrice_DESC_NULLS_LAST',
  YtPriceAsc = 'ytPrice_ASC',
  YtPriceAscNullsFirst = 'ytPrice_ASC_NULLS_FIRST',
  YtPriceAscNullsLast = 'ytPrice_ASC_NULLS_LAST',
  YtPriceDesc = 'ytPrice_DESC',
  YtPriceDescNullsFirst = 'ytPrice_DESC_NULLS_FIRST',
  YtPriceDescNullsLast = 'ytPrice_DESC_NULLS_LAST'
}

export type MarketDayDataWhereInput = {
  AND?: InputMaybe<Array<MarketDayDataWhereInput>>;
  OR?: InputMaybe<Array<MarketDayDataWhereInput>>;
  baseAssetPrice_eq?: InputMaybe<Scalars['Float']['input']>;
  baseAssetPrice_gt?: InputMaybe<Scalars['Float']['input']>;
  baseAssetPrice_gte?: InputMaybe<Scalars['Float']['input']>;
  baseAssetPrice_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  baseAssetPrice_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  baseAssetPrice_lt?: InputMaybe<Scalars['Float']['input']>;
  baseAssetPrice_lte?: InputMaybe<Scalars['Float']['input']>;
  baseAssetPrice_not_eq?: InputMaybe<Scalars['Float']['input']>;
  baseAssetPrice_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  dailyFeeUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  dailyFeeUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  dailyFeeUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  dailyFeeUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  dailyFeeUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  dailyFeeUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  dailyFeeUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  dailyFeeUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  dailyFeeUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  dailyVolumeUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  dailyVolumeUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  dailyVolumeUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  dailyVolumeUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  dailyVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  dailyVolumeUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  dailyVolumeUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  dailyVolumeUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  dailyVolumeUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  date_eq?: InputMaybe<Scalars['DateTime']['input']>;
  date_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  date_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  date_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  fixedROI_eq?: InputMaybe<Scalars['Float']['input']>;
  fixedROI_gt?: InputMaybe<Scalars['Float']['input']>;
  fixedROI_gte?: InputMaybe<Scalars['Float']['input']>;
  fixedROI_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  fixedROI_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  fixedROI_lt?: InputMaybe<Scalars['Float']['input']>;
  fixedROI_lte?: InputMaybe<Scalars['Float']['input']>;
  fixedROI_not_eq?: InputMaybe<Scalars['Float']['input']>;
  fixedROI_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  impliedAPY_eq?: InputMaybe<Scalars['Float']['input']>;
  impliedAPY_gt?: InputMaybe<Scalars['Float']['input']>;
  impliedAPY_gte?: InputMaybe<Scalars['Float']['input']>;
  impliedAPY_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  impliedAPY_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  impliedAPY_lt?: InputMaybe<Scalars['Float']['input']>;
  impliedAPY_lte?: InputMaybe<Scalars['Float']['input']>;
  impliedAPY_not_eq?: InputMaybe<Scalars['Float']['input']>;
  impliedAPY_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  longYieldROI_eq?: InputMaybe<Scalars['Float']['input']>;
  longYieldROI_gt?: InputMaybe<Scalars['Float']['input']>;
  longYieldROI_gte?: InputMaybe<Scalars['Float']['input']>;
  longYieldROI_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  longYieldROI_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  longYieldROI_lt?: InputMaybe<Scalars['Float']['input']>;
  longYieldROI_lte?: InputMaybe<Scalars['Float']['input']>;
  longYieldROI_not_eq?: InputMaybe<Scalars['Float']['input']>;
  longYieldROI_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  market?: InputMaybe<MarketWhereInput>;
  market_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  ptPrice_eq?: InputMaybe<Scalars['Float']['input']>;
  ptPrice_gt?: InputMaybe<Scalars['Float']['input']>;
  ptPrice_gte?: InputMaybe<Scalars['Float']['input']>;
  ptPrice_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  ptPrice_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  ptPrice_lt?: InputMaybe<Scalars['Float']['input']>;
  ptPrice_lte?: InputMaybe<Scalars['Float']['input']>;
  ptPrice_not_eq?: InputMaybe<Scalars['Float']['input']>;
  ptPrice_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  reserveUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  reserveUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  reserveUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  totalLp_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLp_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalLp_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalPt_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalPt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalPt_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSy_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSy_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalSy_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  underlyingAPY_eq?: InputMaybe<Scalars['Float']['input']>;
  underlyingAPY_gt?: InputMaybe<Scalars['Float']['input']>;
  underlyingAPY_gte?: InputMaybe<Scalars['Float']['input']>;
  underlyingAPY_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  underlyingAPY_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  underlyingAPY_lt?: InputMaybe<Scalars['Float']['input']>;
  underlyingAPY_lte?: InputMaybe<Scalars['Float']['input']>;
  underlyingAPY_not_eq?: InputMaybe<Scalars['Float']['input']>;
  underlyingAPY_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  yieldTokenPrice_eq?: InputMaybe<Scalars['Float']['input']>;
  yieldTokenPrice_gt?: InputMaybe<Scalars['Float']['input']>;
  yieldTokenPrice_gte?: InputMaybe<Scalars['Float']['input']>;
  yieldTokenPrice_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  yieldTokenPrice_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  yieldTokenPrice_lt?: InputMaybe<Scalars['Float']['input']>;
  yieldTokenPrice_lte?: InputMaybe<Scalars['Float']['input']>;
  yieldTokenPrice_not_eq?: InputMaybe<Scalars['Float']['input']>;
  yieldTokenPrice_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  ytPrice_eq?: InputMaybe<Scalars['Float']['input']>;
  ytPrice_gt?: InputMaybe<Scalars['Float']['input']>;
  ytPrice_gte?: InputMaybe<Scalars['Float']['input']>;
  ytPrice_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  ytPrice_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  ytPrice_lt?: InputMaybe<Scalars['Float']['input']>;
  ytPrice_lte?: InputMaybe<Scalars['Float']['input']>;
  ytPrice_not_eq?: InputMaybe<Scalars['Float']['input']>;
  ytPrice_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type MarketEdge = {
  __typename?: 'MarketEdge';
  cursor: Scalars['String']['output'];
  node: Market;
};

export type MarketHourData = {
  __typename?: 'MarketHourData';
  hourStartUnix: Scalars['BigInt']['output'];
  hourlyFeeUSD: Scalars['Float']['output'];
  hourlyVolumeUSD: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  market: Market;
  reserveUSD: Scalars['Float']['output'];
  totalLp: Scalars['BigDecimal']['output'];
  totalPt: Scalars['BigDecimal']['output'];
  totalSy: Scalars['BigDecimal']['output'];
};

export type MarketHourDataConnection = {
  __typename?: 'MarketHourDataConnection';
  edges: Array<MarketHourDataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type MarketHourDataEdge = {
  __typename?: 'MarketHourDataEdge';
  cursor: Scalars['String']['output'];
  node: MarketHourData;
};

export enum MarketHourDataOrderByInput {
  HourStartUnixAsc = 'hourStartUnix_ASC',
  HourStartUnixAscNullsFirst = 'hourStartUnix_ASC_NULLS_FIRST',
  HourStartUnixAscNullsLast = 'hourStartUnix_ASC_NULLS_LAST',
  HourStartUnixDesc = 'hourStartUnix_DESC',
  HourStartUnixDescNullsFirst = 'hourStartUnix_DESC_NULLS_FIRST',
  HourStartUnixDescNullsLast = 'hourStartUnix_DESC_NULLS_LAST',
  HourlyFeeUsdAsc = 'hourlyFeeUSD_ASC',
  HourlyFeeUsdAscNullsFirst = 'hourlyFeeUSD_ASC_NULLS_FIRST',
  HourlyFeeUsdAscNullsLast = 'hourlyFeeUSD_ASC_NULLS_LAST',
  HourlyFeeUsdDesc = 'hourlyFeeUSD_DESC',
  HourlyFeeUsdDescNullsFirst = 'hourlyFeeUSD_DESC_NULLS_FIRST',
  HourlyFeeUsdDescNullsLast = 'hourlyFeeUSD_DESC_NULLS_LAST',
  HourlyVolumeUsdAsc = 'hourlyVolumeUSD_ASC',
  HourlyVolumeUsdAscNullsFirst = 'hourlyVolumeUSD_ASC_NULLS_FIRST',
  HourlyVolumeUsdAscNullsLast = 'hourlyVolumeUSD_ASC_NULLS_LAST',
  HourlyVolumeUsdDesc = 'hourlyVolumeUSD_DESC',
  HourlyVolumeUsdDescNullsFirst = 'hourlyVolumeUSD_DESC_NULLS_FIRST',
  HourlyVolumeUsdDescNullsLast = 'hourlyVolumeUSD_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  MarketDecimalsAsc = 'market_decimals_ASC',
  MarketDecimalsAscNullsFirst = 'market_decimals_ASC_NULLS_FIRST',
  MarketDecimalsAscNullsLast = 'market_decimals_ASC_NULLS_LAST',
  MarketDecimalsDesc = 'market_decimals_DESC',
  MarketDecimalsDescNullsFirst = 'market_decimals_DESC_NULLS_FIRST',
  MarketDecimalsDescNullsLast = 'market_decimals_DESC_NULLS_LAST',
  MarketExpiryAsc = 'market_expiry_ASC',
  MarketExpiryAscNullsFirst = 'market_expiry_ASC_NULLS_FIRST',
  MarketExpiryAscNullsLast = 'market_expiry_ASC_NULLS_LAST',
  MarketExpiryDesc = 'market_expiry_DESC',
  MarketExpiryDescNullsFirst = 'market_expiry_DESC_NULLS_FIRST',
  MarketExpiryDescNullsLast = 'market_expiry_DESC_NULLS_LAST',
  MarketFeeUsdAsc = 'market_feeUSD_ASC',
  MarketFeeUsdAscNullsFirst = 'market_feeUSD_ASC_NULLS_FIRST',
  MarketFeeUsdAscNullsLast = 'market_feeUSD_ASC_NULLS_LAST',
  MarketFeeUsdDesc = 'market_feeUSD_DESC',
  MarketFeeUsdDescNullsFirst = 'market_feeUSD_DESC_NULLS_FIRST',
  MarketFeeUsdDescNullsLast = 'market_feeUSD_DESC_NULLS_LAST',
  MarketIdAsc = 'market_id_ASC',
  MarketIdAscNullsFirst = 'market_id_ASC_NULLS_FIRST',
  MarketIdAscNullsLast = 'market_id_ASC_NULLS_LAST',
  MarketIdDesc = 'market_id_DESC',
  MarketIdDescNullsFirst = 'market_id_DESC_NULLS_FIRST',
  MarketIdDescNullsLast = 'market_id_DESC_NULLS_LAST',
  MarketNameAsc = 'market_name_ASC',
  MarketNameAscNullsFirst = 'market_name_ASC_NULLS_FIRST',
  MarketNameAscNullsLast = 'market_name_ASC_NULLS_LAST',
  MarketNameDesc = 'market_name_DESC',
  MarketNameDescNullsFirst = 'market_name_DESC_NULLS_FIRST',
  MarketNameDescNullsLast = 'market_name_DESC_NULLS_LAST',
  MarketPriceUsdAsc = 'market_priceUSD_ASC',
  MarketPriceUsdAscNullsFirst = 'market_priceUSD_ASC_NULLS_FIRST',
  MarketPriceUsdAscNullsLast = 'market_priceUSD_ASC_NULLS_LAST',
  MarketPriceUsdDesc = 'market_priceUSD_DESC',
  MarketPriceUsdDescNullsFirst = 'market_priceUSD_DESC_NULLS_FIRST',
  MarketPriceUsdDescNullsLast = 'market_priceUSD_DESC_NULLS_LAST',
  MarketReserveUsdAsc = 'market_reserveUSD_ASC',
  MarketReserveUsdAscNullsFirst = 'market_reserveUSD_ASC_NULLS_FIRST',
  MarketReserveUsdAscNullsLast = 'market_reserveUSD_ASC_NULLS_LAST',
  MarketReserveUsdDesc = 'market_reserveUSD_DESC',
  MarketReserveUsdDescNullsFirst = 'market_reserveUSD_DESC_NULLS_FIRST',
  MarketReserveUsdDescNullsLast = 'market_reserveUSD_DESC_NULLS_LAST',
  MarketSymbolAsc = 'market_symbol_ASC',
  MarketSymbolAscNullsFirst = 'market_symbol_ASC_NULLS_FIRST',
  MarketSymbolAscNullsLast = 'market_symbol_ASC_NULLS_LAST',
  MarketSymbolDesc = 'market_symbol_DESC',
  MarketSymbolDescNullsFirst = 'market_symbol_DESC_NULLS_FIRST',
  MarketSymbolDescNullsLast = 'market_symbol_DESC_NULLS_LAST',
  MarketTotalLpAsc = 'market_totalLp_ASC',
  MarketTotalLpAscNullsFirst = 'market_totalLp_ASC_NULLS_FIRST',
  MarketTotalLpAscNullsLast = 'market_totalLp_ASC_NULLS_LAST',
  MarketTotalLpDesc = 'market_totalLp_DESC',
  MarketTotalLpDescNullsFirst = 'market_totalLp_DESC_NULLS_FIRST',
  MarketTotalLpDescNullsLast = 'market_totalLp_DESC_NULLS_LAST',
  MarketTotalPtAsc = 'market_totalPt_ASC',
  MarketTotalPtAscNullsFirst = 'market_totalPt_ASC_NULLS_FIRST',
  MarketTotalPtAscNullsLast = 'market_totalPt_ASC_NULLS_LAST',
  MarketTotalPtDesc = 'market_totalPt_DESC',
  MarketTotalPtDescNullsFirst = 'market_totalPt_DESC_NULLS_FIRST',
  MarketTotalPtDescNullsLast = 'market_totalPt_DESC_NULLS_LAST',
  MarketTotalSyAsc = 'market_totalSy_ASC',
  MarketTotalSyAscNullsFirst = 'market_totalSy_ASC_NULLS_FIRST',
  MarketTotalSyAscNullsLast = 'market_totalSy_ASC_NULLS_LAST',
  MarketTotalSyDesc = 'market_totalSy_DESC',
  MarketTotalSyDescNullsFirst = 'market_totalSy_DESC_NULLS_FIRST',
  MarketTotalSyDescNullsLast = 'market_totalSy_DESC_NULLS_LAST',
  MarketVolumeUsdAsc = 'market_volumeUSD_ASC',
  MarketVolumeUsdAscNullsFirst = 'market_volumeUSD_ASC_NULLS_FIRST',
  MarketVolumeUsdAscNullsLast = 'market_volumeUSD_ASC_NULLS_LAST',
  MarketVolumeUsdDesc = 'market_volumeUSD_DESC',
  MarketVolumeUsdDescNullsFirst = 'market_volumeUSD_DESC_NULLS_FIRST',
  MarketVolumeUsdDescNullsLast = 'market_volumeUSD_DESC_NULLS_LAST',
  ReserveUsdAsc = 'reserveUSD_ASC',
  ReserveUsdAscNullsFirst = 'reserveUSD_ASC_NULLS_FIRST',
  ReserveUsdAscNullsLast = 'reserveUSD_ASC_NULLS_LAST',
  ReserveUsdDesc = 'reserveUSD_DESC',
  ReserveUsdDescNullsFirst = 'reserveUSD_DESC_NULLS_FIRST',
  ReserveUsdDescNullsLast = 'reserveUSD_DESC_NULLS_LAST',
  TotalLpAsc = 'totalLp_ASC',
  TotalLpAscNullsFirst = 'totalLp_ASC_NULLS_FIRST',
  TotalLpAscNullsLast = 'totalLp_ASC_NULLS_LAST',
  TotalLpDesc = 'totalLp_DESC',
  TotalLpDescNullsFirst = 'totalLp_DESC_NULLS_FIRST',
  TotalLpDescNullsLast = 'totalLp_DESC_NULLS_LAST',
  TotalPtAsc = 'totalPt_ASC',
  TotalPtAscNullsFirst = 'totalPt_ASC_NULLS_FIRST',
  TotalPtAscNullsLast = 'totalPt_ASC_NULLS_LAST',
  TotalPtDesc = 'totalPt_DESC',
  TotalPtDescNullsFirst = 'totalPt_DESC_NULLS_FIRST',
  TotalPtDescNullsLast = 'totalPt_DESC_NULLS_LAST',
  TotalSyAsc = 'totalSy_ASC',
  TotalSyAscNullsFirst = 'totalSy_ASC_NULLS_FIRST',
  TotalSyAscNullsLast = 'totalSy_ASC_NULLS_LAST',
  TotalSyDesc = 'totalSy_DESC',
  TotalSyDescNullsFirst = 'totalSy_DESC_NULLS_FIRST',
  TotalSyDescNullsLast = 'totalSy_DESC_NULLS_LAST'
}

export type MarketHourDataWhereInput = {
  AND?: InputMaybe<Array<MarketHourDataWhereInput>>;
  OR?: InputMaybe<Array<MarketHourDataWhereInput>>;
  hourStartUnix_eq?: InputMaybe<Scalars['BigInt']['input']>;
  hourStartUnix_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourStartUnix_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourStartUnix_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourStartUnix_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hourStartUnix_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourStartUnix_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourStartUnix_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  hourStartUnix_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyFeeUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  hourlyFeeUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  hourlyFeeUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  hourlyFeeUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  hourlyFeeUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hourlyFeeUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  hourlyFeeUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  hourlyFeeUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  hourlyFeeUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  hourlyVolumeUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  hourlyVolumeUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  hourlyVolumeUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  hourlyVolumeUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  hourlyVolumeUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hourlyVolumeUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  hourlyVolumeUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  hourlyVolumeUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  hourlyVolumeUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  market?: InputMaybe<MarketWhereInput>;
  market_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  reserveUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  reserveUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  reserveUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  totalLp_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLp_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalLp_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalPt_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalPt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalPt_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSy_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSy_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalSy_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum MarketOrderByInput {
  DecimalsAsc = 'decimals_ASC',
  DecimalsAscNullsFirst = 'decimals_ASC_NULLS_FIRST',
  DecimalsAscNullsLast = 'decimals_ASC_NULLS_LAST',
  DecimalsDesc = 'decimals_DESC',
  DecimalsDescNullsFirst = 'decimals_DESC_NULLS_FIRST',
  DecimalsDescNullsLast = 'decimals_DESC_NULLS_LAST',
  ExpiryAsc = 'expiry_ASC',
  ExpiryAscNullsFirst = 'expiry_ASC_NULLS_FIRST',
  ExpiryAscNullsLast = 'expiry_ASC_NULLS_LAST',
  ExpiryDesc = 'expiry_DESC',
  ExpiryDescNullsFirst = 'expiry_DESC_NULLS_FIRST',
  ExpiryDescNullsLast = 'expiry_DESC_NULLS_LAST',
  FeeUsdAsc = 'feeUSD_ASC',
  FeeUsdAscNullsFirst = 'feeUSD_ASC_NULLS_FIRST',
  FeeUsdAscNullsLast = 'feeUSD_ASC_NULLS_LAST',
  FeeUsdDesc = 'feeUSD_DESC',
  FeeUsdDescNullsFirst = 'feeUSD_DESC_NULLS_FIRST',
  FeeUsdDescNullsLast = 'feeUSD_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameAscNullsLast = 'name_ASC_NULLS_LAST',
  NameDesc = 'name_DESC',
  NameDescNullsFirst = 'name_DESC_NULLS_FIRST',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  PriceUsdAsc = 'priceUSD_ASC',
  PriceUsdAscNullsFirst = 'priceUSD_ASC_NULLS_FIRST',
  PriceUsdAscNullsLast = 'priceUSD_ASC_NULLS_LAST',
  PriceUsdDesc = 'priceUSD_DESC',
  PriceUsdDescNullsFirst = 'priceUSD_DESC_NULLS_FIRST',
  PriceUsdDescNullsLast = 'priceUSD_DESC_NULLS_LAST',
  PtDecimalsAsc = 'pt_decimals_ASC',
  PtDecimalsAscNullsFirst = 'pt_decimals_ASC_NULLS_FIRST',
  PtDecimalsAscNullsLast = 'pt_decimals_ASC_NULLS_LAST',
  PtDecimalsDesc = 'pt_decimals_DESC',
  PtDecimalsDescNullsFirst = 'pt_decimals_DESC_NULLS_FIRST',
  PtDecimalsDescNullsLast = 'pt_decimals_DESC_NULLS_LAST',
  PtIdAsc = 'pt_id_ASC',
  PtIdAscNullsFirst = 'pt_id_ASC_NULLS_FIRST',
  PtIdAscNullsLast = 'pt_id_ASC_NULLS_LAST',
  PtIdDesc = 'pt_id_DESC',
  PtIdDescNullsFirst = 'pt_id_DESC_NULLS_FIRST',
  PtIdDescNullsLast = 'pt_id_DESC_NULLS_LAST',
  PtNameAsc = 'pt_name_ASC',
  PtNameAscNullsFirst = 'pt_name_ASC_NULLS_FIRST',
  PtNameAscNullsLast = 'pt_name_ASC_NULLS_LAST',
  PtNameDesc = 'pt_name_DESC',
  PtNameDescNullsFirst = 'pt_name_DESC_NULLS_FIRST',
  PtNameDescNullsLast = 'pt_name_DESC_NULLS_LAST',
  PtPriceUsdAsc = 'pt_priceUSD_ASC',
  PtPriceUsdAscNullsFirst = 'pt_priceUSD_ASC_NULLS_FIRST',
  PtPriceUsdAscNullsLast = 'pt_priceUSD_ASC_NULLS_LAST',
  PtPriceUsdDesc = 'pt_priceUSD_DESC',
  PtPriceUsdDescNullsFirst = 'pt_priceUSD_DESC_NULLS_FIRST',
  PtPriceUsdDescNullsLast = 'pt_priceUSD_DESC_NULLS_LAST',
  PtSymbolAsc = 'pt_symbol_ASC',
  PtSymbolAscNullsFirst = 'pt_symbol_ASC_NULLS_FIRST',
  PtSymbolAscNullsLast = 'pt_symbol_ASC_NULLS_LAST',
  PtSymbolDesc = 'pt_symbol_DESC',
  PtSymbolDescNullsFirst = 'pt_symbol_DESC_NULLS_FIRST',
  PtSymbolDescNullsLast = 'pt_symbol_DESC_NULLS_LAST',
  ReserveUsdAsc = 'reserveUSD_ASC',
  ReserveUsdAscNullsFirst = 'reserveUSD_ASC_NULLS_FIRST',
  ReserveUsdAscNullsLast = 'reserveUSD_ASC_NULLS_LAST',
  ReserveUsdDesc = 'reserveUSD_DESC',
  ReserveUsdDescNullsFirst = 'reserveUSD_DESC_NULLS_FIRST',
  ReserveUsdDescNullsLast = 'reserveUSD_DESC_NULLS_LAST',
  SyDecimalsAsc = 'sy_decimals_ASC',
  SyDecimalsAscNullsFirst = 'sy_decimals_ASC_NULLS_FIRST',
  SyDecimalsAscNullsLast = 'sy_decimals_ASC_NULLS_LAST',
  SyDecimalsDesc = 'sy_decimals_DESC',
  SyDecimalsDescNullsFirst = 'sy_decimals_DESC_NULLS_FIRST',
  SyDecimalsDescNullsLast = 'sy_decimals_DESC_NULLS_LAST',
  SyIdAsc = 'sy_id_ASC',
  SyIdAscNullsFirst = 'sy_id_ASC_NULLS_FIRST',
  SyIdAscNullsLast = 'sy_id_ASC_NULLS_LAST',
  SyIdDesc = 'sy_id_DESC',
  SyIdDescNullsFirst = 'sy_id_DESC_NULLS_FIRST',
  SyIdDescNullsLast = 'sy_id_DESC_NULLS_LAST',
  SyNameAsc = 'sy_name_ASC',
  SyNameAscNullsFirst = 'sy_name_ASC_NULLS_FIRST',
  SyNameAscNullsLast = 'sy_name_ASC_NULLS_LAST',
  SyNameDesc = 'sy_name_DESC',
  SyNameDescNullsFirst = 'sy_name_DESC_NULLS_FIRST',
  SyNameDescNullsLast = 'sy_name_DESC_NULLS_LAST',
  SyPriceUsdAsc = 'sy_priceUSD_ASC',
  SyPriceUsdAscNullsFirst = 'sy_priceUSD_ASC_NULLS_FIRST',
  SyPriceUsdAscNullsLast = 'sy_priceUSD_ASC_NULLS_LAST',
  SyPriceUsdDesc = 'sy_priceUSD_DESC',
  SyPriceUsdDescNullsFirst = 'sy_priceUSD_DESC_NULLS_FIRST',
  SyPriceUsdDescNullsLast = 'sy_priceUSD_DESC_NULLS_LAST',
  SySymbolAsc = 'sy_symbol_ASC',
  SySymbolAscNullsFirst = 'sy_symbol_ASC_NULLS_FIRST',
  SySymbolAscNullsLast = 'sy_symbol_ASC_NULLS_LAST',
  SySymbolDesc = 'sy_symbol_DESC',
  SySymbolDescNullsFirst = 'sy_symbol_DESC_NULLS_FIRST',
  SySymbolDescNullsLast = 'sy_symbol_DESC_NULLS_LAST',
  SymbolAsc = 'symbol_ASC',
  SymbolAscNullsFirst = 'symbol_ASC_NULLS_FIRST',
  SymbolAscNullsLast = 'symbol_ASC_NULLS_LAST',
  SymbolDesc = 'symbol_DESC',
  SymbolDescNullsFirst = 'symbol_DESC_NULLS_FIRST',
  SymbolDescNullsLast = 'symbol_DESC_NULLS_LAST',
  TotalLpAsc = 'totalLp_ASC',
  TotalLpAscNullsFirst = 'totalLp_ASC_NULLS_FIRST',
  TotalLpAscNullsLast = 'totalLp_ASC_NULLS_LAST',
  TotalLpDesc = 'totalLp_DESC',
  TotalLpDescNullsFirst = 'totalLp_DESC_NULLS_FIRST',
  TotalLpDescNullsLast = 'totalLp_DESC_NULLS_LAST',
  TotalPtAsc = 'totalPt_ASC',
  TotalPtAscNullsFirst = 'totalPt_ASC_NULLS_FIRST',
  TotalPtAscNullsLast = 'totalPt_ASC_NULLS_LAST',
  TotalPtDesc = 'totalPt_DESC',
  TotalPtDescNullsFirst = 'totalPt_DESC_NULLS_FIRST',
  TotalPtDescNullsLast = 'totalPt_DESC_NULLS_LAST',
  TotalSyAsc = 'totalSy_ASC',
  TotalSyAscNullsFirst = 'totalSy_ASC_NULLS_FIRST',
  TotalSyAscNullsLast = 'totalSy_ASC_NULLS_LAST',
  TotalSyDesc = 'totalSy_DESC',
  TotalSyDescNullsFirst = 'totalSy_DESC_NULLS_FIRST',
  TotalSyDescNullsLast = 'totalSy_DESC_NULLS_LAST',
  VolumeUsdAsc = 'volumeUSD_ASC',
  VolumeUsdAscNullsFirst = 'volumeUSD_ASC_NULLS_FIRST',
  VolumeUsdAscNullsLast = 'volumeUSD_ASC_NULLS_LAST',
  VolumeUsdDesc = 'volumeUSD_DESC',
  VolumeUsdDescNullsFirst = 'volumeUSD_DESC_NULLS_FIRST',
  VolumeUsdDescNullsLast = 'volumeUSD_DESC_NULLS_LAST',
  YtDecimalsAsc = 'yt_decimals_ASC',
  YtDecimalsAscNullsFirst = 'yt_decimals_ASC_NULLS_FIRST',
  YtDecimalsAscNullsLast = 'yt_decimals_ASC_NULLS_LAST',
  YtDecimalsDesc = 'yt_decimals_DESC',
  YtDecimalsDescNullsFirst = 'yt_decimals_DESC_NULLS_FIRST',
  YtDecimalsDescNullsLast = 'yt_decimals_DESC_NULLS_LAST',
  YtIdAsc = 'yt_id_ASC',
  YtIdAscNullsFirst = 'yt_id_ASC_NULLS_FIRST',
  YtIdAscNullsLast = 'yt_id_ASC_NULLS_LAST',
  YtIdDesc = 'yt_id_DESC',
  YtIdDescNullsFirst = 'yt_id_DESC_NULLS_FIRST',
  YtIdDescNullsLast = 'yt_id_DESC_NULLS_LAST',
  YtNameAsc = 'yt_name_ASC',
  YtNameAscNullsFirst = 'yt_name_ASC_NULLS_FIRST',
  YtNameAscNullsLast = 'yt_name_ASC_NULLS_LAST',
  YtNameDesc = 'yt_name_DESC',
  YtNameDescNullsFirst = 'yt_name_DESC_NULLS_FIRST',
  YtNameDescNullsLast = 'yt_name_DESC_NULLS_LAST',
  YtPriceUsdAsc = 'yt_priceUSD_ASC',
  YtPriceUsdAscNullsFirst = 'yt_priceUSD_ASC_NULLS_FIRST',
  YtPriceUsdAscNullsLast = 'yt_priceUSD_ASC_NULLS_LAST',
  YtPriceUsdDesc = 'yt_priceUSD_DESC',
  YtPriceUsdDescNullsFirst = 'yt_priceUSD_DESC_NULLS_FIRST',
  YtPriceUsdDescNullsLast = 'yt_priceUSD_DESC_NULLS_LAST',
  YtSymbolAsc = 'yt_symbol_ASC',
  YtSymbolAscNullsFirst = 'yt_symbol_ASC_NULLS_FIRST',
  YtSymbolAscNullsLast = 'yt_symbol_ASC_NULLS_LAST',
  YtSymbolDesc = 'yt_symbol_DESC',
  YtSymbolDescNullsFirst = 'yt_symbol_DESC_NULLS_FIRST',
  YtSymbolDescNullsLast = 'yt_symbol_DESC_NULLS_LAST'
}

export type MarketWhereInput = {
  AND?: InputMaybe<Array<MarketWhereInput>>;
  OR?: InputMaybe<Array<MarketWhereInput>>;
  burns_every?: InputMaybe<BurnWhereInput>;
  burns_none?: InputMaybe<BurnWhereInput>;
  burns_some?: InputMaybe<BurnWhereInput>;
  decimals_eq?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_eq?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  expiry_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  expiry_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  expiry_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  expiry_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  expiry_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  expiry_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  expiry_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  expiry_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  expiry_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  feeUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  feeUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  feeUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  feeUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  feeUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  feeUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  feeUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  feeUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  marketDayData_every?: InputMaybe<MarketDayDataWhereInput>;
  marketDayData_none?: InputMaybe<MarketDayDataWhereInput>;
  marketDayData_some?: InputMaybe<MarketDayDataWhereInput>;
  marketHourData_every?: InputMaybe<MarketHourDataWhereInput>;
  marketHourData_none?: InputMaybe<MarketHourDataWhereInput>;
  marketHourData_some?: InputMaybe<MarketHourDataWhereInput>;
  mints_every?: InputMaybe<MintWhereInput>;
  mints_none?: InputMaybe<MintWhereInput>;
  mints_some?: InputMaybe<MintWhereInput>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_not_eq?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_startsWith?: InputMaybe<Scalars['String']['input']>;
  priceUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  priceUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  priceUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  pt?: InputMaybe<PtWhereInput>;
  pt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  reserveUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  reserveUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  reserveUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  swaps_every?: InputMaybe<SwapWhereInput>;
  swaps_none?: InputMaybe<SwapWhereInput>;
  swaps_some?: InputMaybe<SwapWhereInput>;
  sy?: InputMaybe<SyWhereInput>;
  sy_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  symbol_endsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_eq?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  symbol_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_not_eq?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_startsWith?: InputMaybe<Scalars['String']['input']>;
  totalLp_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLp_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalLp_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLp_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalPt_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalPt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalPt_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPt_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSy_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSy_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  totalSy_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSy_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  volumeUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  volumeUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  volumeUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  yt?: InputMaybe<YtWhereInput>;
  yt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MarketsConnection = {
  __typename?: 'MarketsConnection';
  edges: Array<MarketEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Mint = {
  __typename?: 'Mint';
  amountUSD: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  market: Market;
  netLpMinted: Scalars['BigDecimal']['output'];
  netPtUsed: Scalars['BigDecimal']['output'];
  netSyUsed: Scalars['BigDecimal']['output'];
  receiver: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type MintEdge = {
  __typename?: 'MintEdge';
  cursor: Scalars['String']['output'];
  node: Mint;
};

export enum MintOrderByInput {
  AmountUsdAsc = 'amountUSD_ASC',
  AmountUsdAscNullsFirst = 'amountUSD_ASC_NULLS_FIRST',
  AmountUsdAscNullsLast = 'amountUSD_ASC_NULLS_LAST',
  AmountUsdDesc = 'amountUSD_DESC',
  AmountUsdDescNullsFirst = 'amountUSD_DESC_NULLS_FIRST',
  AmountUsdDescNullsLast = 'amountUSD_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  MarketDecimalsAsc = 'market_decimals_ASC',
  MarketDecimalsAscNullsFirst = 'market_decimals_ASC_NULLS_FIRST',
  MarketDecimalsAscNullsLast = 'market_decimals_ASC_NULLS_LAST',
  MarketDecimalsDesc = 'market_decimals_DESC',
  MarketDecimalsDescNullsFirst = 'market_decimals_DESC_NULLS_FIRST',
  MarketDecimalsDescNullsLast = 'market_decimals_DESC_NULLS_LAST',
  MarketExpiryAsc = 'market_expiry_ASC',
  MarketExpiryAscNullsFirst = 'market_expiry_ASC_NULLS_FIRST',
  MarketExpiryAscNullsLast = 'market_expiry_ASC_NULLS_LAST',
  MarketExpiryDesc = 'market_expiry_DESC',
  MarketExpiryDescNullsFirst = 'market_expiry_DESC_NULLS_FIRST',
  MarketExpiryDescNullsLast = 'market_expiry_DESC_NULLS_LAST',
  MarketFeeUsdAsc = 'market_feeUSD_ASC',
  MarketFeeUsdAscNullsFirst = 'market_feeUSD_ASC_NULLS_FIRST',
  MarketFeeUsdAscNullsLast = 'market_feeUSD_ASC_NULLS_LAST',
  MarketFeeUsdDesc = 'market_feeUSD_DESC',
  MarketFeeUsdDescNullsFirst = 'market_feeUSD_DESC_NULLS_FIRST',
  MarketFeeUsdDescNullsLast = 'market_feeUSD_DESC_NULLS_LAST',
  MarketIdAsc = 'market_id_ASC',
  MarketIdAscNullsFirst = 'market_id_ASC_NULLS_FIRST',
  MarketIdAscNullsLast = 'market_id_ASC_NULLS_LAST',
  MarketIdDesc = 'market_id_DESC',
  MarketIdDescNullsFirst = 'market_id_DESC_NULLS_FIRST',
  MarketIdDescNullsLast = 'market_id_DESC_NULLS_LAST',
  MarketNameAsc = 'market_name_ASC',
  MarketNameAscNullsFirst = 'market_name_ASC_NULLS_FIRST',
  MarketNameAscNullsLast = 'market_name_ASC_NULLS_LAST',
  MarketNameDesc = 'market_name_DESC',
  MarketNameDescNullsFirst = 'market_name_DESC_NULLS_FIRST',
  MarketNameDescNullsLast = 'market_name_DESC_NULLS_LAST',
  MarketPriceUsdAsc = 'market_priceUSD_ASC',
  MarketPriceUsdAscNullsFirst = 'market_priceUSD_ASC_NULLS_FIRST',
  MarketPriceUsdAscNullsLast = 'market_priceUSD_ASC_NULLS_LAST',
  MarketPriceUsdDesc = 'market_priceUSD_DESC',
  MarketPriceUsdDescNullsFirst = 'market_priceUSD_DESC_NULLS_FIRST',
  MarketPriceUsdDescNullsLast = 'market_priceUSD_DESC_NULLS_LAST',
  MarketReserveUsdAsc = 'market_reserveUSD_ASC',
  MarketReserveUsdAscNullsFirst = 'market_reserveUSD_ASC_NULLS_FIRST',
  MarketReserveUsdAscNullsLast = 'market_reserveUSD_ASC_NULLS_LAST',
  MarketReserveUsdDesc = 'market_reserveUSD_DESC',
  MarketReserveUsdDescNullsFirst = 'market_reserveUSD_DESC_NULLS_FIRST',
  MarketReserveUsdDescNullsLast = 'market_reserveUSD_DESC_NULLS_LAST',
  MarketSymbolAsc = 'market_symbol_ASC',
  MarketSymbolAscNullsFirst = 'market_symbol_ASC_NULLS_FIRST',
  MarketSymbolAscNullsLast = 'market_symbol_ASC_NULLS_LAST',
  MarketSymbolDesc = 'market_symbol_DESC',
  MarketSymbolDescNullsFirst = 'market_symbol_DESC_NULLS_FIRST',
  MarketSymbolDescNullsLast = 'market_symbol_DESC_NULLS_LAST',
  MarketTotalLpAsc = 'market_totalLp_ASC',
  MarketTotalLpAscNullsFirst = 'market_totalLp_ASC_NULLS_FIRST',
  MarketTotalLpAscNullsLast = 'market_totalLp_ASC_NULLS_LAST',
  MarketTotalLpDesc = 'market_totalLp_DESC',
  MarketTotalLpDescNullsFirst = 'market_totalLp_DESC_NULLS_FIRST',
  MarketTotalLpDescNullsLast = 'market_totalLp_DESC_NULLS_LAST',
  MarketTotalPtAsc = 'market_totalPt_ASC',
  MarketTotalPtAscNullsFirst = 'market_totalPt_ASC_NULLS_FIRST',
  MarketTotalPtAscNullsLast = 'market_totalPt_ASC_NULLS_LAST',
  MarketTotalPtDesc = 'market_totalPt_DESC',
  MarketTotalPtDescNullsFirst = 'market_totalPt_DESC_NULLS_FIRST',
  MarketTotalPtDescNullsLast = 'market_totalPt_DESC_NULLS_LAST',
  MarketTotalSyAsc = 'market_totalSy_ASC',
  MarketTotalSyAscNullsFirst = 'market_totalSy_ASC_NULLS_FIRST',
  MarketTotalSyAscNullsLast = 'market_totalSy_ASC_NULLS_LAST',
  MarketTotalSyDesc = 'market_totalSy_DESC',
  MarketTotalSyDescNullsFirst = 'market_totalSy_DESC_NULLS_FIRST',
  MarketTotalSyDescNullsLast = 'market_totalSy_DESC_NULLS_LAST',
  MarketVolumeUsdAsc = 'market_volumeUSD_ASC',
  MarketVolumeUsdAscNullsFirst = 'market_volumeUSD_ASC_NULLS_FIRST',
  MarketVolumeUsdAscNullsLast = 'market_volumeUSD_ASC_NULLS_LAST',
  MarketVolumeUsdDesc = 'market_volumeUSD_DESC',
  MarketVolumeUsdDescNullsFirst = 'market_volumeUSD_DESC_NULLS_FIRST',
  MarketVolumeUsdDescNullsLast = 'market_volumeUSD_DESC_NULLS_LAST',
  NetLpMintedAsc = 'netLpMinted_ASC',
  NetLpMintedAscNullsFirst = 'netLpMinted_ASC_NULLS_FIRST',
  NetLpMintedAscNullsLast = 'netLpMinted_ASC_NULLS_LAST',
  NetLpMintedDesc = 'netLpMinted_DESC',
  NetLpMintedDescNullsFirst = 'netLpMinted_DESC_NULLS_FIRST',
  NetLpMintedDescNullsLast = 'netLpMinted_DESC_NULLS_LAST',
  NetPtUsedAsc = 'netPtUsed_ASC',
  NetPtUsedAscNullsFirst = 'netPtUsed_ASC_NULLS_FIRST',
  NetPtUsedAscNullsLast = 'netPtUsed_ASC_NULLS_LAST',
  NetPtUsedDesc = 'netPtUsed_DESC',
  NetPtUsedDescNullsFirst = 'netPtUsed_DESC_NULLS_FIRST',
  NetPtUsedDescNullsLast = 'netPtUsed_DESC_NULLS_LAST',
  NetSyUsedAsc = 'netSyUsed_ASC',
  NetSyUsedAscNullsFirst = 'netSyUsed_ASC_NULLS_FIRST',
  NetSyUsedAscNullsLast = 'netSyUsed_ASC_NULLS_LAST',
  NetSyUsedDesc = 'netSyUsed_DESC',
  NetSyUsedDescNullsFirst = 'netSyUsed_DESC_NULLS_FIRST',
  NetSyUsedDescNullsLast = 'netSyUsed_DESC_NULLS_LAST',
  ReceiverAsc = 'receiver_ASC',
  ReceiverAscNullsFirst = 'receiver_ASC_NULLS_FIRST',
  ReceiverAscNullsLast = 'receiver_ASC_NULLS_LAST',
  ReceiverDesc = 'receiver_DESC',
  ReceiverDescNullsFirst = 'receiver_DESC_NULLS_FIRST',
  ReceiverDescNullsLast = 'receiver_DESC_NULLS_LAST',
  TimestampAsc = 'timestamp_ASC',
  TimestampAscNullsFirst = 'timestamp_ASC_NULLS_FIRST',
  TimestampAscNullsLast = 'timestamp_ASC_NULLS_LAST',
  TimestampDesc = 'timestamp_DESC',
  TimestampDescNullsFirst = 'timestamp_DESC_NULLS_FIRST',
  TimestampDescNullsLast = 'timestamp_DESC_NULLS_LAST'
}

export type MintWhereInput = {
  AND?: InputMaybe<Array<MintWhereInput>>;
  OR?: InputMaybe<Array<MintWhereInput>>;
  amountUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  amountUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  amountUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  market?: InputMaybe<MarketWhereInput>;
  market_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  netLpMinted_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netLpMinted_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netLpMinted_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netLpMinted_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netLpMinted_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  netLpMinted_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netLpMinted_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netLpMinted_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netLpMinted_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netPtUsed_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtUsed_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtUsed_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtUsed_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netPtUsed_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  netPtUsed_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtUsed_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtUsed_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtUsed_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netSyUsed_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyUsed_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyUsed_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyUsed_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netSyUsed_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  netSyUsed_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyUsed_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyUsed_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyUsed_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  receiver_contains?: InputMaybe<Scalars['String']['input']>;
  receiver_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  receiver_endsWith?: InputMaybe<Scalars['String']['input']>;
  receiver_eq?: InputMaybe<Scalars['String']['input']>;
  receiver_gt?: InputMaybe<Scalars['String']['input']>;
  receiver_gte?: InputMaybe<Scalars['String']['input']>;
  receiver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  receiver_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  receiver_lt?: InputMaybe<Scalars['String']['input']>;
  receiver_lte?: InputMaybe<Scalars['String']['input']>;
  receiver_not_contains?: InputMaybe<Scalars['String']['input']>;
  receiver_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  receiver_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  receiver_not_eq?: InputMaybe<Scalars['String']['input']>;
  receiver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  receiver_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  receiver_startsWith?: InputMaybe<Scalars['String']['input']>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type MintsConnection = {
  __typename?: 'MintsConnection';
  edges: Array<MintEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Pt = {
  __typename?: 'PT';
  decimals: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  priceUSD: Scalars['Float']['output'];
  symbol: Scalars['String']['output'];
};

export type PtEdge = {
  __typename?: 'PTEdge';
  cursor: Scalars['String']['output'];
  node: Pt;
};

export enum PtOrderByInput {
  DecimalsAsc = 'decimals_ASC',
  DecimalsAscNullsFirst = 'decimals_ASC_NULLS_FIRST',
  DecimalsAscNullsLast = 'decimals_ASC_NULLS_LAST',
  DecimalsDesc = 'decimals_DESC',
  DecimalsDescNullsFirst = 'decimals_DESC_NULLS_FIRST',
  DecimalsDescNullsLast = 'decimals_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameAscNullsLast = 'name_ASC_NULLS_LAST',
  NameDesc = 'name_DESC',
  NameDescNullsFirst = 'name_DESC_NULLS_FIRST',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  PriceUsdAsc = 'priceUSD_ASC',
  PriceUsdAscNullsFirst = 'priceUSD_ASC_NULLS_FIRST',
  PriceUsdAscNullsLast = 'priceUSD_ASC_NULLS_LAST',
  PriceUsdDesc = 'priceUSD_DESC',
  PriceUsdDescNullsFirst = 'priceUSD_DESC_NULLS_FIRST',
  PriceUsdDescNullsLast = 'priceUSD_DESC_NULLS_LAST',
  SymbolAsc = 'symbol_ASC',
  SymbolAscNullsFirst = 'symbol_ASC_NULLS_FIRST',
  SymbolAscNullsLast = 'symbol_ASC_NULLS_LAST',
  SymbolDesc = 'symbol_DESC',
  SymbolDescNullsFirst = 'symbol_DESC_NULLS_FIRST',
  SymbolDescNullsLast = 'symbol_DESC_NULLS_LAST'
}

export type PtWhereInput = {
  AND?: InputMaybe<Array<PtWhereInput>>;
  OR?: InputMaybe<Array<PtWhereInput>>;
  decimals_eq?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_eq?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_not_eq?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_startsWith?: InputMaybe<Scalars['String']['input']>;
  priceUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  priceUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  priceUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  symbol_endsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_eq?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  symbol_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_not_eq?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type PTsConnection = {
  __typename?: 'PTsConnection';
  edges: Array<PtEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['String']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  burnById?: Maybe<Burn>;
  /** @deprecated Use burnById */
  burnByUniqueInput?: Maybe<Burn>;
  burns: Array<Burn>;
  burnsConnection: BurnsConnection;
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
  marketById?: Maybe<Market>;
  /** @deprecated Use marketById */
  marketByUniqueInput?: Maybe<Market>;
  marketDayData: Array<MarketDayData>;
  marketDayDataById?: Maybe<MarketDayData>;
  /** @deprecated Use marketDayDataById */
  marketDayDataByUniqueInput?: Maybe<MarketDayData>;
  marketDayDataConnection: MarketDayDataConnection;
  marketHourData: Array<MarketHourData>;
  marketHourDataById?: Maybe<MarketHourData>;
  /** @deprecated Use marketHourDataById */
  marketHourDataByUniqueInput?: Maybe<MarketHourData>;
  marketHourDataConnection: MarketHourDataConnection;
  markets: Array<Market>;
  marketsConnection: MarketsConnection;
  mintById?: Maybe<Mint>;
  /** @deprecated Use mintById */
  mintByUniqueInput?: Maybe<Mint>;
  mints: Array<Mint>;
  mintsConnection: MintsConnection;
  ptById?: Maybe<Pt>;
  /** @deprecated Use ptById */
  ptByUniqueInput?: Maybe<Pt>;
  pts: Array<Pt>;
  ptsConnection: PTsConnection;
  sies: Array<Sy>;
  siesConnection: SiesConnection;
  squidStatus?: Maybe<SquidStatus>;
  swapById?: Maybe<Swap>;
  /** @deprecated Use swapById */
  swapByUniqueInput?: Maybe<Swap>;
  swaps: Array<Swap>;
  swapsConnection: SwapsConnection;
  syById?: Maybe<Sy>;
  /** @deprecated Use syById */
  syByUniqueInput?: Maybe<Sy>;
  tokenById?: Maybe<Token>;
  /** @deprecated Use tokenById */
  tokenByUniqueInput?: Maybe<Token>;
  tokens: Array<Token>;
  tokensConnection: TokensConnection;
  treasuryDistributeById?: Maybe<TreasuryDistribute>;
  /** @deprecated Use treasuryDistributeById */
  treasuryDistributeByUniqueInput?: Maybe<TreasuryDistribute>;
  treasuryDistributes: Array<TreasuryDistribute>;
  treasuryDistributesConnection: TreasuryDistributesConnection;
  votingEventById?: Maybe<VotingEvent>;
  /** @deprecated Use votingEventById */
  votingEventByUniqueInput?: Maybe<VotingEvent>;
  votingEvents: Array<VotingEvent>;
  votingEventsConnection: VotingEventsConnection;
  ytById?: Maybe<Yt>;
  /** @deprecated Use ytById */
  ytByUniqueInput?: Maybe<Yt>;
  yts: Array<Yt>;
  ytsConnection: YTsConnection;
};


export type QueryBurnByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryBurnByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryBurnsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BurnOrderByInput>>;
  where?: InputMaybe<BurnWhereInput>;
};


export type QueryBurnsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<BurnOrderByInput>;
  where?: InputMaybe<BurnWhereInput>;
};


export type QueryFactoriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FactoryOrderByInput>>;
  where?: InputMaybe<FactoryWhereInput>;
};


export type QueryFactoriesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<FactoryOrderByInput>;
  where?: InputMaybe<FactoryWhereInput>;
};


export type QueryFactoryByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryFactoryByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryFactoryDayDataArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FactoryDayDataOrderByInput>>;
  where?: InputMaybe<FactoryDayDataWhereInput>;
};


export type QueryFactoryDayDataByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryFactoryDayDataByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryFactoryDayDataConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<FactoryDayDataOrderByInput>;
  where?: InputMaybe<FactoryDayDataWhereInput>;
};


export type QueryMarketByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryMarketByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryMarketDayDataArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MarketDayDataOrderByInput>>;
  where?: InputMaybe<MarketDayDataWhereInput>;
};


export type QueryMarketDayDataByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryMarketDayDataByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryMarketDayDataConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<MarketDayDataOrderByInput>;
  where?: InputMaybe<MarketDayDataWhereInput>;
};


export type QueryMarketHourDataArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MarketHourDataOrderByInput>>;
  where?: InputMaybe<MarketHourDataWhereInput>;
};


export type QueryMarketHourDataByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryMarketHourDataByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryMarketHourDataConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<MarketHourDataOrderByInput>;
  where?: InputMaybe<MarketHourDataWhereInput>;
};


export type QueryMarketsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MarketOrderByInput>>;
  where?: InputMaybe<MarketWhereInput>;
};


export type QueryMarketsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<MarketOrderByInput>;
  where?: InputMaybe<MarketWhereInput>;
};


export type QueryMintByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryMintByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryMintsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MintOrderByInput>>;
  where?: InputMaybe<MintWhereInput>;
};


export type QueryMintsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<MintOrderByInput>;
  where?: InputMaybe<MintWhereInput>;
};


export type QueryPtByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryPtByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryPtsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PtOrderByInput>>;
  where?: InputMaybe<PtWhereInput>;
};


export type QueryPtsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<PtOrderByInput>;
  where?: InputMaybe<PtWhereInput>;
};


export type QuerySiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SyOrderByInput>>;
  where?: InputMaybe<SyWhereInput>;
};


export type QuerySiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<SyOrderByInput>;
  where?: InputMaybe<SyWhereInput>;
};


export type QuerySwapByIdArgs = {
  id: Scalars['String']['input'];
};


export type QuerySwapByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QuerySwapsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SwapOrderByInput>>;
  where?: InputMaybe<SwapWhereInput>;
};


export type QuerySwapsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<SwapOrderByInput>;
  where?: InputMaybe<SwapWhereInput>;
};


export type QuerySyByIdArgs = {
  id: Scalars['String']['input'];
};


export type QuerySyByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryTokenByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryTokenByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryTokensArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TokenOrderByInput>>;
  where?: InputMaybe<TokenWhereInput>;
};


export type QueryTokensConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<TokenOrderByInput>;
  where?: InputMaybe<TokenWhereInput>;
};


export type QueryTreasuryDistributeByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryTreasuryDistributeByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryTreasuryDistributesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TreasuryDistributeOrderByInput>>;
  where?: InputMaybe<TreasuryDistributeWhereInput>;
};


export type QueryTreasuryDistributesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<TreasuryDistributeOrderByInput>;
  where?: InputMaybe<TreasuryDistributeWhereInput>;
};


export type QueryVotingEventByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryVotingEventByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryVotingEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<VotingEventOrderByInput>>;
  where?: InputMaybe<VotingEventWhereInput>;
};


export type QueryVotingEventsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<VotingEventOrderByInput>;
  where?: InputMaybe<VotingEventWhereInput>;
};


export type QueryYtByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryYtByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryYtsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<YtOrderByInput>>;
  where?: InputMaybe<YtWhereInput>;
};


export type QueryYtsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<YtOrderByInput>;
  where?: InputMaybe<YtWhereInput>;
};

export type Sy = {
  __typename?: 'SY';
  baseAsset: Token;
  decimals: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  priceUSD: Scalars['Float']['output'];
  symbol: Scalars['String']['output'];
  yieldToken: Token;
};

export type SyEdge = {
  __typename?: 'SYEdge';
  cursor: Scalars['String']['output'];
  node: Sy;
};

export enum SyOrderByInput {
  BaseAssetDecimalsAsc = 'baseAsset_decimals_ASC',
  BaseAssetDecimalsAscNullsFirst = 'baseAsset_decimals_ASC_NULLS_FIRST',
  BaseAssetDecimalsAscNullsLast = 'baseAsset_decimals_ASC_NULLS_LAST',
  BaseAssetDecimalsDesc = 'baseAsset_decimals_DESC',
  BaseAssetDecimalsDescNullsFirst = 'baseAsset_decimals_DESC_NULLS_FIRST',
  BaseAssetDecimalsDescNullsLast = 'baseAsset_decimals_DESC_NULLS_LAST',
  BaseAssetIdAsc = 'baseAsset_id_ASC',
  BaseAssetIdAscNullsFirst = 'baseAsset_id_ASC_NULLS_FIRST',
  BaseAssetIdAscNullsLast = 'baseAsset_id_ASC_NULLS_LAST',
  BaseAssetIdDesc = 'baseAsset_id_DESC',
  BaseAssetIdDescNullsFirst = 'baseAsset_id_DESC_NULLS_FIRST',
  BaseAssetIdDescNullsLast = 'baseAsset_id_DESC_NULLS_LAST',
  BaseAssetNameAsc = 'baseAsset_name_ASC',
  BaseAssetNameAscNullsFirst = 'baseAsset_name_ASC_NULLS_FIRST',
  BaseAssetNameAscNullsLast = 'baseAsset_name_ASC_NULLS_LAST',
  BaseAssetNameDesc = 'baseAsset_name_DESC',
  BaseAssetNameDescNullsFirst = 'baseAsset_name_DESC_NULLS_FIRST',
  BaseAssetNameDescNullsLast = 'baseAsset_name_DESC_NULLS_LAST',
  BaseAssetPriceUsdAsc = 'baseAsset_priceUSD_ASC',
  BaseAssetPriceUsdAscNullsFirst = 'baseAsset_priceUSD_ASC_NULLS_FIRST',
  BaseAssetPriceUsdAscNullsLast = 'baseAsset_priceUSD_ASC_NULLS_LAST',
  BaseAssetPriceUsdDesc = 'baseAsset_priceUSD_DESC',
  BaseAssetPriceUsdDescNullsFirst = 'baseAsset_priceUSD_DESC_NULLS_FIRST',
  BaseAssetPriceUsdDescNullsLast = 'baseAsset_priceUSD_DESC_NULLS_LAST',
  BaseAssetSymbolAsc = 'baseAsset_symbol_ASC',
  BaseAssetSymbolAscNullsFirst = 'baseAsset_symbol_ASC_NULLS_FIRST',
  BaseAssetSymbolAscNullsLast = 'baseAsset_symbol_ASC_NULLS_LAST',
  BaseAssetSymbolDesc = 'baseAsset_symbol_DESC',
  BaseAssetSymbolDescNullsFirst = 'baseAsset_symbol_DESC_NULLS_FIRST',
  BaseAssetSymbolDescNullsLast = 'baseAsset_symbol_DESC_NULLS_LAST',
  DecimalsAsc = 'decimals_ASC',
  DecimalsAscNullsFirst = 'decimals_ASC_NULLS_FIRST',
  DecimalsAscNullsLast = 'decimals_ASC_NULLS_LAST',
  DecimalsDesc = 'decimals_DESC',
  DecimalsDescNullsFirst = 'decimals_DESC_NULLS_FIRST',
  DecimalsDescNullsLast = 'decimals_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameAscNullsLast = 'name_ASC_NULLS_LAST',
  NameDesc = 'name_DESC',
  NameDescNullsFirst = 'name_DESC_NULLS_FIRST',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  PriceUsdAsc = 'priceUSD_ASC',
  PriceUsdAscNullsFirst = 'priceUSD_ASC_NULLS_FIRST',
  PriceUsdAscNullsLast = 'priceUSD_ASC_NULLS_LAST',
  PriceUsdDesc = 'priceUSD_DESC',
  PriceUsdDescNullsFirst = 'priceUSD_DESC_NULLS_FIRST',
  PriceUsdDescNullsLast = 'priceUSD_DESC_NULLS_LAST',
  SymbolAsc = 'symbol_ASC',
  SymbolAscNullsFirst = 'symbol_ASC_NULLS_FIRST',
  SymbolAscNullsLast = 'symbol_ASC_NULLS_LAST',
  SymbolDesc = 'symbol_DESC',
  SymbolDescNullsFirst = 'symbol_DESC_NULLS_FIRST',
  SymbolDescNullsLast = 'symbol_DESC_NULLS_LAST',
  YieldTokenDecimalsAsc = 'yieldToken_decimals_ASC',
  YieldTokenDecimalsAscNullsFirst = 'yieldToken_decimals_ASC_NULLS_FIRST',
  YieldTokenDecimalsAscNullsLast = 'yieldToken_decimals_ASC_NULLS_LAST',
  YieldTokenDecimalsDesc = 'yieldToken_decimals_DESC',
  YieldTokenDecimalsDescNullsFirst = 'yieldToken_decimals_DESC_NULLS_FIRST',
  YieldTokenDecimalsDescNullsLast = 'yieldToken_decimals_DESC_NULLS_LAST',
  YieldTokenIdAsc = 'yieldToken_id_ASC',
  YieldTokenIdAscNullsFirst = 'yieldToken_id_ASC_NULLS_FIRST',
  YieldTokenIdAscNullsLast = 'yieldToken_id_ASC_NULLS_LAST',
  YieldTokenIdDesc = 'yieldToken_id_DESC',
  YieldTokenIdDescNullsFirst = 'yieldToken_id_DESC_NULLS_FIRST',
  YieldTokenIdDescNullsLast = 'yieldToken_id_DESC_NULLS_LAST',
  YieldTokenNameAsc = 'yieldToken_name_ASC',
  YieldTokenNameAscNullsFirst = 'yieldToken_name_ASC_NULLS_FIRST',
  YieldTokenNameAscNullsLast = 'yieldToken_name_ASC_NULLS_LAST',
  YieldTokenNameDesc = 'yieldToken_name_DESC',
  YieldTokenNameDescNullsFirst = 'yieldToken_name_DESC_NULLS_FIRST',
  YieldTokenNameDescNullsLast = 'yieldToken_name_DESC_NULLS_LAST',
  YieldTokenPriceUsdAsc = 'yieldToken_priceUSD_ASC',
  YieldTokenPriceUsdAscNullsFirst = 'yieldToken_priceUSD_ASC_NULLS_FIRST',
  YieldTokenPriceUsdAscNullsLast = 'yieldToken_priceUSD_ASC_NULLS_LAST',
  YieldTokenPriceUsdDesc = 'yieldToken_priceUSD_DESC',
  YieldTokenPriceUsdDescNullsFirst = 'yieldToken_priceUSD_DESC_NULLS_FIRST',
  YieldTokenPriceUsdDescNullsLast = 'yieldToken_priceUSD_DESC_NULLS_LAST',
  YieldTokenSymbolAsc = 'yieldToken_symbol_ASC',
  YieldTokenSymbolAscNullsFirst = 'yieldToken_symbol_ASC_NULLS_FIRST',
  YieldTokenSymbolAscNullsLast = 'yieldToken_symbol_ASC_NULLS_LAST',
  YieldTokenSymbolDesc = 'yieldToken_symbol_DESC',
  YieldTokenSymbolDescNullsFirst = 'yieldToken_symbol_DESC_NULLS_FIRST',
  YieldTokenSymbolDescNullsLast = 'yieldToken_symbol_DESC_NULLS_LAST'
}

export type SyWhereInput = {
  AND?: InputMaybe<Array<SyWhereInput>>;
  OR?: InputMaybe<Array<SyWhereInput>>;
  baseAsset?: InputMaybe<TokenWhereInput>;
  baseAsset_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  decimals_eq?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_eq?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_not_eq?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_startsWith?: InputMaybe<Scalars['String']['input']>;
  priceUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  priceUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  priceUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  symbol_endsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_eq?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  symbol_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_not_eq?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_startsWith?: InputMaybe<Scalars['String']['input']>;
  yieldToken?: InputMaybe<TokenWhereInput>;
  yieldToken_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SiesConnection = {
  __typename?: 'SiesConnection';
  edges: Array<SyEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SquidStatus = {
  __typename?: 'SquidStatus';
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']['output']>;
};

export type Swap = {
  __typename?: 'Swap';
  amountUSD: Scalars['Float']['output'];
  caller: Scalars['String']['output'];
  id: Scalars['String']['output'];
  market: Market;
  netPtOut: Scalars['BigDecimal']['output'];
  netSyFee: Scalars['BigDecimal']['output'];
  netSyOut: Scalars['BigDecimal']['output'];
  netSyToReserve: Scalars['BigDecimal']['output'];
  receiver: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type SwapEdge = {
  __typename?: 'SwapEdge';
  cursor: Scalars['String']['output'];
  node: Swap;
};

export enum SwapOrderByInput {
  AmountUsdAsc = 'amountUSD_ASC',
  AmountUsdAscNullsFirst = 'amountUSD_ASC_NULLS_FIRST',
  AmountUsdAscNullsLast = 'amountUSD_ASC_NULLS_LAST',
  AmountUsdDesc = 'amountUSD_DESC',
  AmountUsdDescNullsFirst = 'amountUSD_DESC_NULLS_FIRST',
  AmountUsdDescNullsLast = 'amountUSD_DESC_NULLS_LAST',
  CallerAsc = 'caller_ASC',
  CallerAscNullsFirst = 'caller_ASC_NULLS_FIRST',
  CallerAscNullsLast = 'caller_ASC_NULLS_LAST',
  CallerDesc = 'caller_DESC',
  CallerDescNullsFirst = 'caller_DESC_NULLS_FIRST',
  CallerDescNullsLast = 'caller_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  MarketDecimalsAsc = 'market_decimals_ASC',
  MarketDecimalsAscNullsFirst = 'market_decimals_ASC_NULLS_FIRST',
  MarketDecimalsAscNullsLast = 'market_decimals_ASC_NULLS_LAST',
  MarketDecimalsDesc = 'market_decimals_DESC',
  MarketDecimalsDescNullsFirst = 'market_decimals_DESC_NULLS_FIRST',
  MarketDecimalsDescNullsLast = 'market_decimals_DESC_NULLS_LAST',
  MarketExpiryAsc = 'market_expiry_ASC',
  MarketExpiryAscNullsFirst = 'market_expiry_ASC_NULLS_FIRST',
  MarketExpiryAscNullsLast = 'market_expiry_ASC_NULLS_LAST',
  MarketExpiryDesc = 'market_expiry_DESC',
  MarketExpiryDescNullsFirst = 'market_expiry_DESC_NULLS_FIRST',
  MarketExpiryDescNullsLast = 'market_expiry_DESC_NULLS_LAST',
  MarketFeeUsdAsc = 'market_feeUSD_ASC',
  MarketFeeUsdAscNullsFirst = 'market_feeUSD_ASC_NULLS_FIRST',
  MarketFeeUsdAscNullsLast = 'market_feeUSD_ASC_NULLS_LAST',
  MarketFeeUsdDesc = 'market_feeUSD_DESC',
  MarketFeeUsdDescNullsFirst = 'market_feeUSD_DESC_NULLS_FIRST',
  MarketFeeUsdDescNullsLast = 'market_feeUSD_DESC_NULLS_LAST',
  MarketIdAsc = 'market_id_ASC',
  MarketIdAscNullsFirst = 'market_id_ASC_NULLS_FIRST',
  MarketIdAscNullsLast = 'market_id_ASC_NULLS_LAST',
  MarketIdDesc = 'market_id_DESC',
  MarketIdDescNullsFirst = 'market_id_DESC_NULLS_FIRST',
  MarketIdDescNullsLast = 'market_id_DESC_NULLS_LAST',
  MarketNameAsc = 'market_name_ASC',
  MarketNameAscNullsFirst = 'market_name_ASC_NULLS_FIRST',
  MarketNameAscNullsLast = 'market_name_ASC_NULLS_LAST',
  MarketNameDesc = 'market_name_DESC',
  MarketNameDescNullsFirst = 'market_name_DESC_NULLS_FIRST',
  MarketNameDescNullsLast = 'market_name_DESC_NULLS_LAST',
  MarketPriceUsdAsc = 'market_priceUSD_ASC',
  MarketPriceUsdAscNullsFirst = 'market_priceUSD_ASC_NULLS_FIRST',
  MarketPriceUsdAscNullsLast = 'market_priceUSD_ASC_NULLS_LAST',
  MarketPriceUsdDesc = 'market_priceUSD_DESC',
  MarketPriceUsdDescNullsFirst = 'market_priceUSD_DESC_NULLS_FIRST',
  MarketPriceUsdDescNullsLast = 'market_priceUSD_DESC_NULLS_LAST',
  MarketReserveUsdAsc = 'market_reserveUSD_ASC',
  MarketReserveUsdAscNullsFirst = 'market_reserveUSD_ASC_NULLS_FIRST',
  MarketReserveUsdAscNullsLast = 'market_reserveUSD_ASC_NULLS_LAST',
  MarketReserveUsdDesc = 'market_reserveUSD_DESC',
  MarketReserveUsdDescNullsFirst = 'market_reserveUSD_DESC_NULLS_FIRST',
  MarketReserveUsdDescNullsLast = 'market_reserveUSD_DESC_NULLS_LAST',
  MarketSymbolAsc = 'market_symbol_ASC',
  MarketSymbolAscNullsFirst = 'market_symbol_ASC_NULLS_FIRST',
  MarketSymbolAscNullsLast = 'market_symbol_ASC_NULLS_LAST',
  MarketSymbolDesc = 'market_symbol_DESC',
  MarketSymbolDescNullsFirst = 'market_symbol_DESC_NULLS_FIRST',
  MarketSymbolDescNullsLast = 'market_symbol_DESC_NULLS_LAST',
  MarketTotalLpAsc = 'market_totalLp_ASC',
  MarketTotalLpAscNullsFirst = 'market_totalLp_ASC_NULLS_FIRST',
  MarketTotalLpAscNullsLast = 'market_totalLp_ASC_NULLS_LAST',
  MarketTotalLpDesc = 'market_totalLp_DESC',
  MarketTotalLpDescNullsFirst = 'market_totalLp_DESC_NULLS_FIRST',
  MarketTotalLpDescNullsLast = 'market_totalLp_DESC_NULLS_LAST',
  MarketTotalPtAsc = 'market_totalPt_ASC',
  MarketTotalPtAscNullsFirst = 'market_totalPt_ASC_NULLS_FIRST',
  MarketTotalPtAscNullsLast = 'market_totalPt_ASC_NULLS_LAST',
  MarketTotalPtDesc = 'market_totalPt_DESC',
  MarketTotalPtDescNullsFirst = 'market_totalPt_DESC_NULLS_FIRST',
  MarketTotalPtDescNullsLast = 'market_totalPt_DESC_NULLS_LAST',
  MarketTotalSyAsc = 'market_totalSy_ASC',
  MarketTotalSyAscNullsFirst = 'market_totalSy_ASC_NULLS_FIRST',
  MarketTotalSyAscNullsLast = 'market_totalSy_ASC_NULLS_LAST',
  MarketTotalSyDesc = 'market_totalSy_DESC',
  MarketTotalSyDescNullsFirst = 'market_totalSy_DESC_NULLS_FIRST',
  MarketTotalSyDescNullsLast = 'market_totalSy_DESC_NULLS_LAST',
  MarketVolumeUsdAsc = 'market_volumeUSD_ASC',
  MarketVolumeUsdAscNullsFirst = 'market_volumeUSD_ASC_NULLS_FIRST',
  MarketVolumeUsdAscNullsLast = 'market_volumeUSD_ASC_NULLS_LAST',
  MarketVolumeUsdDesc = 'market_volumeUSD_DESC',
  MarketVolumeUsdDescNullsFirst = 'market_volumeUSD_DESC_NULLS_FIRST',
  MarketVolumeUsdDescNullsLast = 'market_volumeUSD_DESC_NULLS_LAST',
  NetPtOutAsc = 'netPtOut_ASC',
  NetPtOutAscNullsFirst = 'netPtOut_ASC_NULLS_FIRST',
  NetPtOutAscNullsLast = 'netPtOut_ASC_NULLS_LAST',
  NetPtOutDesc = 'netPtOut_DESC',
  NetPtOutDescNullsFirst = 'netPtOut_DESC_NULLS_FIRST',
  NetPtOutDescNullsLast = 'netPtOut_DESC_NULLS_LAST',
  NetSyFeeAsc = 'netSyFee_ASC',
  NetSyFeeAscNullsFirst = 'netSyFee_ASC_NULLS_FIRST',
  NetSyFeeAscNullsLast = 'netSyFee_ASC_NULLS_LAST',
  NetSyFeeDesc = 'netSyFee_DESC',
  NetSyFeeDescNullsFirst = 'netSyFee_DESC_NULLS_FIRST',
  NetSyFeeDescNullsLast = 'netSyFee_DESC_NULLS_LAST',
  NetSyOutAsc = 'netSyOut_ASC',
  NetSyOutAscNullsFirst = 'netSyOut_ASC_NULLS_FIRST',
  NetSyOutAscNullsLast = 'netSyOut_ASC_NULLS_LAST',
  NetSyOutDesc = 'netSyOut_DESC',
  NetSyOutDescNullsFirst = 'netSyOut_DESC_NULLS_FIRST',
  NetSyOutDescNullsLast = 'netSyOut_DESC_NULLS_LAST',
  NetSyToReserveAsc = 'netSyToReserve_ASC',
  NetSyToReserveAscNullsFirst = 'netSyToReserve_ASC_NULLS_FIRST',
  NetSyToReserveAscNullsLast = 'netSyToReserve_ASC_NULLS_LAST',
  NetSyToReserveDesc = 'netSyToReserve_DESC',
  NetSyToReserveDescNullsFirst = 'netSyToReserve_DESC_NULLS_FIRST',
  NetSyToReserveDescNullsLast = 'netSyToReserve_DESC_NULLS_LAST',
  ReceiverAsc = 'receiver_ASC',
  ReceiverAscNullsFirst = 'receiver_ASC_NULLS_FIRST',
  ReceiverAscNullsLast = 'receiver_ASC_NULLS_LAST',
  ReceiverDesc = 'receiver_DESC',
  ReceiverDescNullsFirst = 'receiver_DESC_NULLS_FIRST',
  ReceiverDescNullsLast = 'receiver_DESC_NULLS_LAST',
  TimestampAsc = 'timestamp_ASC',
  TimestampAscNullsFirst = 'timestamp_ASC_NULLS_FIRST',
  TimestampAscNullsLast = 'timestamp_ASC_NULLS_LAST',
  TimestampDesc = 'timestamp_DESC',
  TimestampDescNullsFirst = 'timestamp_DESC_NULLS_FIRST',
  TimestampDescNullsLast = 'timestamp_DESC_NULLS_LAST'
}

export type SwapWhereInput = {
  AND?: InputMaybe<Array<SwapWhereInput>>;
  OR?: InputMaybe<Array<SwapWhereInput>>;
  amountUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  amountUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  amountUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  caller_contains?: InputMaybe<Scalars['String']['input']>;
  caller_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  caller_endsWith?: InputMaybe<Scalars['String']['input']>;
  caller_eq?: InputMaybe<Scalars['String']['input']>;
  caller_gt?: InputMaybe<Scalars['String']['input']>;
  caller_gte?: InputMaybe<Scalars['String']['input']>;
  caller_in?: InputMaybe<Array<Scalars['String']['input']>>;
  caller_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  caller_lt?: InputMaybe<Scalars['String']['input']>;
  caller_lte?: InputMaybe<Scalars['String']['input']>;
  caller_not_contains?: InputMaybe<Scalars['String']['input']>;
  caller_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  caller_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  caller_not_eq?: InputMaybe<Scalars['String']['input']>;
  caller_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  caller_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  caller_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  market?: InputMaybe<MarketWhereInput>;
  market_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  netPtOut_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtOut_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtOut_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtOut_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netPtOut_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  netPtOut_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtOut_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtOut_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netPtOut_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netSyFee_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyFee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyFee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyFee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netSyFee_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  netSyFee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyFee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyFee_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netSyOut_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyOut_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyOut_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyOut_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netSyOut_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  netSyOut_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyOut_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyOut_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyOut_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netSyToReserve_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyToReserve_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyToReserve_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyToReserve_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  netSyToReserve_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  netSyToReserve_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyToReserve_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyToReserve_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  netSyToReserve_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  receiver_contains?: InputMaybe<Scalars['String']['input']>;
  receiver_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  receiver_endsWith?: InputMaybe<Scalars['String']['input']>;
  receiver_eq?: InputMaybe<Scalars['String']['input']>;
  receiver_gt?: InputMaybe<Scalars['String']['input']>;
  receiver_gte?: InputMaybe<Scalars['String']['input']>;
  receiver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  receiver_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  receiver_lt?: InputMaybe<Scalars['String']['input']>;
  receiver_lte?: InputMaybe<Scalars['String']['input']>;
  receiver_not_contains?: InputMaybe<Scalars['String']['input']>;
  receiver_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  receiver_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  receiver_not_eq?: InputMaybe<Scalars['String']['input']>;
  receiver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  receiver_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  receiver_startsWith?: InputMaybe<Scalars['String']['input']>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type SwapsConnection = {
  __typename?: 'SwapsConnection';
  edges: Array<SwapEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Token = {
  __typename?: 'Token';
  decimals: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  priceUSD: Scalars['Float']['output'];
  symbol: Scalars['String']['output'];
};

export type TokenEdge = {
  __typename?: 'TokenEdge';
  cursor: Scalars['String']['output'];
  node: Token;
};

export enum TokenOrderByInput {
  DecimalsAsc = 'decimals_ASC',
  DecimalsAscNullsFirst = 'decimals_ASC_NULLS_FIRST',
  DecimalsAscNullsLast = 'decimals_ASC_NULLS_LAST',
  DecimalsDesc = 'decimals_DESC',
  DecimalsDescNullsFirst = 'decimals_DESC_NULLS_FIRST',
  DecimalsDescNullsLast = 'decimals_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameAscNullsLast = 'name_ASC_NULLS_LAST',
  NameDesc = 'name_DESC',
  NameDescNullsFirst = 'name_DESC_NULLS_FIRST',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  PriceUsdAsc = 'priceUSD_ASC',
  PriceUsdAscNullsFirst = 'priceUSD_ASC_NULLS_FIRST',
  PriceUsdAscNullsLast = 'priceUSD_ASC_NULLS_LAST',
  PriceUsdDesc = 'priceUSD_DESC',
  PriceUsdDescNullsFirst = 'priceUSD_DESC_NULLS_FIRST',
  PriceUsdDescNullsLast = 'priceUSD_DESC_NULLS_LAST',
  SymbolAsc = 'symbol_ASC',
  SymbolAscNullsFirst = 'symbol_ASC_NULLS_FIRST',
  SymbolAscNullsLast = 'symbol_ASC_NULLS_LAST',
  SymbolDesc = 'symbol_DESC',
  SymbolDescNullsFirst = 'symbol_DESC_NULLS_FIRST',
  SymbolDescNullsLast = 'symbol_DESC_NULLS_LAST'
}

export type TokenWhereInput = {
  AND?: InputMaybe<Array<TokenWhereInput>>;
  OR?: InputMaybe<Array<TokenWhereInput>>;
  decimals_eq?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_eq?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_not_eq?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_startsWith?: InputMaybe<Scalars['String']['input']>;
  priceUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  priceUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  priceUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  symbol_endsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_eq?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  symbol_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_not_eq?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type TokensConnection = {
  __typename?: 'TokensConnection';
  edges: Array<TokenEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type TreasuryDistribute = {
  __typename?: 'TreasuryDistribute';
  accumulatedAmount: Scalars['BigDecimal']['output'];
  id: Scalars['String']['output'];
  market: Market;
  token: Token;
  wTime: Scalars['BigInt']['output'];
};

export type TreasuryDistributeEdge = {
  __typename?: 'TreasuryDistributeEdge';
  cursor: Scalars['String']['output'];
  node: TreasuryDistribute;
};

export enum TreasuryDistributeOrderByInput {
  AccumulatedAmountAsc = 'accumulatedAmount_ASC',
  AccumulatedAmountAscNullsFirst = 'accumulatedAmount_ASC_NULLS_FIRST',
  AccumulatedAmountAscNullsLast = 'accumulatedAmount_ASC_NULLS_LAST',
  AccumulatedAmountDesc = 'accumulatedAmount_DESC',
  AccumulatedAmountDescNullsFirst = 'accumulatedAmount_DESC_NULLS_FIRST',
  AccumulatedAmountDescNullsLast = 'accumulatedAmount_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  MarketDecimalsAsc = 'market_decimals_ASC',
  MarketDecimalsAscNullsFirst = 'market_decimals_ASC_NULLS_FIRST',
  MarketDecimalsAscNullsLast = 'market_decimals_ASC_NULLS_LAST',
  MarketDecimalsDesc = 'market_decimals_DESC',
  MarketDecimalsDescNullsFirst = 'market_decimals_DESC_NULLS_FIRST',
  MarketDecimalsDescNullsLast = 'market_decimals_DESC_NULLS_LAST',
  MarketExpiryAsc = 'market_expiry_ASC',
  MarketExpiryAscNullsFirst = 'market_expiry_ASC_NULLS_FIRST',
  MarketExpiryAscNullsLast = 'market_expiry_ASC_NULLS_LAST',
  MarketExpiryDesc = 'market_expiry_DESC',
  MarketExpiryDescNullsFirst = 'market_expiry_DESC_NULLS_FIRST',
  MarketExpiryDescNullsLast = 'market_expiry_DESC_NULLS_LAST',
  MarketFeeUsdAsc = 'market_feeUSD_ASC',
  MarketFeeUsdAscNullsFirst = 'market_feeUSD_ASC_NULLS_FIRST',
  MarketFeeUsdAscNullsLast = 'market_feeUSD_ASC_NULLS_LAST',
  MarketFeeUsdDesc = 'market_feeUSD_DESC',
  MarketFeeUsdDescNullsFirst = 'market_feeUSD_DESC_NULLS_FIRST',
  MarketFeeUsdDescNullsLast = 'market_feeUSD_DESC_NULLS_LAST',
  MarketIdAsc = 'market_id_ASC',
  MarketIdAscNullsFirst = 'market_id_ASC_NULLS_FIRST',
  MarketIdAscNullsLast = 'market_id_ASC_NULLS_LAST',
  MarketIdDesc = 'market_id_DESC',
  MarketIdDescNullsFirst = 'market_id_DESC_NULLS_FIRST',
  MarketIdDescNullsLast = 'market_id_DESC_NULLS_LAST',
  MarketNameAsc = 'market_name_ASC',
  MarketNameAscNullsFirst = 'market_name_ASC_NULLS_FIRST',
  MarketNameAscNullsLast = 'market_name_ASC_NULLS_LAST',
  MarketNameDesc = 'market_name_DESC',
  MarketNameDescNullsFirst = 'market_name_DESC_NULLS_FIRST',
  MarketNameDescNullsLast = 'market_name_DESC_NULLS_LAST',
  MarketPriceUsdAsc = 'market_priceUSD_ASC',
  MarketPriceUsdAscNullsFirst = 'market_priceUSD_ASC_NULLS_FIRST',
  MarketPriceUsdAscNullsLast = 'market_priceUSD_ASC_NULLS_LAST',
  MarketPriceUsdDesc = 'market_priceUSD_DESC',
  MarketPriceUsdDescNullsFirst = 'market_priceUSD_DESC_NULLS_FIRST',
  MarketPriceUsdDescNullsLast = 'market_priceUSD_DESC_NULLS_LAST',
  MarketReserveUsdAsc = 'market_reserveUSD_ASC',
  MarketReserveUsdAscNullsFirst = 'market_reserveUSD_ASC_NULLS_FIRST',
  MarketReserveUsdAscNullsLast = 'market_reserveUSD_ASC_NULLS_LAST',
  MarketReserveUsdDesc = 'market_reserveUSD_DESC',
  MarketReserveUsdDescNullsFirst = 'market_reserveUSD_DESC_NULLS_FIRST',
  MarketReserveUsdDescNullsLast = 'market_reserveUSD_DESC_NULLS_LAST',
  MarketSymbolAsc = 'market_symbol_ASC',
  MarketSymbolAscNullsFirst = 'market_symbol_ASC_NULLS_FIRST',
  MarketSymbolAscNullsLast = 'market_symbol_ASC_NULLS_LAST',
  MarketSymbolDesc = 'market_symbol_DESC',
  MarketSymbolDescNullsFirst = 'market_symbol_DESC_NULLS_FIRST',
  MarketSymbolDescNullsLast = 'market_symbol_DESC_NULLS_LAST',
  MarketTotalLpAsc = 'market_totalLp_ASC',
  MarketTotalLpAscNullsFirst = 'market_totalLp_ASC_NULLS_FIRST',
  MarketTotalLpAscNullsLast = 'market_totalLp_ASC_NULLS_LAST',
  MarketTotalLpDesc = 'market_totalLp_DESC',
  MarketTotalLpDescNullsFirst = 'market_totalLp_DESC_NULLS_FIRST',
  MarketTotalLpDescNullsLast = 'market_totalLp_DESC_NULLS_LAST',
  MarketTotalPtAsc = 'market_totalPt_ASC',
  MarketTotalPtAscNullsFirst = 'market_totalPt_ASC_NULLS_FIRST',
  MarketTotalPtAscNullsLast = 'market_totalPt_ASC_NULLS_LAST',
  MarketTotalPtDesc = 'market_totalPt_DESC',
  MarketTotalPtDescNullsFirst = 'market_totalPt_DESC_NULLS_FIRST',
  MarketTotalPtDescNullsLast = 'market_totalPt_DESC_NULLS_LAST',
  MarketTotalSyAsc = 'market_totalSy_ASC',
  MarketTotalSyAscNullsFirst = 'market_totalSy_ASC_NULLS_FIRST',
  MarketTotalSyAscNullsLast = 'market_totalSy_ASC_NULLS_LAST',
  MarketTotalSyDesc = 'market_totalSy_DESC',
  MarketTotalSyDescNullsFirst = 'market_totalSy_DESC_NULLS_FIRST',
  MarketTotalSyDescNullsLast = 'market_totalSy_DESC_NULLS_LAST',
  MarketVolumeUsdAsc = 'market_volumeUSD_ASC',
  MarketVolumeUsdAscNullsFirst = 'market_volumeUSD_ASC_NULLS_FIRST',
  MarketVolumeUsdAscNullsLast = 'market_volumeUSD_ASC_NULLS_LAST',
  MarketVolumeUsdDesc = 'market_volumeUSD_DESC',
  MarketVolumeUsdDescNullsFirst = 'market_volumeUSD_DESC_NULLS_FIRST',
  MarketVolumeUsdDescNullsLast = 'market_volumeUSD_DESC_NULLS_LAST',
  TokenDecimalsAsc = 'token_decimals_ASC',
  TokenDecimalsAscNullsFirst = 'token_decimals_ASC_NULLS_FIRST',
  TokenDecimalsAscNullsLast = 'token_decimals_ASC_NULLS_LAST',
  TokenDecimalsDesc = 'token_decimals_DESC',
  TokenDecimalsDescNullsFirst = 'token_decimals_DESC_NULLS_FIRST',
  TokenDecimalsDescNullsLast = 'token_decimals_DESC_NULLS_LAST',
  TokenIdAsc = 'token_id_ASC',
  TokenIdAscNullsFirst = 'token_id_ASC_NULLS_FIRST',
  TokenIdAscNullsLast = 'token_id_ASC_NULLS_LAST',
  TokenIdDesc = 'token_id_DESC',
  TokenIdDescNullsFirst = 'token_id_DESC_NULLS_FIRST',
  TokenIdDescNullsLast = 'token_id_DESC_NULLS_LAST',
  TokenNameAsc = 'token_name_ASC',
  TokenNameAscNullsFirst = 'token_name_ASC_NULLS_FIRST',
  TokenNameAscNullsLast = 'token_name_ASC_NULLS_LAST',
  TokenNameDesc = 'token_name_DESC',
  TokenNameDescNullsFirst = 'token_name_DESC_NULLS_FIRST',
  TokenNameDescNullsLast = 'token_name_DESC_NULLS_LAST',
  TokenPriceUsdAsc = 'token_priceUSD_ASC',
  TokenPriceUsdAscNullsFirst = 'token_priceUSD_ASC_NULLS_FIRST',
  TokenPriceUsdAscNullsLast = 'token_priceUSD_ASC_NULLS_LAST',
  TokenPriceUsdDesc = 'token_priceUSD_DESC',
  TokenPriceUsdDescNullsFirst = 'token_priceUSD_DESC_NULLS_FIRST',
  TokenPriceUsdDescNullsLast = 'token_priceUSD_DESC_NULLS_LAST',
  TokenSymbolAsc = 'token_symbol_ASC',
  TokenSymbolAscNullsFirst = 'token_symbol_ASC_NULLS_FIRST',
  TokenSymbolAscNullsLast = 'token_symbol_ASC_NULLS_LAST',
  TokenSymbolDesc = 'token_symbol_DESC',
  TokenSymbolDescNullsFirst = 'token_symbol_DESC_NULLS_FIRST',
  TokenSymbolDescNullsLast = 'token_symbol_DESC_NULLS_LAST',
  WTimeAsc = 'wTime_ASC',
  WTimeAscNullsFirst = 'wTime_ASC_NULLS_FIRST',
  WTimeAscNullsLast = 'wTime_ASC_NULLS_LAST',
  WTimeDesc = 'wTime_DESC',
  WTimeDescNullsFirst = 'wTime_DESC_NULLS_FIRST',
  WTimeDescNullsLast = 'wTime_DESC_NULLS_LAST'
}

export type TreasuryDistributeWhereInput = {
  AND?: InputMaybe<Array<TreasuryDistributeWhereInput>>;
  OR?: InputMaybe<Array<TreasuryDistributeWhereInput>>;
  accumulatedAmount_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  accumulatedAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  accumulatedAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  accumulatedAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  accumulatedAmount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  accumulatedAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  accumulatedAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  accumulatedAmount_not_eq?: InputMaybe<Scalars['BigDecimal']['input']>;
  accumulatedAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  market?: InputMaybe<MarketWhereInput>;
  market_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  token?: InputMaybe<TokenWhereInput>;
  token_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  wTime_eq?: InputMaybe<Scalars['BigInt']['input']>;
  wTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  wTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  wTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  wTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  wTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  wTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  wTime_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  wTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type TreasuryDistributesConnection = {
  __typename?: 'TreasuryDistributesConnection';
  edges: Array<TreasuryDistributeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type VotingEvent = {
  __typename?: 'VotingEvent';
  bias: Scalars['BigInt']['output'];
  id: Scalars['String']['output'];
  pool: Scalars['String']['output'];
  slope: Scalars['BigInt']['output'];
  syncingIndex: Scalars['Int']['output'];
  timestamp: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
};

export type VotingEventEdge = {
  __typename?: 'VotingEventEdge';
  cursor: Scalars['String']['output'];
  node: VotingEvent;
};

export enum VotingEventOrderByInput {
  BiasAsc = 'bias_ASC',
  BiasAscNullsFirst = 'bias_ASC_NULLS_FIRST',
  BiasAscNullsLast = 'bias_ASC_NULLS_LAST',
  BiasDesc = 'bias_DESC',
  BiasDescNullsFirst = 'bias_DESC_NULLS_FIRST',
  BiasDescNullsLast = 'bias_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  PoolAsc = 'pool_ASC',
  PoolAscNullsFirst = 'pool_ASC_NULLS_FIRST',
  PoolAscNullsLast = 'pool_ASC_NULLS_LAST',
  PoolDesc = 'pool_DESC',
  PoolDescNullsFirst = 'pool_DESC_NULLS_FIRST',
  PoolDescNullsLast = 'pool_DESC_NULLS_LAST',
  SlopeAsc = 'slope_ASC',
  SlopeAscNullsFirst = 'slope_ASC_NULLS_FIRST',
  SlopeAscNullsLast = 'slope_ASC_NULLS_LAST',
  SlopeDesc = 'slope_DESC',
  SlopeDescNullsFirst = 'slope_DESC_NULLS_FIRST',
  SlopeDescNullsLast = 'slope_DESC_NULLS_LAST',
  SyncingIndexAsc = 'syncingIndex_ASC',
  SyncingIndexAscNullsFirst = 'syncingIndex_ASC_NULLS_FIRST',
  SyncingIndexAscNullsLast = 'syncingIndex_ASC_NULLS_LAST',
  SyncingIndexDesc = 'syncingIndex_DESC',
  SyncingIndexDescNullsFirst = 'syncingIndex_DESC_NULLS_FIRST',
  SyncingIndexDescNullsLast = 'syncingIndex_DESC_NULLS_LAST',
  TimestampAsc = 'timestamp_ASC',
  TimestampAscNullsFirst = 'timestamp_ASC_NULLS_FIRST',
  TimestampAscNullsLast = 'timestamp_ASC_NULLS_LAST',
  TimestampDesc = 'timestamp_DESC',
  TimestampDescNullsFirst = 'timestamp_DESC_NULLS_FIRST',
  TimestampDescNullsLast = 'timestamp_DESC_NULLS_LAST',
  UserAsc = 'user_ASC',
  UserAscNullsFirst = 'user_ASC_NULLS_FIRST',
  UserAscNullsLast = 'user_ASC_NULLS_LAST',
  UserDesc = 'user_DESC',
  UserDescNullsFirst = 'user_DESC_NULLS_FIRST',
  UserDescNullsLast = 'user_DESC_NULLS_LAST'
}

export type VotingEventWhereInput = {
  AND?: InputMaybe<Array<VotingEventWhereInput>>;
  OR?: InputMaybe<Array<VotingEventWhereInput>>;
  bias_eq?: InputMaybe<Scalars['BigInt']['input']>;
  bias_gt?: InputMaybe<Scalars['BigInt']['input']>;
  bias_gte?: InputMaybe<Scalars['BigInt']['input']>;
  bias_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bias_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  bias_lt?: InputMaybe<Scalars['BigInt']['input']>;
  bias_lte?: InputMaybe<Scalars['BigInt']['input']>;
  bias_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  bias_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  pool_endsWith?: InputMaybe<Scalars['String']['input']>;
  pool_eq?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  pool_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  pool_not_eq?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  pool_startsWith?: InputMaybe<Scalars['String']['input']>;
  slope_eq?: InputMaybe<Scalars['BigInt']['input']>;
  slope_gt?: InputMaybe<Scalars['BigInt']['input']>;
  slope_gte?: InputMaybe<Scalars['BigInt']['input']>;
  slope_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  slope_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  slope_lt?: InputMaybe<Scalars['BigInt']['input']>;
  slope_lte?: InputMaybe<Scalars['BigInt']['input']>;
  slope_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  slope_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  syncingIndex_eq?: InputMaybe<Scalars['Int']['input']>;
  syncingIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  syncingIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  syncingIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  syncingIndex_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  syncingIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  syncingIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  syncingIndex_not_eq?: InputMaybe<Scalars['Int']['input']>;
  syncingIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_eq?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  user_endsWith?: InputMaybe<Scalars['String']['input']>;
  user_eq?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  user_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  user_not_eq?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  user_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type VotingEventsConnection = {
  __typename?: 'VotingEventsConnection';
  edges: Array<VotingEventEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type WhereIdInput = {
  id: Scalars['String']['input'];
};

export type Yt = {
  __typename?: 'YT';
  decimals: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  priceUSD: Scalars['Float']['output'];
  symbol: Scalars['String']['output'];
};

export type YtEdge = {
  __typename?: 'YTEdge';
  cursor: Scalars['String']['output'];
  node: Yt;
};

export enum YtOrderByInput {
  DecimalsAsc = 'decimals_ASC',
  DecimalsAscNullsFirst = 'decimals_ASC_NULLS_FIRST',
  DecimalsAscNullsLast = 'decimals_ASC_NULLS_LAST',
  DecimalsDesc = 'decimals_DESC',
  DecimalsDescNullsFirst = 'decimals_DESC_NULLS_FIRST',
  DecimalsDescNullsLast = 'decimals_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameAscNullsLast = 'name_ASC_NULLS_LAST',
  NameDesc = 'name_DESC',
  NameDescNullsFirst = 'name_DESC_NULLS_FIRST',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  PriceUsdAsc = 'priceUSD_ASC',
  PriceUsdAscNullsFirst = 'priceUSD_ASC_NULLS_FIRST',
  PriceUsdAscNullsLast = 'priceUSD_ASC_NULLS_LAST',
  PriceUsdDesc = 'priceUSD_DESC',
  PriceUsdDescNullsFirst = 'priceUSD_DESC_NULLS_FIRST',
  PriceUsdDescNullsLast = 'priceUSD_DESC_NULLS_LAST',
  SymbolAsc = 'symbol_ASC',
  SymbolAscNullsFirst = 'symbol_ASC_NULLS_FIRST',
  SymbolAscNullsLast = 'symbol_ASC_NULLS_LAST',
  SymbolDesc = 'symbol_DESC',
  SymbolDescNullsFirst = 'symbol_DESC_NULLS_FIRST',
  SymbolDescNullsLast = 'symbol_DESC_NULLS_LAST'
}

export type YtWhereInput = {
  AND?: InputMaybe<Array<YtWhereInput>>;
  OR?: InputMaybe<Array<YtWhereInput>>;
  decimals_eq?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_eq?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_not_eq?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_startsWith?: InputMaybe<Scalars['String']['input']>;
  priceUSD_eq?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_gt?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_gte?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  priceUSD_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  priceUSD_lt?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_lte?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_not_eq?: InputMaybe<Scalars['Float']['input']>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  symbol_endsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_eq?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  symbol_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_not_eq?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  symbol_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type YTsConnection = {
  __typename?: 'YTsConnection';
  edges: Array<YtEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type MarketDaySnapshotsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FactoryDayDataOrderByInput> | FactoryDayDataOrderByInput>;
}>;


export type MarketDaySnapshotsQuery = { __typename?: 'Query', factoryDayData: Array<{ __typename?: 'FactoryDayData', dailyVolumeUSD: number, totalLiquidityUSD: number, date: any }> };

export type MarketPricesQueryVariables = Exact<{
  where?: InputMaybe<MarketWhereInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MarketPricesQuery = { __typename?: 'Query', markets: Array<{ __typename?: 'Market', id: string, priceUSD: number, sy: { __typename?: 'SY', id: string, priceUSD: number, baseAsset: { __typename?: 'Token', id: string, priceUSD: number }, yieldToken: { __typename?: 'Token', id: string, priceUSD: number } }, pt: { __typename?: 'PT', id: string, priceUSD: number }, yt: { __typename?: 'YT', id: string, priceUSD: number } }> };

export type MarketByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
  hourDataOrderBy?: InputMaybe<Array<MarketHourDataOrderByInput> | MarketHourDataOrderByInput>;
  hourDataLimit?: InputMaybe<Scalars['Int']['input']>;
  dayDataOrderBy?: InputMaybe<Array<MarketDayDataOrderByInput> | MarketDayDataOrderByInput>;
  dayDataLimit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MarketByIdQuery = { __typename?: 'Query', marketById?: { __typename?: 'Market', id: string, reserveUSD: number, priceUSD: number, sy: { __typename?: 'SY', id: string, priceUSD: number, baseAsset: { __typename?: 'Token', id: string, priceUSD: number }, yieldToken: { __typename?: 'Token', id: string, priceUSD: number } }, pt: { __typename?: 'PT', id: string, priceUSD: number }, yt: { __typename?: 'YT', id: string, priceUSD: number }, marketHourData: Array<{ __typename?: 'MarketHourData', id: string, hourStartUnix: any, reserveUSD: number, hourlyVolumeUSD: number }>, marketDayData: Array<{ __typename?: 'MarketDayData', id: string, date: any, reserveUSD: number, dailyVolumeUSD: number, dailyFeeUSD: number, underlyingAPY: number, impliedAPY: number, fixedROI: number, longYieldROI: number }> } };

export type MarketsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MarketOrderByInput> | MarketOrderByInput>;
  hourDataOrderBy?: InputMaybe<Array<MarketHourDataOrderByInput> | MarketHourDataOrderByInput>;
  hourDataLimit?: InputMaybe<Scalars['Int']['input']>;
  dayDataOrderBy?: InputMaybe<Array<MarketDayDataOrderByInput> | MarketDayDataOrderByInput>;
  dayDataLimit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MarketsQuery = { __typename?: 'Query', markets: Array<{ __typename?: 'Market', id: string, reserveUSD: number, priceUSD: number, sy: { __typename?: 'SY', id: string, priceUSD: number, baseAsset: { __typename?: 'Token', id: string, priceUSD: number }, yieldToken: { __typename?: 'Token', id: string, priceUSD: number } }, pt: { __typename?: 'PT', id: string, priceUSD: number }, yt: { __typename?: 'YT', id: string, priceUSD: number }, marketHourData: Array<{ __typename?: 'MarketHourData', id: string, hourStartUnix: any, reserveUSD: number, hourlyVolumeUSD: number }>, marketDayData: Array<{ __typename?: 'MarketDayData', id: string, date: any, reserveUSD: number, dailyVolumeUSD: number, dailyFeeUSD: number, underlyingAPY: number, impliedAPY: number, fixedROI: number, longYieldROI: number }> }> };

export type VotePositionQueryQueryVariables = Exact<{
  timestampTo: Scalars['BigInt']['input'];
  synchingIndexFrom: Scalars['Int']['input'];
}>;


export type VotePositionQueryQuery = { __typename?: 'Query', votingEvents: Array<{ __typename?: 'VotingEvent', user: string, bias: any, slope: any, timestamp: any, pool: string, syncingIndex: number }> };


export const MarketDaySnapshotsDocument = gql`
    query marketDaySnapshots($limit: Int, $orderBy: [FactoryDayDataOrderByInput!]) {
  factoryDayData(orderBy: $orderBy, limit: $limit) {
    dailyVolumeUSD
    totalLiquidityUSD
    date
  }
}
    `;

/**
 * __useMarketDaySnapshotsQuery__
 *
 * To run a query within a React component, call `useMarketDaySnapshotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMarketDaySnapshotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMarketDaySnapshotsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useMarketDaySnapshotsQuery(baseOptions?: Apollo.QueryHookOptions<MarketDaySnapshotsQuery, MarketDaySnapshotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MarketDaySnapshotsQuery, MarketDaySnapshotsQueryVariables>(MarketDaySnapshotsDocument, options);
      }
export function useMarketDaySnapshotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MarketDaySnapshotsQuery, MarketDaySnapshotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MarketDaySnapshotsQuery, MarketDaySnapshotsQueryVariables>(MarketDaySnapshotsDocument, options);
        }
export function useMarketDaySnapshotsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MarketDaySnapshotsQuery, MarketDaySnapshotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MarketDaySnapshotsQuery, MarketDaySnapshotsQueryVariables>(MarketDaySnapshotsDocument, options);
        }
export type MarketDaySnapshotsQueryHookResult = ReturnType<typeof useMarketDaySnapshotsQuery>;
export type MarketDaySnapshotsLazyQueryHookResult = ReturnType<typeof useMarketDaySnapshotsLazyQuery>;
export type MarketDaySnapshotsSuspenseQueryHookResult = ReturnType<typeof useMarketDaySnapshotsSuspenseQuery>;
export type MarketDaySnapshotsQueryResult = Apollo.QueryResult<MarketDaySnapshotsQuery, MarketDaySnapshotsQueryVariables>;
export const MarketPricesDocument = gql`
    query marketPrices($where: MarketWhereInput, $limit: Int) {
  markets(where: $where, limit: $limit) {
    id
    priceUSD
    sy {
      id
      priceUSD
      baseAsset {
        id
        priceUSD
      }
      yieldToken {
        id
        priceUSD
      }
    }
    pt {
      id
      priceUSD
    }
    yt {
      id
      priceUSD
    }
  }
}
    `;

/**
 * __useMarketPricesQuery__
 *
 * To run a query within a React component, call `useMarketPricesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMarketPricesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMarketPricesQuery({
 *   variables: {
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useMarketPricesQuery(baseOptions?: Apollo.QueryHookOptions<MarketPricesQuery, MarketPricesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MarketPricesQuery, MarketPricesQueryVariables>(MarketPricesDocument, options);
      }
export function useMarketPricesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MarketPricesQuery, MarketPricesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MarketPricesQuery, MarketPricesQueryVariables>(MarketPricesDocument, options);
        }
export function useMarketPricesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MarketPricesQuery, MarketPricesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MarketPricesQuery, MarketPricesQueryVariables>(MarketPricesDocument, options);
        }
export type MarketPricesQueryHookResult = ReturnType<typeof useMarketPricesQuery>;
export type MarketPricesLazyQueryHookResult = ReturnType<typeof useMarketPricesLazyQuery>;
export type MarketPricesSuspenseQueryHookResult = ReturnType<typeof useMarketPricesSuspenseQuery>;
export type MarketPricesQueryResult = Apollo.QueryResult<MarketPricesQuery, MarketPricesQueryVariables>;
export const MarketByIdDocument = gql`
    query marketById($id: String!, $hourDataOrderBy: [MarketHourDataOrderByInput!], $hourDataLimit: Int, $dayDataOrderBy: [MarketDayDataOrderByInput!], $dayDataLimit: Int) {
  marketById(id: $id) {
    id
    reserveUSD
    priceUSD
    sy {
      id
      priceUSD
      baseAsset {
        id
        priceUSD
      }
      yieldToken {
        id
        priceUSD
      }
    }
    pt {
      id
      priceUSD
    }
    yt {
      id
      priceUSD
    }
    marketHourData(orderBy: $hourDataOrderBy, limit: $hourDataLimit) {
      id
      hourStartUnix
      reserveUSD
      hourlyVolumeUSD
    }
    marketDayData(orderBy: $dayDataOrderBy, limit: $dayDataLimit) {
      id
      date
      reserveUSD
      dailyVolumeUSD
      dailyFeeUSD
      underlyingAPY
      impliedAPY
      fixedROI
      longYieldROI
    }
  }
}
    `;

/**
 * __useMarketByIdQuery__
 *
 * To run a query within a React component, call `useMarketByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useMarketByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMarketByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *      hourDataOrderBy: // value for 'hourDataOrderBy'
 *      hourDataLimit: // value for 'hourDataLimit'
 *      dayDataOrderBy: // value for 'dayDataOrderBy'
 *      dayDataLimit: // value for 'dayDataLimit'
 *   },
 * });
 */
export function useMarketByIdQuery(baseOptions: Apollo.QueryHookOptions<MarketByIdQuery, MarketByIdQueryVariables> & ({ variables: MarketByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MarketByIdQuery, MarketByIdQueryVariables>(MarketByIdDocument, options);
      }
export function useMarketByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MarketByIdQuery, MarketByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MarketByIdQuery, MarketByIdQueryVariables>(MarketByIdDocument, options);
        }
export function useMarketByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MarketByIdQuery, MarketByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MarketByIdQuery, MarketByIdQueryVariables>(MarketByIdDocument, options);
        }
export type MarketByIdQueryHookResult = ReturnType<typeof useMarketByIdQuery>;
export type MarketByIdLazyQueryHookResult = ReturnType<typeof useMarketByIdLazyQuery>;
export type MarketByIdSuspenseQueryHookResult = ReturnType<typeof useMarketByIdSuspenseQuery>;
export type MarketByIdQueryResult = Apollo.QueryResult<MarketByIdQuery, MarketByIdQueryVariables>;
export const MarketsDocument = gql`
    query markets($limit: Int, $orderBy: [MarketOrderByInput!], $hourDataOrderBy: [MarketHourDataOrderByInput!], $hourDataLimit: Int, $dayDataOrderBy: [MarketDayDataOrderByInput!], $dayDataLimit: Int) {
  markets(limit: $limit, orderBy: $orderBy) {
    id
    reserveUSD
    priceUSD
    sy {
      id
      priceUSD
      baseAsset {
        id
        priceUSD
      }
      yieldToken {
        id
        priceUSD
      }
    }
    pt {
      id
      priceUSD
    }
    yt {
      id
      priceUSD
    }
    marketHourData(orderBy: $hourDataOrderBy, limit: $hourDataLimit) {
      id
      hourStartUnix
      reserveUSD
      hourlyVolumeUSD
    }
    marketDayData(orderBy: $dayDataOrderBy, limit: $dayDataLimit) {
      id
      date
      reserveUSD
      dailyVolumeUSD
      dailyFeeUSD
      underlyingAPY
      impliedAPY
      fixedROI
      longYieldROI
    }
  }
}
    `;

/**
 * __useMarketsQuery__
 *
 * To run a query within a React component, call `useMarketsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMarketsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMarketsQuery({
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
export function useMarketsQuery(baseOptions?: Apollo.QueryHookOptions<MarketsQuery, MarketsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MarketsQuery, MarketsQueryVariables>(MarketsDocument, options);
      }
export function useMarketsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MarketsQuery, MarketsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MarketsQuery, MarketsQueryVariables>(MarketsDocument, options);
        }
export function useMarketsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MarketsQuery, MarketsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MarketsQuery, MarketsQueryVariables>(MarketsDocument, options);
        }
export type MarketsQueryHookResult = ReturnType<typeof useMarketsQuery>;
export type MarketsLazyQueryHookResult = ReturnType<typeof useMarketsLazyQuery>;
export type MarketsSuspenseQueryHookResult = ReturnType<typeof useMarketsSuspenseQuery>;
export type MarketsQueryResult = Apollo.QueryResult<MarketsQuery, MarketsQueryVariables>;
export const VotePositionQueryDocument = gql`
    query VotePositionQuery($timestampTo: BigInt!, $synchingIndexFrom: Int!) {
  votingEvents(
    limit: 1000
    where: {timestamp_lt: $timestampTo, syncingIndex_gte: $synchingIndexFrom}
    orderBy: syncingIndex_DESC
  ) {
    user
    bias
    slope
    timestamp
    pool
    syncingIndex
  }
}
    `;

/**
 * __useVotePositionQueryQuery__
 *
 * To run a query within a React component, call `useVotePositionQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useVotePositionQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVotePositionQueryQuery({
 *   variables: {
 *      timestampTo: // value for 'timestampTo'
 *      synchingIndexFrom: // value for 'synchingIndexFrom'
 *   },
 * });
 */
export function useVotePositionQueryQuery(baseOptions: Apollo.QueryHookOptions<VotePositionQueryQuery, VotePositionQueryQueryVariables> & ({ variables: VotePositionQueryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VotePositionQueryQuery, VotePositionQueryQueryVariables>(VotePositionQueryDocument, options);
      }
export function useVotePositionQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VotePositionQueryQuery, VotePositionQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VotePositionQueryQuery, VotePositionQueryQueryVariables>(VotePositionQueryDocument, options);
        }
export function useVotePositionQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<VotePositionQueryQuery, VotePositionQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<VotePositionQueryQuery, VotePositionQueryQueryVariables>(VotePositionQueryDocument, options);
        }
export type VotePositionQueryQueryHookResult = ReturnType<typeof useVotePositionQueryQuery>;
export type VotePositionQueryLazyQueryHookResult = ReturnType<typeof useVotePositionQueryLazyQuery>;
export type VotePositionQuerySuspenseQueryHookResult = ReturnType<typeof useVotePositionQuerySuspenseQuery>;
export type VotePositionQueryQueryResult = Apollo.QueryResult<VotePositionQueryQuery, VotePositionQueryQueryVariables>;