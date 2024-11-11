import { useRouter } from "next/router";
import React from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

const BreadcrumbComponent = () => {
  const router = useRouter();
  const pathSegments = router.pathname.split("/").filter((segment) => segment); // Splits URL into segments

  if (router.pathname === '/app' || router.pathname === '/') {
    return null;
  }
  const createLinkPath = (index: number) => {
    return `/${pathSegments.slice(0, index + 1).join("/")}`;
  };

  return (
    <div className="w-full bg-background mt-36 py-4 px-6 xs:mt-44 sm:mt-44 md:px-10 lg:px-12 xl:px-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {pathSegments.map((segment, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator className="hidden sm:block" />
              <BreadcrumbItem>
                {index < pathSegments.length - 1 ? (
                  <BreadcrumbLink href={createLinkPath(index)}>
                    {segment.charAt(0).toUpperCase() + segment.slice(1)} {/* Capitalize */}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>
                    {segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbComponent;
