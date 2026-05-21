const { ConvexHttpClient } = require("convex/browser");

const client = new ConvexHttpClient("https://academic-gopher-873.convex.cloud");

async function test() {
  try {
    // We cannot call a mutation requiring auth directly without a token.
    // So we need to query something public.
    console.log("Convex initialized.");
  } catch (e) {
    console.error(e);
  }
}
test();
