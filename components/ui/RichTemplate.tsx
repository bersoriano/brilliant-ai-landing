// Destination: components/ui/RichTemplate.tsx
// Renders an already-translated template ("Help us {task}.") with React nodes
// in its placeholders, so emphasized words can be wrapped in <em>.
//   const { t } = useLanguage();
//   <RichTemplate template={t("Help us {task}.")} values={{ task: <em>{phrase}</em> }} />
// Calling t() with a literal and no variables keeps the key visible to the
// "every literal translation call has a Spanish entry" test.
import { Fragment, type ReactNode } from "react";

export function RichTemplate({
  template,
  values,
}: {
  template: string;
  values: Record<string, ReactNode>;
}) {
  const parts = template.split(/(\{\w+\})/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = /^\{(\w+)\}$/.exec(part);
        return (
          <Fragment key={i}>{match && match[1] in values ? values[match[1]] : part}</Fragment>
        );
      })}
    </>
  );
}

/** "Get invoices ready to approve" → "get invoices ready to approve" (the sentence-case key). */
export const lowerFirst = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
