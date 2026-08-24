import React from "react";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignmentClasses = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl mb-12 ${alignmentClasses}`}>
      {subtitle && (
        <span className="inline-block text-xs uppercase tracking-widest font-extrabold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200 mb-3">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
