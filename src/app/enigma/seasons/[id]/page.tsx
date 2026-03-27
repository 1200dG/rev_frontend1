import SeasonDetail from "@/components/enigma/SeasonDetail";
import UserLayout from "@/components/layouts/userLayout";
import { SeasonDetailPageProps } from "@/lib/types/common/types";

export default async function SeasonDetailPage({ params }: SeasonDetailPageProps) {
  const { id } = await params;

  return (
    <UserLayout>
      <SeasonDetail seasonId={id} />
    </UserLayout>
  );
}
