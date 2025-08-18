import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { AuthContext } from "../../../context/AuthContext";

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [view, setView] = useState("table");

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["paymentHistory", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/history/${user.email}`);
      return res.data;
    },
  });

  const itemsPerPage = view === "table" ? 10 : 6;
  const [page, setPage] = useState(0);
  const pages = Math.ceil(payments.length / itemsPerPage);
  const current = payments.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  if (isLoading) return <p>Loading payments...</p>;

  return (
    <div className="max-w-6xl px-4 mx-auto mt-20">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-4xl font-bold lg:text-5xl"
          style={{ color: "var(--color-primary)" }}
        >
          Payment History
        </h2>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => setView(view === "table" ? "card" : "table")}
        >
          Toggle {view === "table" ? "Card" : "Table"} View
        </button>
      </div>

      {view === "table" ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>User Email</th>
                <th>Court</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {current.map((p, i) => (
                <tr key={p._id}>
                  <td>{i + 1 + page * itemsPerPage}</td>
                  <td>{p.userEmail}</td>
                  <td>{p.courtType}</td>
                  <td>${p.price}</td>
                  <td>{p.transactionId}</td>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {current.map((p) => (
            <div
              key={p._id}
              className="p-6 bg-[var(--color-surface)] rounded-2xl shadow border-l-4 border-[var(--color-primary)] hover:shadow-lg transition"
            >
              <p className="mb-1"><strong>User Email:</strong> {p.userEmail}</p>
              <p className="mb-1"><strong>Court:</strong> {p.courtType}</p>
              <p className="mb-1"><strong>Amount:</strong> ${p.price}</p>
              <p className="mb-1"><strong>Txn ID:</strong> {p.transactionId}</p>
              <p className="mb-1"><strong>Date:</strong> {new Date(p.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(pages).keys()].map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={`btn btn-sm ${n === page ? "btn-primary" : "btn-outline"}`}
          >
            {n + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
