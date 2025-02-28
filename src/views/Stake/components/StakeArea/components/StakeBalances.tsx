import { DataRow } from "@olympusdao/component-library";
import { NetworkId } from "src/constants";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { nonNullable } from "src/helpers/types/nonNullable";
import {
  useFuseBalance,
  useGohmBalance,
  useGohmTokemakBalance,
  useOhmBalance,
  useSohmBalance,
  useV1SohmBalance,
  useWsohmBalance,
} from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

const DECIMAL_PLACES_SHOWN = 4;

const hasVisibleBalance = (balance?: DecimalBigNumber) =>
  balance && balance.toApproxNumber() > 9 / Math.pow(10, DECIMAL_PLACES_SHOWN + 1);

export const formatBalance = (balance?: DecimalBigNumber) =>
  balance?.toString({ decimals: DECIMAL_PLACES_SHOWN, trim: false, format: true });

export const StakeBalances = () => {
  const networks = useTestableNetworks();
  const { data: currentIndex } = useCurrentIndex();

  const gohmBalances = useGohmBalance();
  const wsohmBalances = useWsohmBalance();

  const ohmBalance = useOhmBalance()[networks.MAINNET].data;
  const crossChainOhmBalances = [
    { networkName: "Goerli", balance: useOhmBalance()[NetworkId.TESTNET_GOERLI].data },
    { networkName: "Arbitrum Goerli", balance: useOhmBalance()[NetworkId.ARBITRUM_GOERLI].data },
    { networkName: "Arbitrum", balance: useOhmBalance()[NetworkId.ARBITRUM].data },
  ];
  const sohmBalance = useSohmBalance()[networks.MAINNET].data;
  const v1sohmBalance = useV1SohmBalance()[networks.MAINNET].data;
  const gohmFuseBalance = useFuseBalance()[NetworkId.MAINNET].data;
  const gohmTokemakBalance = useGohmTokemakBalance()[NetworkId.MAINNET].data;

  const sohmTokens = [sohmBalance, v1sohmBalance];

  const gohmTokens = [
    gohmFuseBalance,
    gohmTokemakBalance,
    gohmBalances[networks.MAINNET].data,
    gohmBalances[networks.ARBITRUM_V0].data,
    gohmBalances[networks.AVALANCHE].data,
    gohmBalances[NetworkId.POLYGON].data,
    gohmBalances[NetworkId.FANTOM].data,
    wsohmBalances[networks.MAINNET].data,
    wsohmBalances[networks.ARBITRUM_V0].data,
    wsohmBalances[networks.AVALANCHE].data,
    gohmBalances[NetworkId.OPTIMISM].data,
  ];

  const totalSohmBalance = sohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 9));

  const totalGohmBalance = gohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const totalStakedBalance = currentIndex && formatBalance(totalGohmBalance.mul(currentIndex).add(totalSohmBalance));

  const allBalancesLoaded = sohmTokens.every(Boolean) && gohmTokens.every(Boolean);

  return (
    <>
      <DataRow
        id="user-balance"
        title={`Unstaked Balance`}
        isLoading={!ohmBalance}
        balance={`${formatBalance(ohmBalance)} HX`}
      />

      {crossChainOhmBalances
        .filter(crossChainBalance => hasVisibleBalance(crossChainBalance.balance))
        .map(crossChainBalance => {
          return (
            <DataRow
              id="user-balance"
              title={`HX (${crossChainBalance.networkName})`}
              isLoading={!crossChainBalance.balance}
              balance={`${formatBalance(crossChainBalance.balance)} HX`}
            />
          );
        })}

      <DataRow
        id="user-staked-balance"
        isLoading={!allBalancesLoaded}
        title={`Total Staked Balance`}
        balance={`${totalStakedBalance} HX`}
      >
        {sohmBalance?.gt("0") && (
          <DataRow
            indented
            title={`sHX`}
            id="sohm-balance"
            isLoading={!sohmBalance}
            balance={`${formatBalance(sohmBalance)} sHX`}
          />
        )}

        <DataRow
          indented
          title={`gHX`}
          isLoading={!gohmBalances[networks.MAINNET].data}
          balance={`${formatBalance(gohmBalances[networks.MAINNET].data)} gHX`}
        />

        {hasVisibleBalance(gohmBalances[NetworkId.ARBITRUM].data) && (
          <DataRow
            indented
            title={`gHX (Arbitrum)`}
            isLoading={!gohmBalances[NetworkId.ARBITRUM].data}
            balance={`${formatBalance(gohmBalances[NetworkId.ARBITRUM].data)} gHX`}
          />
        )}

        {hasVisibleBalance(gohmBalances[NetworkId.AVALANCHE].data) && (
          <DataRow
            indented
            title={`gHX (Avalanche)`}
            isLoading={!gohmBalances[NetworkId.AVALANCHE].data}
            balance={`${formatBalance(gohmBalances[NetworkId.AVALANCHE].data)} gHX`}
          />
        )}

        {hasVisibleBalance(gohmBalances[NetworkId.POLYGON].data) && (
          <DataRow
            indented
            title={`gHX (Polygon)`}
            isLoading={!gohmBalances[NetworkId.POLYGON].data}
            balance={`${formatBalance(gohmBalances[NetworkId.POLYGON].data)} gHX`}
          />
        )}

        {hasVisibleBalance(gohmBalances[NetworkId.FANTOM].data) && (
          <DataRow
            indented
            title={`gHX (Fantom)`}
            isLoading={!gohmBalances[NetworkId.FANTOM].data}
            balance={`${formatBalance(gohmBalances[NetworkId.FANTOM].data)} gHX`}
          />
        )}

        {hasVisibleBalance(gohmBalances[NetworkId.OPTIMISM].data) && (
          <DataRow
            indented
            title={`gHX (Optimism)`}
            isLoading={!gohmBalances[NetworkId.OPTIMISM].data}
            balance={`${formatBalance(gohmBalances[NetworkId.OPTIMISM].data)} gHX`}
          />
        )}

        {hasVisibleBalance(gohmTokemakBalance) && (
          <DataRow
            indented
            title={`gHX (Tokemak)`}
            isLoading={!gohmTokemakBalance}
            balance={`${formatBalance(gohmTokemakBalance)} gHX`}
          />
        )}

        {hasVisibleBalance(gohmFuseBalance) && (
          <DataRow
            indented
            title={`gHX (Fuse)`}
            isLoading={!gohmFuseBalance}
            balance={`${formatBalance(gohmFuseBalance)} gHX`}
          />
        )}

        {hasVisibleBalance(v1sohmBalance) && (
          <DataRow
            indented
            title={`sHX (v1)`}
            isLoading={!v1sohmBalance}
            balance={`${formatBalance(v1sohmBalance)} sHX`}
          />
        )}

        {hasVisibleBalance(wsohmBalances[networks.MAINNET].data) && (
          <DataRow
            indented
            title={`wsHX`}
            isLoading={!wsohmBalances[networks.MAINNET].data}
            balance={`${formatBalance(wsohmBalances[networks.MAINNET].data)} wsHX`}
          />
        )}

        {hasVisibleBalance(wsohmBalances[NetworkId.ARBITRUM].data) && (
          <DataRow
            indented
            title={`wsHX (Arbitrum)`}
            isLoading={!wsohmBalances[NetworkId.ARBITRUM].data}
            balance={`${formatBalance(wsohmBalances[NetworkId.ARBITRUM].data)} wsHX`}
          />
        )}

        {hasVisibleBalance(wsohmBalances[NetworkId.AVALANCHE].data) && (
          <DataRow
            indented
            title={`wsHX (Avalanche)`}
            isLoading={!wsohmBalances[NetworkId.AVALANCHE].data}
            balance={`${formatBalance(wsohmBalances[NetworkId.AVALANCHE].data)} wsHX`}
          />
        )}
      </DataRow>
    </>
  );
};
