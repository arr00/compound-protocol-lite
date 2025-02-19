import { Map } from "immutable";

import { Event } from "./Event";
import { World } from "./World";
import { Contract } from "./Contract";
import { mustString } from "./Utils";

import {
  CErc20Delegate,
  Comp,
  CToken,
  ERC20 as Erc20,
  InterestRateModel,
  PriceOracle,
  Timelock,
  Maximillion,
  Unitroller,
  IUniswapAnchoredView as AnchoredView,
  GovernorBravoDelegate,
  GovernorBravoDelegator,
  GovernorAlpha,
} from "../../../../typechain";
import { ComptrollerImplS } from "./Event/ComptrollerEvent";
import { ethers } from "ethers";

export type GovernorBravo = GovernorBravoDelegate | GovernorBravoDelegator;

type ContractDataEl = string | Map<string, object> | undefined;

function getContractData(world: World, indices: string[][]): ContractDataEl {
  const out = indices.reduce((value: ContractDataEl, index) => {
    if (value) {
      return value;
    } else {
      return index.reduce((data: ContractDataEl, el) => {
        let lowerEl = el.toLowerCase();

        if (!data) {
          return;
        } else if (typeof data === "string") {
          return data;
        } else {
          return (data as Map<string, ContractDataEl>).find(
            (_v, key) => key.toLowerCase().trim() === lowerEl.trim()
          );
        }
      }, world.contractData);
    }
  }, undefined);

  console.log(out, indices);
  return out;
}

function getContractDataString(world: World, indices: string[][]): string {
  const value: ContractDataEl = getContractData(world, indices);

  if (!value || typeof value !== "string") {
    throw new Error(
      `Failed to find string value by index (got ${value}): ${JSON.stringify(
        indices
      )}, index contains: ${JSON.stringify(world.contractData.toJSON())}`
    );
  }

  return value;
}

export function getWorldContract<T extends ethers.Contract>(
  world: World,
  indices: string[][]
): T {
  const address = getContractDataString(world, indices);

  return getWorldContractByAddress<T>(world, address);
}

export function getWorldContractByAddress<T extends ethers.Contract>(
  world: World,
  address: string
): T {
  let contract = world.contractIndex[address.toLowerCase()];
  console.log(contract);

  if (!contract) {
    throw new Error(
      `Failed to find world contract by address: ${address}, index contains: ${JSON.stringify(
        Object.keys(world.contractIndex)
      )}`
    );
  }

  contract = contract.connect(world.hre.ethers.provider);

  return <T>contract;
}

export async function getTimelock(world: World): Promise<Timelock> {
  return getWorldContract<Timelock>(world, [["Contracts", "Timelock"]]);
}

export async function getUnitroller(world: World): Promise<Unitroller> {
  return getWorldContract<Unitroller>(world, [["Contracts", "Unitroller"]]);
}

export async function getMaximillion(world: World): Promise<Maximillion> {
  return getWorldContract<Maximillion>(world, [["Contracts", "Maximillion"]]);
}

export async function getComptroller(world: World): Promise<ComptrollerImplS> {
  return getWorldContract<ComptrollerImplS>(world, [
    ["Contracts", "Comptroller"],
  ]);
}

export async function getComptrollerImpl(
  world: World,
  comptrollerImplArg: Event
): Promise<ComptrollerImplS> {
  return getWorldContract<ComptrollerImplS>(world, [
    ["Comptroller", mustString(comptrollerImplArg), "address"],
  ]);
}

export function getCTokenAddress(world: World, cTokenArg: string): string {
  return getContractDataString(world, [["cTokens", cTokenArg, "address"]]);
}

export function getCTokenDelegateAddress(
  world: World,
  cTokenDelegateArg: string
): string {
  return getContractDataString(world, [
    ["CTokenDelegate", cTokenDelegateArg, "address"],
  ]);
}

export function getErc20Address(world: World, erc20Arg: string): string {
  return getContractDataString(world, [["Tokens", erc20Arg, "address"]]);
}

export function getGovernorAddress(world: World, governorArg: string): string {
  return getContractDataString(world, [["Contracts", governorArg]]);
}

export function getGovernorBravo(
  world: World,
  governoBravoArg: string
): Promise<GovernorBravo> {
  return Promise.resolve(
    getWorldContract<GovernorBravo>(world, [["Contracts", "GovernorBravo"]])
  );
}

export async function getPriceOracleProxy(world: World): Promise<PriceOracle> {
  return Promise.resolve(
    getWorldContract<PriceOracle>(world, [["Contracts", "PriceOracleProxy"]])
  );
}

export async function getAnchoredView(world: World): Promise<AnchoredView> {
  return Promise.resolve(
    getWorldContract<AnchoredView>(world, [["Contracts", "AnchoredView"]])
  );
}

export async function getPriceOracle(world: World): Promise<PriceOracle> {
  return Promise.resolve(
    getWorldContract<PriceOracle>(world, [["Contracts", "PriceOracle"]])
  );
}

export async function getComp(world: World, compArg: Event): Promise<Comp> {
  return Promise.resolve(getWorldContract<Comp>(world, [["COMP", "address"]]));
}

export async function getCompData(
  world: World,
  compArg: string
): Promise<[Comp, string, Map<string, string>]> {
  let contract = await getComp(world, <Event>(<any>compArg));
  let data = getContractData(world, [["Comp", compArg]]);

  return [contract, compArg, <Map<string, string>>(<any>data)];
}

export async function getGovernorData(
  world: World,
  governorArg: string
): Promise<[GovernorAlpha, string, Map<string, string>]> {
  let contract = getWorldContract<GovernorAlpha>(world, [
    ["Governor", governorArg, "address"],
  ]);
  let data = getContractData(world, [["Governor", governorArg]]);

  return [contract, governorArg, <Map<string, string>>(<any>data)];
}

export async function getInterestRateModel(
  world: World,
  interestRateModelArg: Event
): Promise<InterestRateModel> {
  return Promise.resolve(
    getWorldContract<InterestRateModel>(world, [
      ["InterestRateModel", mustString(interestRateModelArg), "address"],
    ])
  );
}

export async function getInterestRateModelData(
  world: World,
  interestRateModelArg: string
): Promise<[InterestRateModel, string, Map<string, string>]> {
  let contract = await getInterestRateModel(
    world,
    <Event>(<any>interestRateModelArg)
  );
  let data = getContractData(world, [
    ["InterestRateModel", interestRateModelArg],
  ]);

  return [contract, interestRateModelArg, <Map<string, string>>(<any>data)];
}

export async function getErc20Data(
  world: World,
  erc20Arg: string
): Promise<[Erc20, string, Map<string, string>]> {
  let contract = getWorldContract<Erc20>(world, [
    ["Tokens", erc20Arg, "address"],
  ]);
  let data = getContractData(world, [["Tokens", erc20Arg]]);

  return [contract, erc20Arg, <Map<string, string>>(<any>data)];
}

export async function getCTokenData(
  world: World,
  cTokenArg: string
): Promise<[CToken, string, Map<string, string>]> {
  let contract = getWorldContract<CToken>(world, [
    ["cTokens", cTokenArg, "address"],
  ]);
  let data = getContractData(world, [["CTokens", cTokenArg]]);

  return [contract, cTokenArg, <Map<string, string>>(<any>data)];
}

export async function getCTokenDelegateData(
  world: World,
  cTokenDelegateArg: string
): Promise<[CErc20Delegate, string, Map<string, string>]> {
  let contract = getWorldContract<CErc20Delegate>(world, [
    ["CTokenDelegate", cTokenDelegateArg, "address"],
  ]);
  let data = getContractData(world, [["CTokenDelegate", cTokenDelegateArg]]);

  return [contract, cTokenDelegateArg, <Map<string, string>>(<any>data)];
}

export async function getComptrollerImplData(
  world: World,
  comptrollerImplArg: string
): Promise<[ComptrollerImplS, string, Map<string, string>]> {
  let contract = await getComptrollerImpl(
    world,
    <Event>(<any>comptrollerImplArg)
  );
  let data = getContractData(world, [["Comptroller", comptrollerImplArg]]);

  return [contract, comptrollerImplArg, <Map<string, string>>(<any>data)];
}

export function getAddress(world: World, addressArg: string): string {
  if (addressArg.toLowerCase() === "zero") {
    return "0x0000000000000000000000000000000000000000";
  }

  if (addressArg.startsWith("0x")) {
    return addressArg;
  }

  let alias = Object.entries(world.settings.aliases).find(
    ([alias, addr]) => alias.toLowerCase() === addressArg.toLowerCase()
  );
  if (alias) {
    return alias[1];
  }

  let account = world.accounts.find(
    (account) => account.name.toLowerCase() === addressArg.toLowerCase()
  );
  if (account) {
    return account.address;
  }

  return getContractDataString(world, [
    ["Contracts", addressArg],
    ["cTokens", addressArg, "address"],
    ["CTokenDelegate", addressArg, "address"],
    ["Tokens", addressArg, "address"],
    ["Comptroller", addressArg, "address"],
  ]);
}

export function getContractByName(world: World, name: string): Contract {
  return getWorldContract(world, [["Contracts", name]]);
}
