"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
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
