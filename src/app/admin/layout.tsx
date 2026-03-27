import AdminLayout from "@/components/layouts/adminLayout";

export default function AdminPages({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
