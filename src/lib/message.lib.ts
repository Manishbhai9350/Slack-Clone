
import { format, isToday, isYesterday } from "date-fns";

type Message = {
  _id: string;
  _creationTime: number; // Convex timestamp
  // other fields...
};

type GroupedMessages = {
  [label: string]: Message[];
};

export function groupMessagesByDate(messages:[]): GroupedMessages {

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
