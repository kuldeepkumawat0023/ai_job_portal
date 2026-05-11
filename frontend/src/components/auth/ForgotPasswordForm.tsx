import React from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import Link from 'next/link';

const ForgotPasswordForm = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Enter your email and we'll send you an OTP to reset your password.
        </p>
        <Input label="Email" type="email" placeholder="alex@example.com" />
        <Button className="w-full">Send OTP</Button>
        <div className="text-center text-sm">
          <Link href="/login" title="Back to login" className="text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
