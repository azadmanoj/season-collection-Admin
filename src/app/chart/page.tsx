import Chart from "@/components/Charts/page";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

export const metadata: Metadata = {
  title: " Season Collection Chart |  Season Collection",
  description: "This is  Season Collection Chart page for  Admin Dashboard ",
  icons: {
    icon: "/images/logo/logoNew.ico", // This references the favicon in the public directory
  },
};

const BasicChartPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Chart />
    </DefaultLayout>
  );
};

export default BasicChartPage;
