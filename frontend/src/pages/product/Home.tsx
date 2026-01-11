import { useEffect, useState } from "react";
import api from "../../services/api";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from "react-router-dom";

type Product = {
  _id: string;
  name: string;
  price: number;
  images: string[];
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get<Product[]>("/products");
        setProducts(res.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
        >
          {!product.images ? (
            <img
              src={product.images[0] || "/placeholder.png"}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />
          ) : (
            <img
              src="/vite.svg"
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />
          )}
          <h3 className="mt-3 font-semibold text-lg">{product.name}</h3>
          <p className="text-blue-600 font-bold mt-1">₹{product.price}</p>

          <button
            onClick={() => navigate(`/product/${product._id}`)}
            className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}
