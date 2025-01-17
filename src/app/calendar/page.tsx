import Calendar from "@/components/Calender";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: " Season Collection Calender |  Season Collection",
  description: "This is  Season Collection Calender page for  Admin Dashboard ",
  icons: {
    icon: "/images/logo/logoNew.ico", // This references the favicon in the public directory
  },
};

const CalendarPage = () => {
  return (
    <DefaultLayout>
      <Calendar />
    </DefaultLayout>
  );
};

export default CalendarPage;
