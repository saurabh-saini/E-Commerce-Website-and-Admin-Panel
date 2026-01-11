import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "../../services/api";
import { handleApiError } from "../../utils/handleApiError";
import { addToCart } from "../../store/slices/cartSlice";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (!product) return;
    console.log("add");
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
      })
    );
  };

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get<Product>(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading product...</div>;
  }

  if (!product) {
    return <div className="p-6">Product not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* IMAGE */}
      <div>
        <img
          src="/placeholder.png"
          alt={product.name}
          className="w-full h-80 object-cover rounded border"
        />
      </div>

      {/* DETAILS */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>

        <p className="text-gray-600">{product.description}</p>

        <p className="text-2xl font-semibold text-blue-600">₹{product.price}</p>

        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
