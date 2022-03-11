# Metro Minify Terser

> The latest version of metro supports terser v5 so please don't use this

This is a minifier for Metro (the React Native build tool) that supports the terser v5 implementation. Sadly the v5 version of terser has an async API and metro only allows for sync minifiers, so this hacks a sync interface on top of terser by running it as a worker in another process.

Hopefully a PR to allow async minifiers to Metro will be merged and we can remove the hacks here.
