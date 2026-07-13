import {
  TabsList,
  TabsTrigger,
} from "@ssurak/ui/components/animate-ui/components/tabs";

export default function AnimationTabList() {
  return (
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
  );
}
