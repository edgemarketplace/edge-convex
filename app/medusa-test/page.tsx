type MedusaProduct = {
  id: string;
  title?: string;
  handle?: string;
};

type MedusaProductsResponse = {
  products?: MedusaProduct[];
};

export default async function MedusaTestPage() {
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

  const publishableKey =
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  let result: MedusaProductsResponse | null = null;
  let error: string | null = null;

  try {
    const response = await fetch(
      `${backendUrl}/store/products?limit=10`,
      {
        headers: {
          "x-publishable-api-key": publishableKey || "",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Medusa responded with ${response.status}`
      );
    }

    result = await response.json();
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Unknown Medusa connection error";
  }

  const products = result?.products || [];

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-3">
        Medusa Storefront Connection Test
      </h1>

      <p className="text-gray-600 mb-8">
        Testing Edge Marketplace storefront access to Medusa.
      </p>

      <div className="border rounded-2xl p-6 mb-8">
        <p>
          <strong>Backend URL:</strong> {backendUrl}
        </p>

        <p className="mt-2">
          <strong>Status:</strong>{" "}
          {error ? "Connection failed" : "Connected"}
        </p>

        {error && (
          <p className="mt-4 text-red-600">
            {error}
          </p>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4">
        Store Products
      </h2>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl p-5"
          >
            <h3 className="text-xl font-semibold">
              {product.title}
            </h3>

            <p className="text-gray-600">
              {product.handle}
            </p>
          </div>
        ))}

        {products.length === 0 && !error && (
          <p className="text-gray-600">
            Connected, but no storefront products found.
          </p>
        )}
      </div>
    </main>
  );
}
