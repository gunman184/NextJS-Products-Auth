"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Pencil, Plus, ChevronLeft, ChevronRight } from "lucide-react";

type Product = {
  uuid: string;
  name: string;
  price: number;
  user: { name: string };
  createdAt: string;
};

type Props = {
  initialProducts: Product[];
  roles: number[];
  totalPages: number;
  currentPage: number;
};

export default function ProductList({
  initialProducts,
  roles,
  totalPages,
  currentPage,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? ""
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  /* ---------------- Debounced Search ---------------- */

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchTerm) params.set("search", searchTerm);
      else params.delete("search");

      params.set("page", "1");

      startTransition(() => {
        router.push(`/dashboard/products?${params.toString()}`);
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  /* ---------------- Pagination ---------------- */ 

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));

    startTransition(() => {
      router.push(`/dashboard/products?${params.toString()}`);
    });
  };

  /* ---------------- Selection ---------------- */
  //Adding test

  const toggleSelectAll = () => {
    if (!selectAll) {
      setSelectedIds(initialProducts.map((p) => p.uuid));
      console.log("Test")
    } else {
      setSelectedIds([]);
    }

    setSelectAll(!selectAll);
  };

  const toggleProduct = (uuid: string) => {
    setSelectedIds((prev) =>
      prev.includes(uuid)
        ? prev.filter((id) => id !== uuid)
        : [...prev, uuid]
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="text-muted-foreground">Product List</p>
      </div>

      {/* Search */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />

        {isPending && (
          <span className="text-sm text-muted-foreground">
            Searching...
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          onClick={() => router.push("/dashboard/products/add")}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Add Product
        </Button>

        {selectedIds.length > 0 && (
          <Button variant="destructive" className="flex gap-2">
            <Trash2 size={16} />
            Delete Selected ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>

              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {initialProducts.length > 0 ? (
              initialProducts.map((product) => {
                const isChecked = selectedIds.includes(product.uuid);

                return (
                  <TableRow key={product.uuid}>
                    <TableCell>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() =>
                          toggleProduct(product.uuid)
                        }
                      />
                    </TableCell>

                    <TableCell>{product.name}</TableCell>

                    <TableCell>${product.price}</TableCell>

                    <TableCell>{product.user.name}</TableCell>

                    <TableCell>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          router.push(
                            `/dashboard/products/edit/${product.uuid}`
                          )
                        }
                      >
                        <Pencil size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-3">
        <Button
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
        >
          <ChevronLeft size={16} /> Prev
        </Button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <Button
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
        >
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}