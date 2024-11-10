export default function TextInput({ ...rest }) {
  return (
    <input
      className="px-3 py-2 outline-2 border border-neutral-600 outline-neutral-600 rounded-md"
      {...rest}
    />
  );
}
