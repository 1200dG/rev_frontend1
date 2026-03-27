import Layout from "@/components/auth";
import BaseLayout from "@/components/layouts/BaseLayout";
import { AuthProps } from "@/lib/types/common/types";

export default function AuthLayout(props: AuthProps) {
  return (
    <BaseLayout>
      <Layout>
        <div>{props.children}</div>
      </Layout>
    </BaseLayout>
  );
}
