import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://academic-gopher-873.convex.cloud");

async function test() {
  try {
    console.log("Calling mutation without auth token...");
    await client.mutation("storefronts:createStorefrontFromBlueprint", {
      businessName: "Test",
      vertical: "retail",
      primaryGoal: "products",
      variationMode: "seller",
    });
  } catch (error: any) {
    console.log("Caught Error Class:", error.constructor.name);
    console.log("Error Message:", error.message);
    console.log("Error Data:", error.data);
  }
}

test();
