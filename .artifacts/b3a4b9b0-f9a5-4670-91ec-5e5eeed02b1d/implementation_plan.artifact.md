# Admin Messages Management Modernization

This plan details the upgrade of the Admin "Manage Messages" page to be more interactive, visually attractive, and functional, including direct reply capabilities via Email and WhatsApp.

## User Review Required

> [!IMPORTANT]
> - I will add a **"Status"** feature to messages (e.g., Unread, Replied) to help you track your work. This requires a minor backend database update.
> - Direct reply buttons will use your system's default email client (`mailto:`) and WhatsApp Web/Desktop (`wa.me`) for instant communication.

## Proposed Changes

### [Backend Logic]

#### [MODIFY] [Contact.js](file:///D:/Esron/backend/src/models/Contact.js)
- Add a `status` field to the schema with a default value of `'unread'` (options: `'unread'`, `'read'`, `'replied'`).

#### [MODIFY] [contact.controller.js](file:///D:/Esron/backend/src/controllers/contact.controller.js)
- Add an `updateContactStatus` function to allow the admin to toggle the message status.

### [Frontend UI/UX]

#### [MODIFY] [ManageContacts.tsx](file:///D:/Esron/frontend/src/pages/admin/ManageContacts.tsx)
- **Advanced Card Design**:
    - Use a more refined "glass-dark" effect with subtle borders and shadows.
    - Add a vertical status indicator bar on the left of each card.
- **Interactive Action Bar**:
    - **"Reply via Email"**: Button with `Mail` icon, opens email client with pre-filled subject ("Re: [Subject]") and greeting.
    - **"Reply via WhatsApp"**: Button with `MessageCircle` icon, opens WhatsApp with a pre-filled message ("Hi [Name], I'm replying to your message regarding...").
    - **"Mark as Replied"**: A toggle/checkbox that updates the message status in the database.
- **Dynamic Stats**:
    - Add a small "Stats Header" showing total messages, unread messages, and replied messages.
- **Search & Filter**:
    - Add a search bar to find messages by name, email, or subject.

## Verification Plan

### Manual Verification
- **Status Toggling**: Click "Mark as Replied" and verify the card's visual state updates and persists after refresh.
- **Email Reply**: Click "Reply via Email" and ensure it opens the mail app with correct recipient and subject.
- **WhatsApp Reply**: Click "Reply via WhatsApp" and ensure it opens the correct chat with the pre-filled message.
- **Responsive Layout**: Verify the new action buttons look good on tablet and mobile views.
- **Visuals**: Confirm the use of animations (Framer Motion) for status changes and card entrance.
