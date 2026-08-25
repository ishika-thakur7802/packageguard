import { Command } from "commander";

const program = new Command();

program
  .name("packageguard")
  .description("Scan project dependencies for suspicious packages")
  .version("0.1.0");

program
  .command("scan")
  .description("Scan the current project for dependencies")
  .action(() => {
    console.log("PackageGuard scanning...");
  });

program.parse();