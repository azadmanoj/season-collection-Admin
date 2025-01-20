import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Product from "@/components/Product/Product";
import Orders from "@/components/Orders/Orders";

export const metadata: Metadata = {
  title: " Season Collection Product |  Season Collection",
  description: "This is  Season Collection Product page for  Admin Dashboard ",
  icons: {
    icon: "/images/logo/logoNew.ico", // This references the favicon in the public directory
  },
};

const OrderPage = () => {
  return (
    <DefaultLayout>
      <Orders />
    </DefaultLayout>
  );
};

export default OrderPage;
