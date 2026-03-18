import { cookies } from "next/headers";
import axios from "axios";

// Server-side helper to create an Axios instance with the access token from cookies
async function getAxiosServerInstance() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("jwt")?.value ?? "";  // Fetch the JWT token from cookies

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5010",  // API URL
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",  // Attach the JWT token if available
    },
  });
}

// Fetch products with optional search and pagination
export async function getProducts(search = "", page = 1, limit = 5) {
  const axiosInstance = await getAxiosServerInstance();  // Get the Axios instance

  try {
    const res = await axiosInstance.get("/products", {
      params: { search, page, limit },  // Sending search and pagination params
    });

    // Return the response with safe defaults if data is not as expected
    return {
      products: Array.isArray(res.data.products) ? res.data.products : [],  // Ensure products is an array
      totalPages: res.data.totalPages ?? 1,  // Ensure totalPages is set
      currentPage: res.data.currentPage ?? page,  // Ensure currentPage is correctly set
      totalProducts: res.data.totalProducts ?? 0,  // Ensure totalProducts is set
    };
  } catch (error) {
    console.error("Error fetching products:", error);  // Log the error
    return { products: [], totalPages: 1, currentPage: 1, totalProducts: 0 };  // Return default values
  }
}

// Delete a single product
export async function deleteProduct(productId: string) {
  const axiosInstance = await getAxiosServerInstance();

  try {
    const res = await axiosInstance.delete(`/products/${productId}`);  // DELETE request for single product
    return res.data;  // Return the response data
  } catch (error) {
    console.error("Error deleting product:", error);  // Log the error
    throw new Error("Could not delete the product.");  // Throw error to be handled in the UI
  }
}

// Bulk delete products
export async function deleteProductsBulk(productIds: string[]) {
  const axiosInstance = await getAxiosServerInstance();

  try {
    const res = await axiosInstance.post("/products/bulk-delete", { uuids: productIds });  // POST request for bulk delete
    return res.data;  // Return the response data
  } catch (error) {
    console.error("Error deleting products:", error);  // Log the error
    throw new Error("Could not delete products.");  // Throw error to be handled in the UI
  }
}