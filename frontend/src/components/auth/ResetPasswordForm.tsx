import React from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';

const ResetPasswordForm = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input label="New Password" type="password" placeholder="••••••••" />
        <Input label="Confirm New Password" type="password" placeholder="••••••••" />
        <Button className="w-full">Update Password</Button>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
