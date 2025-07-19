
import { format, isToday, isYesterday } from "date-fns";
import { Doc, Id } from "../../convex/_generated/dataModel";

export type ReactionsWithoutMembers = {
    _id: Id<"reactions">;
    _creationTime: number;
    workspace: Id<"workspaces">;
    message: Id<"messages">;
    value: string;
    count: number;
    memberIds: Id<"members">[];
}[]


export type MessageType = {
  _id: Id<'messages'>;
  _creationTime: number; // Convex timestamp
  member:Doc<'members'>;
  user:Doc<'users'>;
  reactions:ReactionsWithoutMembers;
  updated:number | null;
  message:string;
  image:string | undefined;
  threadCount: number;
  threadImage: string | null;
  threadTimestamp: number;
  threadName?:string;
};

type GroupedMessages = {
  [label: string]: MessageType[];
};

export function groupMessagesByDate(messages:MessageType[]): GroupedMessages | null {

  if(!messages || messages
    .length == 0) return null;

  const groups: GroupedMessages = {};

  messages.forEach((msg) => {
    const date = new Date(msg._creationTime);

    let label: string;

    if (isToday(date)) {
      label = "Today";
    } else if (isYesterday(date)) {
      label = "Yesterday";
    } else {
      label = format(date, "MMMM d, yyyy"); // Example: June 26, 2025
    }

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(msg);
  });

  return groups;
}
