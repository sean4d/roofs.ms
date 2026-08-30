/** Entry point for `node --import`: installs the `@/` resolve hook. */
import { register } from "node:module";

register("./alias-loader.mjs", import.meta.url);
