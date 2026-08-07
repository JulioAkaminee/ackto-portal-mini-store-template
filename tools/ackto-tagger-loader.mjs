import { parse } from "@babel/parser";
import MagicString from "magic-string";
import path from "node:path";
import { walk } from "estree-walker";

/**
 * Stamps every JSX element with `data-ackto-id` / `data-ackto-name`.
 *
 * Ackto's preview pane injects a client script that resolves a clicked DOM node
 * back to the source location through those attributes. Without them the
 * "select component" and visual-edit affordances find nothing and quietly do
 * nothing, so this loader is what makes those features work at all.
 *
 * It lives in the repo rather than coming from npm on purpose: it is a hundred
 * lines, it runs on every build of every app generated from this template, and
 * a package under someone else's scope would be an open door into all of them.
 *
 * Development only — see next.config.ts. The attributes never reach production.
 */

const VALID_EXTENSIONS = new Set([".jsx", ".tsx"]);

export default function acktoTaggerLoader(code) {
  const callback = this.async();
  const resourcePath = this.resourcePath;

  // Turbopack implements a subset of the webpack loader API and does not
  // provide `rootContext`. The id only has to be stable and human-readable,
  // so the working directory is a fine anchor under either bundler.
  const rootContext = this.rootContext ?? process.cwd();

  try {
    if (
      !VALID_EXTENSIONS.has(path.extname(resourcePath)) ||
      resourcePath.includes("node_modules")
    ) {
      callback(null, code);
      return;
    }

    const ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
      sourceFilename: resourcePath,
    });

    const ms = new MagicString(code);
    const fileRelative = path.relative(rootContext, resourcePath);
    let transformCount = 0;

    walk(ast, {
      enter: (node) => {
        if (node.type !== "JSXOpeningElement") return;
        if (node.name?.type !== "JSXIdentifier") return;

        const tagName = node.name.name;
        if (!tagName) return;

        const alreadyTagged = node.attributes?.some(
          (attr) =>
            attr.type === "JSXAttribute" && attr.name?.name === "data-ackto-id",
        );
        if (alreadyTagged) return;

        const loc = node.loc?.start;
        if (!loc || node.name.end == null) return;

        ms.appendLeft(
          node.name.end,
          ` data-ackto-id="${fileRelative}:${loc.line}:${loc.column}" data-ackto-name="${tagName}"`,
        );
        transformCount++;
      },
    });

    if (transformCount === 0) {
      callback(null, code);
      return;
    }

    // `source` is not optional in practice: without it the map carries a null
    // source and Turbopack resolves it to the containing directory, which fails
    // the whole module with "Is a directory".
    const map = ms.generateMap({
      source: resourcePath,
      includeContent: true,
      hires: true,
    });

    callback(null, ms.toString(), map);
  } catch (error) {
    // A tagging failure must never break the user's build: the component
    // selector degrades, the app still compiles.
    console.warn(`[ackto-tagger] skipped ${resourcePath}:`, error?.message);
    callback(null, code);
  }
}
