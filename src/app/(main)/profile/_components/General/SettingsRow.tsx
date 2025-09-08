export const SettingsRow = ({
  config,
  defaultConfig,
  setting,
}: {
  config: string;
  defaultConfig: string;
  setting: string;
}) => {
  return (
    <div className="flex h-[72px] min-h-[72px] items-center justify-between self-stretch py-2 [background:#F7FAFC]">
      <div>
        <p className="self-stretch text-base leading-6 font-medium text-[#0D141C] [font-feature-settings:'dlig'_on]">
          {config}
        </p>
        <p className="sub">{defaultConfig}</p>
      </div>
      <div>
        <p>{setting}</p>
      </div>
    </div>
  );
};
