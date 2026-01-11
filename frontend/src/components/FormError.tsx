type Props = {
  message?: string;
};

export default function FormError({ message }: Props) {
  if (!message) return null;

  return <p className="text-red-500 text-xs mt-1">{message}</p>;
}
