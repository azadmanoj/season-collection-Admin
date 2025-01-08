import Calendar from "@/components/Calender";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Product from "@/components/Product/Product";

export const metadata: Metadata = {
  title: " Season Collection Product |  Season Collection",
  description: "This is  Season Collection Product page for  Admin Dashboard ",
};

const ProductPage = () => {
  return (
    <DefaultLayout>
      <Product />
    </DefaultLayout>
  );
};

export default ProductPage;
