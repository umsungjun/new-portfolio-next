import ChatBody from "./body";
import ChatHeader from "./header";

export default async function Chat() {
  return (
    <section
      className="w-full max-w-[475px] web:w-[475px] h-dvh border-x bg-gradient-to-b"
      style={{
        borderColor: "var(--color-border-subtle)",
        backgroundImage:
          "linear-gradient(to bottom, var(--color-bg-chat), var(--color-bg-primary))",
      }}
    >
      <ChatHeader />
      <ChatBody />
    </section>
  );
}
