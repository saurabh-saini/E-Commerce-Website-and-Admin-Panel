import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

const products = [
  {
    id: 1,
    title: "Wireless Headphones",
    price: 2999,
    image: "https://picsum.photos/300/200?1",
  },
  {
    id: 2,
    title: "Smart Watch",
    price: 4999,
    image: "https://picsum.photos/300/200?2",
  },
  {
    id: 3,
    title: "Gaming Mouse",
    price: 1999,
    image: "https://picsum.photos/300/200?3",
  },
];

export default function Home() {
  return (
    <>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </>
  );
}
