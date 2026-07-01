import { AuthCallbackClient } from "./auth-callback-client";

type AuthCallbackPageProps = {
  searchParams?: Promise<{
    token?: string;
    auth_error?: string;
    next?: string;
  }>;
};

export default async function AuthCallbackPage({ searchParams }: AuthCallbackPageProps) {
  const params = (await searchParams) ?? {};

  return <AuthCallbackClient authError={params.auth_error} token={params.token} nextPath={params.next} />;
}
