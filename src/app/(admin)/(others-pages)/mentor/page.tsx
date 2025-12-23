import Calendar from "@/components/mentor/mentor";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Mentor Calendar",
  description:
    "Mentor Calendar",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Mentor Calendar" />
      <Calendar />
    </div>
  );
}
