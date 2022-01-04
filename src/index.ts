"use strict";

import minifier from "./minifier";
import createRpcWorker from "sync-rpc";

function memoizedSupplier<T>(supplier: () => T): () => T {
  let boxed: { readonly current: T } | null = null;
  return () => {
    if (!boxed) {
      boxed = { current: supplier() };
    }
    return boxed.current;
  };
}

const syncMinifier = memoizedSupplier(() =>
  createRpcWorker(`${__dirname}/minifier`, null)
);

function hackSyncMinifier(
  ...args: Parameters<typeof minifier>
): ReturnType<typeof minifier> {
  return syncMinifier()(...args);
}

module.exports = hackSyncMinifier;
