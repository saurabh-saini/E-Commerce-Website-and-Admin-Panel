import Navbar from "../components/Navbar";

export default function Cart() {
  return (
    <>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

        <div className="border rounded p-4 flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Wireless Headphones</h3>
            <p className="text-gray-600">₹2999</p>
          </div>

          <button className="text-red-500 hover:underline">
            Remove
          </button>
        </div>

        <div className="mt-6 flex justify-between font-bold">
          <span>Total</span>
          <span>₹2999</span>
        </div>

        <button className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Checkout
        </button>
      </div>
    </>
  );
}
