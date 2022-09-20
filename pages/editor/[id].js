import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Layout from "../../components/Auth";
import { useFetchUser } from "../../lib/user";
const EditorWrapper = dynamic(() => import("./EditorWrapper"), { ssr: false });

export default function EditorPage() {
  const { user, loading } = useFetchUser();
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  return (
    <Layout user={user} loading={loading}>
      <EditorWrapper id={id} />
    </Layout>
  );
}
