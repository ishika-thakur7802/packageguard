export interface Dependency{
    name: string;
    version: string;
    type: "dependency" | "devDependency";
}
export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}