import Calendar from "@/components/Calender";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Product from "@/components/Product/Product";

export const metadata: Metadata = {
  title: " Season Collection Product |  Season Collection",
  description: "This is  Season Collection Product page for  Admin Dashboard ",
  icons: {
    icon: "/images/logo/logoNew.ico", // This references the favicon in the public directory
  },
};

const ProductPage = () => {
  return (
    <DefaultLayout>
      <Product />
    </DefaultLayout>
  );
};

export default ProductPage;
