"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUserAction, deleteUsersBulkAction } from "@/app/dashboard/users/actions/userActions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { Trash2, Pencil, Plus } from "lucide-react";
import ROLES_LIST from "@/config/role_list";

type User = { id: number; uuid: string; name: string; email: string; createdAt: string; updatedAt: string; };
type Props = { initialUsers: User[]; roles: number[]; };

export default function UserList({ initialUsers, roles }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelete, setDelete] = useState("");

  const isAdmin = roles.includes(ROLES_LIST.Admin);

  const toggleSelectAll = () => {
    if (!selectAll) setSelectedIds(users.map(u => u.uuid));
    else setSelectedIds([]);
    setSelectAll(!selectAll);
  };

  const toggleUser = (uuid: string) =>
    setSelectedIds(prev => prev.includes(uuid) ? prev.filter(id => id !== uuid) : [...prev, uuid]);

  // ✅ Use server action
  const handleDelete = async (userId: string) => {
    await deleteUserAction(userId);
    setUsers(users.filter(u => u.uuid !== userId));
    setIsModalOpen(false);
    setDelete("deleted");
  };

  const handleBulkDelete = async () => {
    await deleteUsersBulkAction(selectedIds);
    setUsers(users.filter(u => !selectedIds.includes(u.uuid)));
    setSelectedIds([]);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground">User List</p>
      </div>

      {isDelete === "deleted" && (
        <Alert variant="destructive">
          <AlertDescription>User deleted successfully</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button onClick={() => router.push("/users/add")} className="flex items-center gap-2">
          <Plus size={16}/> Add User
        </Button>
        {selectedIds.length > 0 && (
          <Button variant="destructive" onClick={handleBulkDelete} className="flex gap-2">
            <Trash2 size={16}/> Delete Selected ({selectedIds.length})
          </Button>
        )}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox checked={selectAll} onCheckedChange={toggleSelectAll}/>
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>UUID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => {
              const isChecked = selectedIds.includes(user.uuid);
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox checked={isChecked} onCheckedChange={() => toggleUser(user.uuid)}/>
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{user.uuid}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>{user.updatedAt}</TableCell>
                  <TableCell>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => router.push(`/users/edit/${user.uuid}`)}>
                          <Pencil size={14}/>
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}>
                          <Trash2 size={14}/>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete User"
        message={<><strong>{selectedUser?.name}</strong> will be deleted. This cannot be undone.</>}
        confirmText="Yes, delete"
        cancelText="Cancel"
        isLoading={false}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={() => selectedUser && handleDelete(selectedUser.uuid)}
      />
    </div>
  );
}
