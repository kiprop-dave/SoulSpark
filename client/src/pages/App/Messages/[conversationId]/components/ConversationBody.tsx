import { Message, User } from '@/api/conversations';

type ConversationBodyProps = {
  messages: Message[];
  otherUser: User;
};

export default function ConversationBody({ messages }: ConversationBodyProps): JSX.Element {
  return <div>Messages go here</div>;
}
