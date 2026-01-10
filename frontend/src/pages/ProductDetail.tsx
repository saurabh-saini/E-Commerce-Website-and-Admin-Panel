import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        <img
          src={`https://picsum.photos/500/400?${id}`}
          className="rounded"
        />

        <div>
          <h2 className="text-2xl font-bold">Product {id}</h2>
          <p className="text-blue-600 text-xl font-semibold mt-2">
            ₹4999
          </p>

          <p className="text-gray-600 mt-4">
            This is a high-quality product with excellent features and
            durability.
          </p>

          <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
