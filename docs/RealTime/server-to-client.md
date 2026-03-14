---
id: server-to-client-events
title: Server To Client
---

# message:new

This event is send when new message arrived!

## Response Payload

```typescript
{
  messageId: string,
  conversationId: string,
  senderId: string,
  content: string
}
```

# presence:change

This event is send when user presence change

## Response Payload

```typescript
{
  userId: string;
  state: "online" | "offline";
}
```
