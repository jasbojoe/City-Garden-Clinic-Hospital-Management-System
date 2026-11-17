import Link from "next/link"

type Props = { searchParams: Promise<{ reason?: string }> }

export default async function AuthErrorPage({ searchParams }: Props) {
  const { reason } = await searchParams
  const expired = reason === "otp_expired" || reason === "link_expired_or_used"
  return <main className="flex min-h-svh items-center justify-center bg-background p-6"><section className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm"><h1 className="text-2xl font-semibold">{expired ? "This link is no longer valid" : "Unable to verify this link"}</h1><p className="mt-3 text-sm text-muted-foreground">{expired ? "The invitation or recovery link may have expired or already been used. Ask your clinic administrator to send a new invitation, or request a fresh password reset." : "The authentication link could not be verified. Make sure you opened the complete, most recent email link. You can request a new reset or contact your clinic administrator for another invitation."}</p><div className="mt-6 flex flex-col gap-3"><Link href="/auth/forgot-password" className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80">Request password reset</Link><Link href="/" className="text-center text-sm text-primary hover:underline">Back to sign in</Link></div></section></main>
}
