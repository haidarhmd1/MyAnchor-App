import prisma from "../../../../lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { SettingsRowInput } from "./_components/General/SettingsRowInput";
import { Dob } from "./_components/Input/Dob/Dob";
import { Name } from "./_components/Input/Name/Name";
import { GenderPicker } from "./_components/Input/Gender/Gender";

export default async function page() {
  const authenticatedUser = await auth();

  if (!authenticatedUser) return redirect("/");

  const user = await prisma.user.findFirst({
    where: {
      id: authenticatedUser.user?.id,
    },
  });

  if (!user) return redirect("/");

  return (
    <div>
      <div className="p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-7 flex-col items-center justify-start">
              <div className="justify-start text-center text-xl leading-7 font-bold text-neutral-900">
                {user.name || null}
              </div>
            </div>
            <div className="flex flex-col items-center justify-start">
              <div className="justify-start text-center text-base leading-normal font-normal text-slate-500">
                {user.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-4">
        <h4>Account</h4>
        <Name name={user.name || "Not set yet"} />
        <SettingsRowInput label="Email" value={user.email || "Not set yet"} />
        <Dob dob={user.dob} />
        <GenderPicker gender={user.gender || "Not set yet"} />
        {/* <Appearance />
        <Notifications /> */}
      </div>
    </div>
  );
}
