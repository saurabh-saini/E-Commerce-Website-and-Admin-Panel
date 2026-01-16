import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../services/api";

type ProductForm = {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

export default function AdminProducts() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>();

  /* ======================
      SUBMIT HANDLER
  ====================== */

  const onSubmit = async (data: ProductForm) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: data.price,
        images: [data.image], // backend expects array
        category: data.category,
        stock: data.stock,
      };

      await api.post("/products", payload);

      toast.success("Product added successfully");

      reset();
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        {/* PRODUCT NAME */}
        <div>
          <input
            {...register("name", {
              required: "Product name is required",
              minLength: {
                value: 3,
                message: "Minimum 3 characters required",
              },
            })}
            placeholder="Product Name"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            placeholder="Product Description"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* PRICE */}
        <div>
          <input
            type="number"
            {...register("price", {
              required: "Price required",
              min: {
                value: 1,
                message: "Price must be greater than 0",
              },
            })}
            placeholder="Price"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* IMAGE URL */}
        <div>
          <input
            {...register("image", {
              required: "Image URL required",
            })}
            placeholder="Image URL"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>

        {/* CATEGORY */}
        <div>
          <input
            {...register("category", {
              required: "Category required",
            })}
            placeholder="Category"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        {/* STOCK */}
        <div>
          <input
            type="number"
            {...register("stock", {
              required: "Stock required",
              min: {
                value: 0,
                message: "Stock cannot be negative",
              },
            })}
            placeholder="Stock Quantity"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm">{errors.stock.message}</p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          disabled={isSubmitting}
          type="submit"
          className={`w-full py-3 rounded text-white
            ${isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {isSubmitting ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
