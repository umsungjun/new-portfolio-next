import ChatBody from "./body";
import ChatHeader from "./header";

export default async function Chat() {
  return (
    <section className="max-w-[475px] w-[475px] h-dvh border-x border-slate-200/60 bg-gradient-to-b from-slate-50 to-white">
      <ChatHeader />
      <ChatBody />
    </section>
  );
}
