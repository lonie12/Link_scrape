import iconsax from "../helpers/icons";

interface UserDetailRowProps {
  ikey: string;
  value?: string;
  Icon: iconsax.Icon;
}

export const UserDetailRow = ({ ikey, value, Icon }: UserDetailRowProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="p-2 rounded-full border">
        <Icon variant="Bulk" size={20} />
      </div>
      <span id={value} className="font-semibold">
        <span className="text-gray-600">{ikey}</span>: {value}
      </span>
    </div>
  );
};
