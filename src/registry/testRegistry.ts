import { getPackage } from "./npmRegistry";

async function main() {
  const result = await getPackage(
    "this-package-definitely-does-not-exist-123456789"
  );

  console.log(result);
}

main();