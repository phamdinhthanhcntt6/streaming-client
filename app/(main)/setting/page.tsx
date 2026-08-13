import AccountTab from "@/components/client/main/setting/AccountTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";

interface TabsTriggerComponentProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

const TabsTriggerComponent = ({
  title,
  value,
  icon,
}: TabsTriggerComponentProps) => {
  return (
    <TabsTrigger
      value={value}
      className="data-active:bg-[#1A75FF] data-active:text-white data-active:font-semibold transition-none! hover:decoration-none!"
    >
      {icon && <span className="mr-1">{icon}</span>}
      {title}
    </TabsTrigger>
  );
};

const TABTRIGGER = [
  { title: "Account", value: "account", icon: <User /> },
  { title: "Content", value: "content", icon: <User /> },
  { title: "Notifications", value: "notifications", icon: <User /> },
  { title: "Privacy", value: "privacy", icon: <User /> },
  { title: "Advvertising", value: "advertising", icon: <User /> },
];

const TABSCONTENT = [{ value: "account", content: <AccountTab /> }];

const SettingPage = () => {
  return (
    <div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList
          className={`grid w-full grid-cols-${TABTRIGGER.length} h-12!`}
        >
          {TABTRIGGER.map((tab) => (
            <TabsTriggerComponent
              key={tab.value}
              title={tab.title}
              value={tab.value}
              icon={tab.icon}
            /> 
          ))}
        </TabsList>
        <div className="mt-4">
          {TABSCONTENT.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default SettingPage;
