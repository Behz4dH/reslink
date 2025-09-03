import { LoginForm } from "@/components/login-form"

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}