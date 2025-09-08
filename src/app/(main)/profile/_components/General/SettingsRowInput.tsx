export const SettingsRowInput = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="flex flex-col py-2">
      <p className="text-start text-base leading-6 font-medium text-[#0D141C]">
        {label}
      </p>
      <p className="sub text-start">{value}</p>
    </div>
  );
};
