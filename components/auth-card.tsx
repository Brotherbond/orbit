import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/images/orbit-logo.png";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="rounded-xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mx-auto mb-4">
          <Link href="/" passHref>
            <Image
              src={Logo}
              alt="Orbit Logo"
              width={120}
              height={120}
              className="h-21 w-21 object-contain drop-shadow-lg"
              priority
            />
          </Link>
        </div>
        <CardTitle className="text-center font-bold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-center">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
