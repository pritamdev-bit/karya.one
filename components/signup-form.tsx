import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useSignIn, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { OAuthStrategy } from '@clerk/shared/types'
import { toast, Toaster } from 'react-hot-toast';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const [verifying, setVerifying] = useState(false)
  const [submitting , setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter();

  const handleSubmit = async () => {
    if (!emailAddress || !password || !confirmPassword || !firstName || !lastName) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    try {
      setSubmitting(true)
      const { error } = await signUp.password({
        emailAddress,
        password,
        firstName,
        lastName,
      })

      if (error) {
        console.error('password error:', JSON.stringify(error, null, 2))
        setError(error.message)
        return
      }

      // console.log('password step done, sending email code...')
      await signUp.verifications.sendEmailCode()
      // console.log('email code sent!')
      setVerifying(true)
      setSubmitting(false)
    } catch (err) {
      console.error('caught exception:', err)
      toast.error('Something went wrong. Please try again.')
    }
  }

  const signInWith = async (strategy: OAuthStrategy) => {
    const { error } = await signIn.sso({
      strategy,
      redirectCallbackUrl: '/sso-callback',
      redirectUrl: '/dashboard',
    })
    if (error) {
      console.error(JSON.stringify(error, null, 2))
      toast.error(error.message || "Something went wrong. Please try again.")
      return
    }
  }

  const handleVerify = async () => {
    if (!code) return
    setSubmitting(true)
    await signUp.verifications.verifyEmailCode({
      code,
    })
    if (signUp.status === 'complete') {
      setVerifying(false)
      setError("")
      setCode("")
      setSubmitting(false)
      toast.success('Successfully verified!')

      await signUp.finalize({
        // Redirect the user to the home page after signing up
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
      // Check why the sign-up is not complete
      console.error('Sign-up attempt not complete:', signUp)
    }
  }

  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0 &&
    verifying
  ) {
    return (
      <Card className="mx-auto max-w-md">
        <Toaster position="bottom-left"/>
        <CardHeader>
          <CardTitle>Verify your login</CardTitle>
          <CardDescription>
            Enter the verification code we sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <div>
              <FieldLabel htmlFor="otp-verification">
                Verification code
              </FieldLabel>
            </div>
            <InputOTP maxLength={6} id="otp-verification" required value={code} onChange={(e) => setCode(e)}>
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-2" />
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Field>
        </CardContent>
        <CardFooter>
          <Field>
            <Button type="submit" className="w-full" onClick={handleVerify}>
              Verify
            </Button>
            <div className="text-sm text-muted-foreground">
              Having trouble signing in?{" "}
              <a
                href="#"
                className="underline underline-offset-4 transition-colors hover:text-primary"
              >
                Contact support
              </a>
            </div>
          </Field>
        </CardFooter>
      </Card>
    )
  } else {
    return (
      <form className={cn("flex flex-col gap-6", className)} {...props}>
        <Toaster position="bottom-left"/>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            {error && <p className="text-red-500">{error}</p>}
            <p className="text-sm text-balance text-muted-foreground">
              Fill in the form below to create your account
            </p>
          </div>
          <FieldGroup className="flex lg:flex-row">
            <Field>
              <FieldLabel htmlFor="name">First Name</FieldLabel>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                id="firstname"
                type="text"
                placeholder="John"
                required
                className="bg-background"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="name">Last Name</FieldLabel>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                id="lastname"
                type="text"
                placeholder="Doe"
                required
                className="bg-background"
              />
            </Field>
          </FieldGroup>
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
            <FieldDescription>
              We&apos;ll use this to contact you. We will not share your email
              with anyone else.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
              required
              className="bg-background"
            />
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="confirm-password"
              type="password"
              required
              className="bg-background"
            />
            <FieldDescription>Please confirm your password.</FieldDescription>
          </Field>
          <Field>
            <Button
              disabled={submitting}
              onClick={handleSubmit}
              type="button"
              className="cursor-pointer">
              Create Account
            </Button>
          </Field>
          <FieldSeparator>Or continue with</FieldSeparator>
          <Field>
            <Button
              onClick={() => signInWith('oauth_google')}
              variant="outline"
              type="button"
              className="cursor-pointer">
              <img src="/google.png" alt="google logo" className="size-5 rounded-md" />
              Sign up with Google
            </Button>
            <div id="clerk-captcha" />
            <FieldDescription className="px-6 text-center">
              Already have an account? <Link href="/sign-in">Sign in</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    )
  }
}
