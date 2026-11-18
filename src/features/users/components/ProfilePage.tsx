"use client";

import { useCurrentUser } from "@/features/dashboard/useRole";
import {
  AvatarUpload,
  ChangePasswordForm,
  DoctorPracticeForm,
  ProfileDetailsForm,
} from "./ProfileForms";

export function ProfilePage() {
  const me = useCurrentUser();
  return (
    <div className="space-y-6">
      <AvatarUpload me={me} />
      <ProfileDetailsForm key={`${me.id}-${me.name}`} me={me} />
      {me.role === "DOCTOR" && me.doctor && <DoctorPracticeForm me={me} />}
      <ChangePasswordForm me={me} />
    </div>
  );
}
