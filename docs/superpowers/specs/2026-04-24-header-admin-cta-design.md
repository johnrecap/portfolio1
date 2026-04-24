# Header Admin CTA Design

**Date**: 2026-04-24  
**Status**: Approved for implementation  
**Area**: `public navbar`

## Summary

Replace the current public header CTA with a dedicated `Admin` / `الإدارة` button so dashboard access is visible in the top navigation instead of being discoverable only from the footer.

## Problem

The current admin entry point exists as a low-visibility footer link, while the header CTA is reserved for contact. That makes admin access less obvious than requested and gives the most visually prominent action in the header to the wrong destination for this use case.

## Goals

- Make admin access clearly visible in the public header.
- Reuse existing localization through `nav.adminLogin`.
- Keep the change small and isolated to the navbar behavior.
- Preserve a consistent experience on desktop and mobile navigation.

## Non-Goals

- Redesigning the overall navbar layout
- Changing footer structure or removing the existing footer admin link
- Introducing new dashboard routes or auth behavior
- Making header CTA behavior configurable from settings

## Options Considered

### 1. Replace the header CTA with `Admin`

Use the current CTA slot in the public navbar and mobile menu, but point it to `/login` and label it with the existing localized admin string.

Pros:

- Smallest possible implementation
- Matches the approved request directly
- Keeps visual emphasis on admin access without adding clutter

Cons:

- Contact is no longer the prominent header CTA

### 2. Add a second header button

Keep `Contact` and add `Admin` beside it.

Pros:

- Both actions stay visible

Cons:

- Adds visual density to the header
- Does not match the request to replace the current CTA

### 3. Make the CTA configurable from settings

Add settings-driven CTA behavior so the header can switch between destinations later.

Pros:

- Most flexible long term

Cons:

- Wider scope than needed
- Adds configuration complexity for a simple request

## Recommended Approach

Implement option 1 only:

- In `PublicNavbar`, replace the current CTA destination with `/login`.
- Replace the CTA label with `t('nav.adminLogin')` for both desktop and mobile.
- Leave the main nav items unchanged.
- Leave the footer admin link unchanged.

## Error Handling

No new runtime behavior is introduced. The button continues to use the existing router link flow. If a user is already authenticated, current route-level auth handling should continue to determine the post-login experience.

## Testing

- Verify the desktop header shows `Admin` / `الإدارة` instead of the current contact CTA.
- Verify the button navigates to `/login`.
- Verify the mobile menu shows the same admin CTA.
- Verify language switching updates the CTA label correctly.
- Verify the existing footer admin link still works.
