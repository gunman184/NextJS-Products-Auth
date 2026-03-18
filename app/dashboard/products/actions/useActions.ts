// app/products/actions/productActions.ts

"use server";

// Import the server actions for product deletion
import { deleteProduct as serverDeleteProduct, deleteProductsBulk as serverDeleteProductsBulk } from "../server-actions";

// Server actions callable from client components
export async function deleteProductAction(productId: string) {
  await serverDeleteProduct(productId);
}

export async function deleteProductsBulkAction(productIds: string[]) {
  await serverDeleteProductsBulk(productIds);
}