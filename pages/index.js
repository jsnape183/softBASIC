import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "../components/Card";
import Layout from "../components/Auth";
import { useFetchUser } from "../lib/user";

function IndexPage() {
  const { user, loading } = useFetchUser();

  return (
    <Layout user={user} loading={loading}>
      <Link href="/create">Create a new Project!</Link>
    </Layout>
  );
}

export default IndexPage;
