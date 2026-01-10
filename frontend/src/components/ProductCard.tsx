import { Link } from "react-router-dom";

type Props = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export default function ProductCard({ id, title, price, image }: Props) {
  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition p-4">
      <img
        src={image}
        alt={title}
        className="h-40 w-full object-cover rounded"
      />

      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="text-blue-600 font-bold">₹{price}</p>

      <Link
        to={`/product/${id}`}
        className="block mt-3 text-center bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700"
      >
        View Details
      </Link>
    </div>
  );
}
