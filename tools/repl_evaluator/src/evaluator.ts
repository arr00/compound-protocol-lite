import { HardhatRuntimeEnvironment } from "hardhat/types";
import { evaluate_repl } from "./scenario/Repl";
import fs from "fs";

export class ReplEvaluator {
  hre: HardhatRuntimeEnvironment;
  constructor(hre: HardhatRuntimeEnvironment) {
    this.hre = hre;
  }

  line = async (x: string) => {
    for (const command of x.split("\n")) {
      try {
        this.hre.world = await evaluate_repl(
          this.hre.world,
          command,
          this.hre.macros
        );
      } catch (e) {
        console.log(e);
        return;
      }
    }
    return;
  };

  lines = async (x: Array<string>) => {
    for (const command of x) {
      try {
        this.hre.world = await evaluate_repl(
          this.hre.world,
          command,
          this.hre.macros
        );
      } catch (e) {
        console.log(e);
        return;
      }
    }
  };

  file = async (filename: string) => {
    const data = fs.readFileSync(filename);
    return this.line(data.toString());
  };
}
