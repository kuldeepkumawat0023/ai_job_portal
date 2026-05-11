import React from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/common/Card';
import Link from 'next/link';

const LoginForm = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login to AIHireX</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input label="Email" type="email" placeholder="alex@example.com" />
        <Input label="Password" type="password" placeholder="••••••••" />
        <div className="text-right text-sm">
          <Link href="/forgot-password" title="Reset your password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button className="w-full">Login</Button>
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        <span className="text-muted-foreground mr-1">Don't have an account?</span>
        <Link href="/register" title="Create an account" className="text-primary hover:underline font-medium">
          Register Now
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
