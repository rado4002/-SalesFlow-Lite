import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/http";

export default function InventoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadItem = async () => {
    try {
      const res = await api.get(`/api/v1/inventory/${id}`);
      setItem(res.data);
    } catch (err) {
      setError("Failed to load item details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItem();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Item Details
      </h1>

      <div className="bg-white p-8 rounded-xl shadow space-y-6">

        <Detail label="Name" value={item.name} />
        <Detail label="Category" value={item.category} />
        <Detail label="Price" value={`$${item.price}`} />
        <Detail label="Stock" value={item.stock} />
        <Detail label="Created At" value={item.createdAt} />
        <Detail label="Updated At" value={item.updatedAt} />

      </div>

      <div className="flex gap-4 mt-8">
        <Link
          to={`/inventory/edit/${id}`}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
        >
          Edit
        </Link>

        <button
          onClick={() => navigate("/inventory")}
          className="px-6 py-3 bg-gray-300 hover:bg-gray-400 rounded-lg font-bold"
        >
          Back
        </button>
      </div>
    </div>
  );
}

// Reusable component
function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b py-3">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
