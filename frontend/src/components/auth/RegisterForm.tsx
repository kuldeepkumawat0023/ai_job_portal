import React from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/common/Card';
import Link from 'next/link';

const RegisterForm = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create your Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input label="Full Name" type="text" placeholder="Alex Chen" />
        <Input label="Email" type="email" placeholder="alex@example.com" />
        <Input label="Password" type="password" placeholder="••••••••" />
        <Input label="Confirm Password" type="password" placeholder="••••••••" />
        <Button className="w-full">Sign Up</Button>
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        <span className="text-muted-foreground mr-1">Already have an account?</span>
        <Link href="/login" title="Sign in to your account" className="text-primary hover:underline font-medium">
          Login here
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
