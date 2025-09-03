import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import type { LoginRequest } from "@/types/auth"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      await login(credentials)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const fillGuestDemo = () => {
    setCredentials({ username: 'guest', password: 'guest123' })
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login to ResLink</CardTitle>
          <CardDescription>
            Enter your username and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
            
            <div className="mt-4 text-center text-sm">
              <div className="mb-2 text-gray-600">Try Demo Account:</div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={fillGuestDemo}
              >
                Guest Demo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
