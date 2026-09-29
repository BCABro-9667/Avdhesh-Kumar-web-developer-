import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
  style = {},
}) => {
  const variantClass =
    variant === "circular"
      ? "rounded-full"
      : variant === "text"
      ? "rounded-md h-4 my-1"
      : "rounded-2xl";

  return (
    <div
      className={`skeleton-shimmer ${variantClass} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      aria-hidden="true"
    />
  );
};

/* -------------------------------------------------------------------------- */
/* BLOG SKELETONS                                                             */
/* -------------------------------------------------------------------------- */

export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-[#FAF8F2] border border-[#141413]/20 shadow-[3px_3px_0px_rgba(20,20,19,0.12)] select-none pointer-events-none overflow-hidden flex flex-col md:flex-row items-stretch min-h-[240px] md:h-[280px]">
      <div className="w-full md:w-[320px] lg:w-[380px] xl:w-[420px] shrink-0 h-[200px] md:h-full bg-[#141413]/5 p-4 flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-20 h-5 rounded-full" />
            <Skeleton className="w-24 h-5 rounded-md" />
          </div>
          <Skeleton className="w-3/4 h-7 rounded-lg" />
          <Skeleton className="w-full h-4 rounded-md" />
          <Skeleton className="w-4/5 h-4 rounded-md" />
        </div>
        <div className="pt-3 border-t border-[#141413]/10 flex items-center justify-between">
          <div className="flex gap-1.5">
            <Skeleton className="w-14 h-5 rounded-full" />
            <Skeleton className="w-16 h-5 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const BlogGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const BlogPostDetailSkeleton: React.FC = () => {
  return (
    <div className="pt-24 sm:pt-36 pb-24 min-h-screen bg-[#F5F2EA] select-none pointer-events-none">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6 sm:mb-8">
          <Skeleton className="w-32 h-6 rounded-full" />
        </div>

        {/* Header Metadata */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <Skeleton className="w-24 h-7 rounded-full" />
            <Skeleton className="w-24 h-4 rounded-md" />
            <Skeleton className="w-36 h-4 rounded-md hidden sm:block" />
          </div>

          {/* Large Title */}
          <div className="space-y-2.5">
            <Skeleton className="w-full h-10 sm:h-14 rounded-xl" />
            <Skeleton className="w-4/5 h-10 sm:h-14 rounded-xl" />
          </div>

          {/* Excerpt */}
          <div className="space-y-2 pt-2">
            <Skeleton className="w-full h-5 rounded-lg" />
            <Skeleton className="w-5/6 h-5 rounded-lg" />
          </div>

          {/* Tags & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#141413]/15">
            <div className="flex gap-2">
              <Skeleton className="w-20 h-7 rounded-full" />
              <Skeleton className="w-24 h-7 rounded-full" />
              <Skeleton className="w-18 h-7 rounded-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-24 h-9 rounded-full" />
              <Skeleton className="w-28 h-9 rounded-full" />
            </div>
          </div>
        </div>

        {/* Featured Image Banner */}
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl sm:rounded-3xl border-2 border-[#141413]/20 mb-8 sm:mb-12 overflow-hidden shadow-[8px_8px_0px_#D4F050]/40">
          <Skeleton className="w-full h-full rounded-2xl sm:rounded-3xl" />
        </div>

        {/* Article Body Skeleton */}
        <div className="bg-[#FAF8F2] border-2 border-[#141413]/20 rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#141413]/10 space-y-6">
          <Skeleton className="w-48 h-8 rounded-lg" />
          <div className="space-y-2.5">
            <Skeleton className="w-full h-4 rounded-md" />
            <Skeleton className="w-full h-4 rounded-md" />
            <Skeleton className="w-11/12 h-4 rounded-md" />
            <Skeleton className="w-4/5 h-4 rounded-md" />
          </div>

          {/* Quote callout skeleton */}
          <div className="p-6 rounded-2xl border-l-4 border-[#D4F050] bg-[#ECE8DD]/40 space-y-2">
            <Skeleton className="w-full h-4 rounded-md" />
            <Skeleton className="w-2/3 h-4 rounded-md" />
          </div>

          <div className="space-y-2.5">
            <Skeleton className="w-full h-4 rounded-md" />
            <Skeleton className="w-full h-4 rounded-md" />
            <Skeleton className="w-5/6 h-4 rounded-md" />
          </div>

          {/* Code block skeleton */}
          <div className="p-6 rounded-2xl bg-[#141413]/10 space-y-2">
            <Skeleton className="w-3/4 h-4 rounded-md" />
            <Skeleton className="w-1/2 h-4 rounded-md" />
            <Skeleton className="w-2/3 h-4 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* PROJECT SKELETONS                                                          */
/* -------------------------------------------------------------------------- */

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-[#FAF8F2] border-2 border-[#141413]/20 flex flex-col justify-between shadow-[6px_6px_0px_#141413]/10 select-none pointer-events-none">
      <div>
        {/* Photo Banner with Category in Top Left Corner */}
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 sm:mb-5 bg-[#141413]/5 border border-[#141413]/10">
          <Skeleton className="w-full h-full rounded-2xl" />
          <div className="absolute top-3 left-3">
            <Skeleton className="w-24 h-6 rounded-full" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2 mb-5">
          <Skeleton className="w-full h-7 rounded-xl" />
          <Skeleton className="w-3/4 h-7 rounded-xl" />
        </div>
      </div>

      {/* Action Footer: Explore + Preview (icon) + Like (icon) */}
      <div className="pt-4 border-t border-[#141413]/10 flex items-center justify-between gap-3">
        <Skeleton className="w-24 sm:w-28 h-10 rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const ProjectsGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ProjectDetailSkeleton: React.FC = () => {
  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto select-none pointer-events-none">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="w-12 h-4 rounded-md" />
        <span className="text-[#141413]/20">/</span>
        <Skeleton className="w-16 h-4 rounded-md" />
        <span className="text-[#141413]/20">/</span>
        <Skeleton className="w-28 h-4 rounded-md" />
      </div>

      {/* Category + Date */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-28 h-7 rounded-full" />
        <Skeleton className="w-32 h-4 rounded-md" />
      </div>

      {/* Title */}
      <div className="space-y-2 mb-4">
        <Skeleton className="w-full h-10 sm:h-14 rounded-2xl" />
        <Skeleton className="w-3/4 h-10 sm:h-14 rounded-2xl" />
      </div>

      {/* Subtitle */}
      <div className="space-y-2 mb-8">
        <Skeleton className="w-full h-5 rounded-lg" />
        <Skeleton className="w-4/5 h-5 rounded-lg" />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Skeleton className="w-36 h-11 rounded-2xl" />
        <Skeleton className="w-32 h-11 rounded-2xl" />
        <Skeleton className="w-28 h-11 rounded-2xl" />
      </div>

      {/* Featured Banner Screenshot */}
      <div className="w-full aspect-video rounded-3xl border-2 border-[#141413]/20 overflow-hidden mb-12 shadow-[8px_8px_0px_#141413]/10">
        <Skeleton className="w-full h-full rounded-3xl" />
      </div>

      {/* Project Content / Details */}
      <div className="space-y-10">
        <div className="bg-[#FAF8F2] border-2 border-[#141413]/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-[6px_6px_0px_#141413]/10">
          <Skeleton className="w-40 h-7 rounded-xl" />
          <div className="space-y-2.5">
            <Skeleton className="w-full h-4 rounded-md" />
            <Skeleton className="w-full h-4 rounded-md" />
            <Skeleton className="w-11/12 h-4 rounded-md" />
            <Skeleton className="w-4/5 h-4 rounded-md" />
          </div>
        </div>

        {/* Tech stack */}
        <div className="bg-[#FAF8F2] border-2 border-[#141413]/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-[6px_6px_0px_#141413]/10">
          <Skeleton className="w-32 h-7 rounded-xl" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="w-20 h-7 rounded-full" />
            <Skeleton className="w-24 h-7 rounded-full" />
            <Skeleton className="w-18 h-7 rounded-full" />
            <Skeleton className="w-28 h-7 rounded-full" />
            <Skeleton className="w-22 h-7 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* GALLERY SKELETONS                                                          */
/* -------------------------------------------------------------------------- */

export const GalleryItemSkeleton: React.FC = () => {
  return (
    <div className="bg-[#FAF8F2] border-2 border-[#141413]/20 rounded-3xl overflow-hidden shadow-[4px_4px_0px_#141413]/10 select-none pointer-events-none flex flex-col">
      <div className="relative aspect-[4/3] bg-[#141413]/5">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute top-3 left-3">
          <Skeleton className="w-20 h-5 rounded-full" />
        </div>
      </div>
      <div className="p-5 space-y-2">
        <Skeleton className="w-3/4 h-5 rounded-lg" />
        <Skeleton className="w-full h-3.5 rounded-md" />
      </div>
    </div>
  );
};

export const GalleryGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <GalleryItemSkeleton key={i} />
      ))}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* BUY ME A CHAI SUPPORTERS SKELETON                                          */
/* -------------------------------------------------------------------------- */

export const SupporterCardSkeleton: React.FC = () => {
  return (
    <div className="p-5 rounded-3xl bg-[#FAF8F2] border-2 border-[#141413]/20 shadow-[4px_4px_0px_#141413]/10 select-none pointer-events-none space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="w-28 h-4 rounded-md" />
            <Skeleton className="w-16 h-3 rounded-md" />
          </div>
        </div>
        <Skeleton className="w-20 h-7 rounded-full" />
      </div>
      <div className="p-3.5 rounded-2xl bg-white/70 border border-[#141413]/10 space-y-1.5">
        <Skeleton className="w-full h-3.5 rounded-md" />
        <Skeleton className="w-4/5 h-3.5 rounded-md" />
      </div>
    </div>
  );
};

export const ChaiSupportersSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SupporterCardSkeleton key={i} />
      ))}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* ADMIN DASHBOARD & TABLES SKELETONS                                         */
/* -------------------------------------------------------------------------- */

export const AdminDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 select-none pointer-events-none">
      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 rounded-3xl bg-[#FAF8F2] border-2 border-[#141413]/20 shadow-[4px_4px_0px_#141413]/10 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-24 h-4 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-xl" />
            </div>
            <Skeleton className="w-16 h-8 rounded-lg" />
            <Skeleton className="w-28 h-3.5 rounded-md" />
          </div>
        ))}
      </div>

      {/* Recent items skeleton */}
      <div className="bg-[#FAF8F2] border-2 border-[#141413]/20 rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_#141413]/10 space-y-4">
        <Skeleton className="w-40 h-6 rounded-lg" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/70 border border-[#141413]/10 flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="w-48 h-4 rounded-md" />
                <Skeleton className="w-24 h-3 rounded-md" />
              </div>
              <Skeleton className="w-20 h-7 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdminListSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="divide-y divide-[#141413]/10 select-none pointer-events-none">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="w-40 sm:w-60 h-4 rounded-md" />
              <Skeleton className="w-24 sm:w-36 h-3 rounded-md" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="w-8 h-8 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const AdminCardsSkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 select-none pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#FAF8F2] border-2 border-[#141413]/20 rounded-3xl p-6 shadow-[4px_4px_0px_#141413]/10 space-y-4">
          <div className="aspect-video bg-[#141413]/5 rounded-2xl overflow-hidden">
            <Skeleton className="w-full h-full rounded-2xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-20 h-5 rounded-full" />
            <Skeleton className="w-full h-5 rounded-lg" />
            <Skeleton className="w-3/4 h-3.5 rounded-md" />
          </div>
          <div className="pt-3 border-t border-[#141413]/10 flex justify-between">
            <Skeleton className="w-16 h-4 rounded-md" />
            <div className="flex gap-1.5">
              <Skeleton className="w-7 h-7 rounded-lg" />
              <Skeleton className="w-7 h-7 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
