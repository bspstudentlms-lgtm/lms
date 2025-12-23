import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import Mycourses from "@/components/ecommerce/Mycourses";

import DemographicCard from "@/components/ecommerce/DemographicCard";

export const metadata: Metadata = {
  title:
    "India’s Best Game Development college | Backstage Pass Institute of Gaming",
  description: "India’s Best Game Development college | Backstage Pass Institute of Gaming",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        
      </div>

      

      <div className="col-span-12 xl:col-span-12">
        <Mycourses />
      </div>
    </div>
  );
}
