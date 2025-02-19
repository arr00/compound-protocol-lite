// If your plugin extends types from another plugin, you should import the plugin here.

// To extend one of Hardhat's types, you need to import the module where it has been defined, and redeclare it.
import { ReplEvaluator } from "./evaluator";
import "hardhat/types/config";
import "hardhat/types/runtime";
import { Macros } from "./scenario/Macro";
import { World } from "./scenario/World";

declare module "hardhat/types/config" {
  export interface ProjectPathsUserConfig {
    networks?: string;
  }

  export interface ProjectPathsConfig {
    networks: string;
  }
}

declare module "hardhat/types/runtime" {
  // This is an example of an extension to the Hardhat Runtime Environment.
  // This new field will be available in tasks' actions, scripts, and tests.
  export interface HardhatRuntimeEnvironment {
    world: World;
    macros: Macros;
    repl: ReplEvaluator;
    init_world: () => Promise<any>;
  }
}
