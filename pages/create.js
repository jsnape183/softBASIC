import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFetchUser } from "../lib/user";

export default function CreatePage() {
  const { user, loading } = useFetchUser();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const createProject = async () => {
      const res = await fetch(`../api/projects`, {
        method: "POST",
        body: JSON.stringify({ created_by: user?.sub }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      const data = await res.json();
      if (data.success) {
        router.push(`./editor/${data.data._id}`);
        setProject(data.data);
      }

      setError(data.error);
    };

    if (!project && router) {
      createProject();
    }
  }, [project, router]);

  return <div>{error}</div>;
}
