

/*import { cookies } from "next/headers";
import { getProducts } from "./server-actions";
import { getRolesFromToken } from "@/utils/tokenHelpers";
import ProductList from "@/components/products/ProductList";
// Server-side page fetching based on query params
export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams; // Await searchParams to access query data
  const search = params.search ?? ""; // Default to empty string
  const page = parseInt(params.page ?? "1", 10); // Default to page 1

  // Fetch cookies (e.g., JWT token for authentication)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("jwt")?.value;
  let roles: number[] = [];

  if (accessToken) {
    try {
      roles = getRolesFromToken(accessToken);
    } catch {
      roles = [];
    }
  }

  // Fetch products from the server-side API
  const productsResponse = accessToken
    ? await getProducts(search, page, 5) // Pass search and page to the server to fetch filtered products
    : { products: [], totalPages: 1, totalProducts: 0 };

  return (
    <div className="container mx-auto py-6">
      <ProductList
        initialProducts={productsResponse.products} // Send fetched products to the client-side
        roles={roles}
        totalPages={productsResponse.totalPages}
        currentPage={page}
      />
    </div>
  );
}

*/


import { cookies } from "next/headers";
import { getProducts } from "./server-actions";
import { getRolesFromToken } from "@/utils/tokenHelpers";
import ProductList from "@/components/products/ProductList";

export const dynamic = "force-dynamic";

type SearchParams = {
  search?: string;
  page?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const search = params?.search ?? "";
  const page = parseInt(params?.page ?? "1", 10);

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("jwt")?.value;

  let roles: number[] = [];

  if (accessToken) {
    try {
      roles = getRolesFromToken(accessToken);
    } catch {
      roles = [];
    }
  }

  const productsResponse = accessToken
    ? await getProducts(search, page, 5)
    : { products: [], totalPages: 1, totalProducts: 0 };

  return (
    <div className="container mx-auto py-6">
      <ProductList
        initialProducts={productsResponse.products}
        roles={roles}
        totalPages={productsResponse.totalPages}
        currentPage={page}
      />
    </div>
  );
}