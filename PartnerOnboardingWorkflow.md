# Partner Onboarding Workflow

## Goals
1.  **Intent Capture**: Enable users to self-identify as Partners ("Support Builders") during the onboarding process.
2.  **Smart Routing**: Route "Support Builders" users to a contextualized "Partner Home" instead of a generic dashboard.
3.  **Role & Permissions**: Suggest and facilitate the assignment of the "Partner" role with appropriate permissions (`host_events`, `access_partner_studio`, etc.).
4.  **Value Demonstration**: Immediately show value through a "Partner Operations Dashboard" that highlights active programs and member engagement.
5.  **Expansion**: Provide a subtle pathway to the Sponsor track ("Peek Mode") without disrupting the Partner experience.

## Checklist for Feature Completion

### 1. Welcome Gate (Choose Your Track)
- [ ] **UI Implementation**: Ensure "Support Builders" card is present and visualy distinct.
- [ ] **Copy Verification**:
    -   Title: "Support Builders"
    -   Description: "You’re here to contribute expertise, tools, or guidance that help members move forward. We’ll show you where you’re needed and how your impact shows up over time."
    -   CTA: "Continue →"
- [ ] **Logic**: Selection updates `publicMetadata.userTrack` to `support_builders`.

### 2. Contextual Home Base (Partner Dashboard)
- [ ] **Routing**: Users with `userTrack: 'support_builders'` are routed to the Partner Dashboard view.
- [ ] **Above-the-Fold Content**:
    -   Active programs/engagements.
    -   Upcoming sessions.
    -   Members using tools.
- [ ] **Journey Launcher**:
    -   Prioritize "Partner Studio" and "Member Engagement".
    -   Include "Integrations" and "Impact Hub".
- [ ] **Sponsor Peek**: "Extend Your Reach" section visible but unobtrusive.

### 3. Role Assignment
- [ ] **Metadata Sync**: Ensure `user_tracks` and `user_roles` are correctly conceptulized in the backend (or Clerk metadata).
- [ ] **Permissions**: Verify that being on the Partner Track allows access to Partner-specific routes (e.g., `/partner-studio`).

### 4. Verification & Testing
- [ ] **User Flow Test**: 
    1.  Sign up -> Select "Support Builders".
    2.  Verify redirection to Home Base.
    3.  Verify Home Base shows Partner-specific widgets.
- [ ] **Metadata Verification**: Check Clerk backend for correct metadata updates.