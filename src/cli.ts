// `require` is needed to get certain features of `yargs` to work correctly
import * as yargs from "yargs";
import { execute } from "./core"

const argv = yargs
.option("candidatesFile", {
    alias: "candidates",
    demand: true,
    description: "JSON file containing candidates for languages to support",
  })
  .option("githubToken", {
    alias: "token",
    demand: true,
    description: "The token to search with; usually GITHUB_TOKEN is sufficient",
  })
  .option("whatIf", {
    demand: false,
    default: false,
    description:
      "Avoids writing any output to disk or creating actual issues",
  }).boolean("whatIf")
  .version().argv;

(async () => {
  try {
    execute(argv.candidatesFile as string, argv.githubToken as string, argv.whatIf)
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();