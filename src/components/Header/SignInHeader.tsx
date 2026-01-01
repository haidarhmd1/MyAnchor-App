export const SignInHeader = ({ title = "MyAnchor App" }) => {
  return (
    <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b bg-white/95 px-4 py-4 backdrop-blur supports-backdrop-filter:bg-white/80">
      <h6 className="absolute left-1/2 -translate-x-1/2 text-center font-medium">
        {title}
      </h6>
    </header>
  );
};
