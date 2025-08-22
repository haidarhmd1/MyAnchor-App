export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className="h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url(/illustration/exercises.png)`,
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      />
      <div className="p-4">{children}</div>
    </>
  );
}
