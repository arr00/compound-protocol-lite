import { Event } from "../Event";
import { World } from "../World";
import { PriceOracleProxy } from "../../../../../typechain/PriceOracleProxy";
import { getAddressV } from "../CoreValue";
import { AddressV, NumberV, Value } from "../Value";
import { Arg, Fetcher, getFetcherValue } from "../Command";
import { getPriceOracleProxy } from "../ContractLookup";

export async function getPriceOracleProxyAddress(
  _world: World,
  priceOracleProxy: PriceOracleProxy
): Promise<AddressV> {
  return new AddressV(priceOracleProxy.address);
}

export async function getV1PriceOracle(
  _world: World,
  priceOracleProxy: PriceOracleProxy
): Promise<AddressV> {
  return new AddressV(await priceOracleProxy.callStatic.v1PriceOracle());
}

async function getPrice(
  _world: World,
  priceOracleProxy: PriceOracleProxy,
  asset: string
): Promise<NumberV> {
  return new NumberV(
    await priceOracleProxy.callStatic.getUnderlyingPrice(asset)
  );
}

export function priceOracleProxyFetchers() {
  return [
    new Fetcher<{ priceOracleProxy: PriceOracleProxy }, AddressV>(
      `
        #### V1PriceOracle

        * "V1PriceOracle" - Gets the address of the v1 Price
      `,
      "V1PriceOracle",
      [new Arg("priceOracleProxy", getPriceOracleProxy, { implicit: true })],
      (world, { priceOracleProxy }) => getV1PriceOracle(world, priceOracleProxy)
    ),
    new Fetcher<{ priceOracleProxy: PriceOracleProxy }, AddressV>(
      `
        #### Address

        * "Address" - Gets the address of the global price oracle
      `,
      "Address",
      [new Arg("priceOracleProxy", getPriceOracleProxy, { implicit: true })],
      (world, { priceOracleProxy }) =>
        getPriceOracleProxyAddress(world, priceOracleProxy)
    ),
    new Fetcher<{ priceOracle: PriceOracleProxy; asset: AddressV }, NumberV>(
      `
        #### Price

        * "Price asset:<Address>" - Gets the price of the given asset
      `,
      "Price",
      [
        new Arg("priceOracle", getPriceOracleProxy, { implicit: true }),
        new Arg("asset", getAddressV),
      ],
      (world, { priceOracle, asset }) => getPrice(world, priceOracle, asset.val)
    ),
  ];
}

export async function getPriceOracleProxyValue(
  world: World,
  event: Event
): Promise<Value> {
  return await getFetcherValue<any, any>(
    "PriceOracle",
    priceOracleProxyFetchers(),
    world,
    event
  );
}
