import React from "react";
import { MessageType } from "./index";
import { User, Bot } from "lucide-react";

export const Message = ({ message }: { message: MessageType }) => {
  return (
    <div
      key={message.id}
      className={`flex gap-3 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex gap-3 max-w-[80%] ${
          message.role === "user" ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.role === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          {message.role === "user" ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>
        <div
          className={`rounded-lg p-3 ${
            message.role === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {!!message.proposedChanges && (
            <div className="mt-2 p-2 bg-background/10 rounded border">
              <p className="text-xs font-medium">Proposed Changes Ready</p>
              <p className="text-xs opacity-80">Click to review and confirm</p>
            </div>
          )}
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs opacity-60">
              {message.timestamp}
            </p>
            {message.messageId && (
              <p className="text-xs opacity-40 font-mono">
                ID: {message.messageId.slice(0, 8)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
