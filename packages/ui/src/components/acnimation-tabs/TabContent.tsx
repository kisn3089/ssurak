import { TabsContent } from "@ssurak/ui/components/animate-ui/components/tabs";
import { Button } from "@ssurak/ui/components/buttons/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ssurak/ui/components/layouts/card";
import { Input } from "@ssurak/ui/components/forms/input";
import { Label } from "@ssurak/ui/components/forms/label";

export type CardField = {
  id: string;
  label: string;
  value: string;
  defaultValue?: string;
};

type TabContentProps = {
  title: string;
  description: string;
  cardFields: CardField[];
};
export default function TabContent({
  title,
  description,
  cardFields,
}: TabContentProps) {
  return (
    <TabsContent value="account">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {cardFields.map((field) => (
            <div className="grid gap-3" key={field.id}>
              <Label htmlFor={`tabs-${field.id}`}>{field.label}</Label>
              <Input
                id={`tabs-${field.id}`}
                defaultValue={field.value || field.defaultValue}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
