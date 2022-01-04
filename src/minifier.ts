"use strict";

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as terser from "terser";
import { RawSourceMap as BasicSourceMap } from "source-map";

interface MinifierOptions {
  readonly code: string;
  readonly map: BasicSourceMap | null | undefined;
  readonly filename: string;
  readonly reserved: string[];
  readonly config: terser.MinifyOptions;
}

interface MinifierResult {
  readonly code: string;
  readonly map?: BasicSourceMap;
}

async function minifier(options: MinifierOptions): Promise<MinifierResult> {
  const result = await minify(options);

  if (!options.map || result.map == null) {
    return { code: result.code };
  }

  const map: BasicSourceMap =
    typeof result.map === "string" ? JSON.parse(result.map) : result.map;

  return { code: result.code, map: { ...map, sources: [options.filename] } };
}

interface MinifyOutput {
  readonly code: string;
  readonly map?: BasicSourceMap | string;
}

async function minify({
  code,
  map,
  reserved,
  config,
}: MinifierOptions): Promise<MinifyOutput> {
  const mangleConfig = typeof config.mangle === "object" ? config.mangle : {};
  const sourceMapConfig =
    typeof config.sourceMap === "object" ? config.sourceMap : {};
  const options: terser.MinifyOptions = {
    ...config,
    mangle: {
      ...mangleConfig,
      reserved,
    },
    sourceMap:
      map && config.sourceMap
        ? {
            ...sourceMapConfig,
            content: map,
          }
        : false,
  };

  const result = await terser.minify(code, options);

  if (!result.code) {
    throw new Error("Missing code after minification");
  }

  return {
    code: result.code,
    map: result.map,
  };
}

export default function worker(_: null) {
  return minifier;
}
