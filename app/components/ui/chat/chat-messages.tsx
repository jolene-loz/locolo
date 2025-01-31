import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

import ChatActions from "./chat-actions";
import ChatMessage from "./chat-message";
import { ChatHandler } from "./chat.interface";
import Image from "next/image";
import { Chip } from "../chip";

const WelcomeMessage = () => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-2 mt-5">
        <Image src="/locolo.png" width={200} height={200} alt="Locolo" className="mx-auto rounded-2xl shadow mb-2" />
        <div className="text-center text-2xl text-gray-600">
          Hi, I&apos;m Locolo
        </div>
        <div className="mt-3 text-center max-w-[500px] mx-auto">
          Ask me something like&nbsp;&nbsp;<Chip value={"Meeting new people"} /><Chip value={"Romantic Jazz Night"} /><Chip value={"Techno Rave Party"} />
        </div>
      </div>
    </div>
  )
}

export default function ChatMessages(
  props: Pick<ChatHandler, "messages" | "isLoading" | "reload" | "stop">,
) {
  const scrollableChatContainerRef = useRef<HTMLDivElement>(null);
  const messageLength = props.messages.length;
  const lastMessage = props.messages[messageLength - 1];

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight;
    }
  };

  const isLastMessageFromAssistant =
    messageLength > 0 && lastMessage?.role !== "user";
  const showReload =
    props.reload && !props.isLoading && isLastMessageFromAssistant;
  const showStop = props.stop && props.isLoading;

  // `isPending` indicate
  // that stream response is not yet received from the server,
  // so we show a loading indicator to give a better UX.
  const isPending = props.isLoading && !isLastMessageFromAssistant;

  useEffect(() => {
    scrollToBottom();
  }, [messageLength, lastMessage]);

  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-xl pb-0">
      <div
        className="flex h-[60vh] flex-col gap-5 divide-y overflow-y-auto pb-4"
        ref={scrollableChatContainerRef}
      >
        {props.messages.length == 0
          ? <WelcomeMessage />
          : null}
        {props.messages.map((m, i) => {
          const isLoadingMessage = i === messageLength - 1 && props.isLoading;
          return (
            isLoadingMessage && m.role != "user"
              ? <div className="flex justify-center items-center pt-10">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              : <ChatMessage
                key={m.id}
                chatMessage={m}
                isLoading={isLoadingMessage}
              />
          );
        })}
        {isPending && (
          <div className="flex justify-center items-center pt-10">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      <div className="flex justify-end py-4">
        <ChatActions
          reload={props.reload}
          stop={props.stop}
          showReload={showReload}
          showStop={showStop}
        />
      </div>
    </div>
  );
}
