import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { OAuthStrategy } from '@clerk/shared/types'
import toast, { Toaster } from "react-hot-toast"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { signIn } = useSignIn()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async () => {
    if (!emailAddress || !password) {
      return;
    }

    setSubmitting(true)
    const { error } = await signIn.password({
      emailAddress,
      password,
    })
    if (error) {
      console.error(JSON.stringify(error, null, 2))
      setError(error.message)
      setSubmitting(false)
      toast.error(error.message || "Something went wrong. Please try again.")
      return
    }

    if (signIn.status === 'complete') {
      setSubmitting(false)
      setError("")
      toast.success('Successfully logged in!');
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl('/dashboard')
          if (url.startsWith('http')) {
            window.location.href = url
          } else {
            router.push(url)
          }
        },
      })
    } else {
      console.error('Sign-in attempt not complete:', signIn)
    }
  }

  const signInWith = async (strategy: OAuthStrategy) => {
    const { error } = await signIn.create({
      strategy,
      redirectUrl: '/sso-callback',
      actionCompleteRedirectUrl: '/dashboard',
    })
    if (error) {
      console.error(JSON.stringify(error, null, 2))
      toast.error(error.message || "Something went wrong. Please try again.")
      return
    }
  }


  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <Toaster position="bottom-left"/>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <Button 
            className="cursor-pointer"
            type="button" 
            onClick={handleSubmit} 
            disabled={submitting}>
              Login
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button className="cursor-pointer" variant="outline" type="button" onClick={() => signInWith('oauth_google')}>
            <img src="/google.png" alt="google logo" className="size-5 rounded-md" />
            Login with Google
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
