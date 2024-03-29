import esbuild from "esbuild";
const isDevServer = process.argv.includes("--dev");

esbuild
  .build({
    entryPoints: ["src/index.tsx"],
    bundle: true,
    outfile: "statics/bundle.js",
    minify: !isDevServer,
    sourcemap: true,
    incremental: false,
    target: ["chrome58", "firefox57", "safari11", "edge18"],
    define: {
      "process.env.NODE_ENV": isDevServer ? '"development"' : '"production"',
    },
    watch: isDevServer && {
      onRebuild(err) {
        err ? console.error("❌ Failed") : console.log("✅ Updated");
      },
    },
  })
  .catch(() => process.exit(1));

// if (isDevServer) {
//   serve.start({
//     port: 3006,
//     root: "./www",
//     live: true,
//   });
// }
