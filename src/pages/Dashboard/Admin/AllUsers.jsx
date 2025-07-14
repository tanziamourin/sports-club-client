import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users");
      return res.data;
    },
  });

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">All Registered Users</h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-4 input input-bordered"
      />

      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full" />
                  </td>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt || user.joinedAt).toLocaleDateString()}</td>
                  <td><span className="badge badge-info">{user.role || "user"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && <p>No users found.</p>}
        </div>
      )}
    </div>
  );
};

export default AllUsers;
