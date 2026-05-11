import React from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';

const VerifyOtpForm = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Verify OTP</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Please enter the 6-digit code sent to your email.
        </p>
        <Input label="OTP Code" type="text" placeholder="123456" maxLength={6} className="text-center tracking-widest text-lg" />
        <Button className="w-full">Verify & Proceed</Button>
        <div className="text-center text-sm">
          <button className="text-primary hover:underline">Resend OTP</button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifyOtpForm;
