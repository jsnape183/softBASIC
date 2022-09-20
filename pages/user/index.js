import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../../components/Auth";
import Card from "../../components/Card";
import { useFetchUser } from "../../lib/user";

const UserPage = () => {
  const { user, loading } = useFetchUser();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      const res = await fetch("api/projects/");
      const json = await res.json();

      setProjects(json.data);
    };
    getProjects();
  }, []);

  return (
    <Layout user={user} loading={loading}>
      <h2>Projects</h2>
      <div style={{ display: "flex" }}>
        {projects?.map((p) => (
          <Card key={p._id}>
            <Link href={`/editor/${p._id}`}>
              {p.name ?? "Untitled Project"}
            </Link>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default UserPage;
