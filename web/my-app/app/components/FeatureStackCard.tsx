"use client";

import Link from "next/link";

type FeatureStackCardProps = {
  title: string;
  description: string;
  href: string;
};

export default function FeatureStackCard({
  title,
  description,
  href,
}: FeatureStackCardProps) {
  return (
    <Link href={href}>
      <div className="group cursor-pointer max-w-md rounded-2xl border border-white/10 
        bg-black/40 backdrop-blur-xl p-6 shadow-lg transition-all duration-500
        hover:border-red-500 hover:shadow-red-500/20">
        
        <h3 className="text-2xl font-semibold mb-2 group-hover:text-red-400">
          {title}
        </h3>

        <p className="text-gray-400 text-sm">
          {description}
        </p>
      </div>
    </Link>
  );
}
