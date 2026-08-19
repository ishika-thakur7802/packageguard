"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPackageJson = findPackageJson;
exports.getDependencies = getDependencies;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function findPackageJson() {
    const currentDirectory = process.cwd();
    const packageJsonPath = path_1.default.join(currentDirectory, "package.json");
    if (!fs_1.default.existsSync(packageJsonPath)) {
        return null;
    }
    return packageJsonPath;
}
function readPackageJson(packageJsonPath) {
    const contents = fs_1.default.readFileSync(packageJsonPath, "utf-8");
    return JSON.parse(contents);
}
function getDependencies(packageJsonPath) {
    const packageJson = readPackageJson(packageJsonPath);
    const dependencies = packageJson.dependencies ?? {};
    const devDependencies = packageJson.devDependencies ?? {};
    const result = [];
    for (const [name, version] of Object.entries(dependencies)) {
        result.push({
            name,
            version,
            type: "dependency"
        });
    }
    for (const [name, version] of Object.entries(devDependencies)) {
        result.push({
            name,
            version,
            type: "devDependency"
        });
    }
    return result;
}
//# sourceMappingURL=projectScanner.js.map