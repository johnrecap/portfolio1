# Dashboard Return-To-Site Button Design

**Date**: 2026-04-24  
**Status**: Approved for implementation  
**Area**: `dashboard header`

## Summary

Add a clear `View Site` / `عرض الموقع` button to the admin dashboard header so an authenticated user can return to the public website without relying on browser navigation or logging out.

## Problem

The dashboard currently provides internal navigation, settings access, and logout, but it does not provide a direct route back to the public site. That leaves the admin area feeling closed off and makes a common navigation action slower than it should be.

## Goals

- Add an obvious return-to-site action in the dashboard header.
- Keep the control visible without disrupting the existing header layout.
- Use dashboard-localized copy instead of reusing a generic string.
- Preserve the current dashboard routes, auth flow, and logout behavior.

## Non-Goals

- Redesigning the dashboard header layout
- Adding a second return-to-site action in the sidebar
- Changing dashboard authentication or routing rules
- Opening the public site in a new tab by default

## Options Considered

### 1. Add a labeled header button

Place a dedicated button in the dashboard header near the existing header controls and route it to `/`.

Pros:

- Most discoverable option
- Matches the approved request directly
- Easy to use on every dashboard screen

Cons:

- Uses more horizontal space than an icon-only control

### 2. Add an icon-only header shortcut

Place a compact icon button in the dashboard header that routes to `/`.

Pros:

- Minimal visual footprint

Cons:

- Lower clarity than a labeled button
- Easier to miss, especially for less technical users

### 3. Add the action in the sidebar only

Add a link above logout in the dashboard sidebar.

Pros:

- Fits the navigation rail pattern

Cons:

- Less visible than a header action
- Does not match the approved placement

## Recommended Approach

Implement option 1 only:

- Add a new header button in `DashboardLayout` that routes to `/`.
- Add a new `dashboardLayout.viewSite` translation key in both locale files.
- Keep the button visible in the header on desktop and mobile, while using a compact layout on smaller screens.
- Leave the sidebar, logout action, and dashboard module navigation unchanged.

## Error Handling

No new runtime logic is introduced beyond a standard router link to the public homepage. The current public route handling remains responsible for rendering the site.

## Testing

- Verify the dashboard header shows the new return-to-site button in Arabic and English.
- Verify clicking the button routes to `/`.
- Verify the button remains accessible on smaller screens without overlapping existing controls.
- Verify settings and logout still work as before.
