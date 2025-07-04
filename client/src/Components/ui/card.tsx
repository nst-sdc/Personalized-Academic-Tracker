import * as React from "react";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm" +
        (className ? " " + className : "")
      }
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6" +
        (className ? " " + className : "")
      }
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={
        "leading-none font-semibold" + (className ? " " + className : "")
      }
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={
        "px-6" + (className ? " " + className : "")
      }
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardContent };
