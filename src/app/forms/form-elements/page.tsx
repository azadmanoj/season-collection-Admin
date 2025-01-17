import React from "react";
import FormElements from "@/components/FormElements";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: " Season Collection Form Elements |  Season Collection ",
  description:
    "This is  Season Collection Form Elements page for  Admin Dashboard",
    icons: {
      icon: "/images/logo/logoNew.ico", // This references the favicon in the public directory
    },
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <FormElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
