import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "Season Collection Dashboard | Season Collection",
  description: "This is Season Collection Dashboard ",
  icons: {
    icon: "/images/logo/logoNew.ico", // This references the favicon in the public directory
  },
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </>
  );
}
