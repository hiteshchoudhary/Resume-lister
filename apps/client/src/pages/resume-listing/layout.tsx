import { ScrollArea } from "@reactive-resume/ui";
import { Outlet } from "react-router-dom";
import { Header } from "../home/components/header";

export const ResumeListingLayout = () => (
  <ScrollArea orientation="vertical" className="h-screen">
    <Header />
    <main className="py-[72px]">
      <Outlet />
    </main>
  </ScrollArea>
);
