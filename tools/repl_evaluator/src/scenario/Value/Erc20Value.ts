import { Event } from "../Event";
import { World } from "../World";
import { IERC20 as Erc20 } from "../../../../../typechain/IERC20";
import { getErc20Address, getWorldContractByAddress } from "../ContractLookup";
import { getAddressV, getCoreValue, mapValue } from "../CoreValue";
import { Arg, Fetcher, getFetcherValue } from "../Command";
import { AddressV, NumberV, Value, StringV } from "../Value";

export async function getErc20Name(
  _world: World,
  erc20: Erc20
): Promise<StringV> {
  return new StringV((await erc20.name()).toString());
}

export async function getErc20Symbol(
  _world: World,
  erc20: Erc20
): Promise<StringV> {
  return new StringV((await erc20.symbol()).toString());
}

export async function getErc20Decimals(
  _world: World,
  erc20: Erc20
): Promise<NumberV> {
  return new NumberV((await erc20.decimals()).toString());
}

async function getTotalSupply(_world: World, erc20: Erc20): Promise<NumberV> {
  return new NumberV((await erc20.totalSupply()).toString());
}

async function getTokenBalance(
  _world: World,
  erc20: Erc20,
  address: string
): Promise<NumberV> {
  return new NumberV((await erc20.balanceOf(address)).toString());
}

async function getAllowance(
  _world: World,
  erc20: Erc20,
  owner: string,
  spender: string
): Promise<NumberV> {
  return new NumberV((await erc20.allowance(owner, spender)).toString());
}

export async function getErc20V(world: World, event: Event): Promise<Erc20> {
  const address = await mapValue<AddressV>(
    world,
    event,
    (str) => new AddressV(getErc20Address(world, str)),
    getCoreValue,
    AddressV
  );

  return getWorldContractByAddress<Erc20>(world, address.val);
}

export function erc20Fetchers() {
  return [
    new Fetcher<{ erc20: Erc20 }, AddressV>(
      `
      #### Address

      * "Erc20 <Erc20> Address" - Returns address of ERC-20 contract
      * E.g. "Erc20 ZRX Address" - Returns ZRX's address
      `,
      "Address",
      [new Arg("erc20", getErc20V)],
      async (_world, { erc20 }) => new AddressV(erc20.address),
      { namePos: 1 }
    ),
    new Fetcher<{ erc20: Erc20 }, StringV>(
      `
      #### Name

      * "Erc20 <Erc20> Name" - Returns name of ERC-20 contract
      * E.g. "Erc20 ZRX Name" - Returns ZRX's name
      `,
      "Name",
      [new Arg("erc20", getErc20V)],
      (world, { erc20 }) => getErc20Name(world, erc20),
      { namePos: 1 }
    ),
    new Fetcher<{ erc20: Erc20 }, StringV>(
      `
      #### Symbol

      * "Erc20 <Erc20> Symbol" - Returns symbol of ERC-20 contract
      * E.g. "Erc20 ZRX Symbol" - Returns ZRX's symbol
      `,
      "Symbol",
      [new Arg("erc20", getErc20V)],
      (world, { erc20 }) => getErc20Symbol(world, erc20),
      { namePos: 1 }
    ),
    new Fetcher<{ erc20: Erc20 }, NumberV>(
      `
      #### Decimals

      * "Erc20 <Erc20> Decimals" - Returns number of decimals in ERC-20 contract
      * E.g. "Erc20 ZRX Decimals" - Returns ZRX's decimals
      `,
      "Decimals",
      [new Arg("erc20", getErc20V)],
      (world, { erc20 }) => getErc20Decimals(world, erc20),
      { namePos: 1 }
    ),
    new Fetcher<{ erc20: Erc20 }, NumberV>(
      `
      #### TotalSupply

      * "Erc20 <Erc20> TotalSupply" - Returns the ERC-20 token's total supply
      * E.g. "Erc20 ZRX TotalSupply"
      * E.g. "Erc20 cZRX TotalSupply"
      `,
      "TotalSupply",
      [new Arg("erc20", getErc20V)],
      (world, { erc20 }) => getTotalSupply(world, erc20),
      { namePos: 1 }
    ),
    new Fetcher<{ erc20: Erc20; address: AddressV }, NumberV>(
      `
      #### TokenBalance

      * "Erc20 <Erc20> TokenBalance <Address>" - Returns the ERC-20 token balance of a given address
      * E.g. "Erc20 ZRX TokenBalance Geoff" - Returns a user's ZRX balance
      * E.g. "Erc20 cZRX TokenBalance Geoff" - Returns a user's cZRX balance
      * E.g. "Erc20 ZRX TokenBalance cZRX" - Returns cZRX's ZRX balance
      `,
      "TokenBalance",
      [new Arg("erc20", getErc20V), new Arg("address", getAddressV)],
      (world, { erc20, address }) => getTokenBalance(world, erc20, address.val),
      { namePos: 1 }
    ),
    new Fetcher<{ erc20: Erc20; owner: AddressV; spender: AddressV }, NumberV>(
      `
      #### Allowance

      * "Erc20 <Erc20> Allowance owner:<Address> spender:<Address>" - Returns the ERC-20 allowance from owner to spender
      * E.g. "Erc20 ZRX Allowance Geoff Torrey" - Returns the ZRX allowance of Geoff to Torrey
      * E.g. "Erc20 cZRX Allowance Geoff Coburn" - Returns the cZRX allowance of Geoff to Coburn
      * E.g. "Erc20 ZRX Allowance Geoff cZRX" - Returns the ZRX allowance of Geoff to the cZRX cToken
      `,
      "Allowance",
      [
        new Arg("erc20", getErc20V),
        new Arg("owner", getAddressV),
        new Arg("spender", getAddressV),
      ],
      (world, { erc20, owner, spender }) =>
        getAllowance(world, erc20, owner.val, spender.val),
      { namePos: 1 }
    ),
  ];
}

export async function getErc20Value(
  world: World,
  event: Event
): Promise<Value> {
  return await getFetcherValue<any, any>(
    "Erc20",
    erc20Fetchers(),
    world,
    event
  );
}
