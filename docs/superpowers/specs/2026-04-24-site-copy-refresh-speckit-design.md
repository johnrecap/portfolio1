# Site Copy Refresh Speckit Design

**Date**: 2026-04-24  
**Status**: Approved for Speckit creation  
**Area**: `public site copy`

## Summary

Create a dedicated Speckit packet for reviewing and rewriting the public-facing website copy in Arabic and English so the site sounds more personal, simple, and client-oriented without reading like generic AI-written marketing text.

## Problem

The current public copy is uneven in tone. Some sections are clear, but others sound overly polished, generic, or detached from a real person speaking directly to potential clients. That weakens trust and makes the site feel less grounded than it should.

The problem affects both Arabic and English:

- Some lines sound too broad or promotional.
- Some sections explain capability without explaining value to a client clearly.
- The Arabic and English versions are not always equally natural in tone.
- The public site lacks one defined editorial standard for how Mohamed Studio should sound.

## Goals

- Define one editorial direction for the public site in Arabic and English.
- Center the copy on client-facing clarity rather than generic portfolio phrasing.
- Make the tone personal and simple without becoming casual or slang-heavy.
- Ensure each public section has a clear purpose and avoids filler copy.
- Create a Speckit packet with concrete steps so no section is missed.

## Non-Goals

- Rewriting dashboard/admin copy
- Redesigning the UI or page layout
- Changing product structure or route architecture
- Turning the copy into highly branded or overly sales-driven language
- Treating Arabic as a literal translation of English, or vice versa

## Options Considered

### 1. Refresh all public-site copy in one tracked packet

Review and rewrite all public-facing sections together under one Speckit packet, with clear tone rules and section-by-section tasks.

Pros:

- Gives the whole site a consistent voice
- Prevents partial refreshes that leave old copy behind
- Best fit for a tracked `spec / plan / tasks` workflow

Cons:

- Wider scope than editing only the homepage

### 2. Refresh only the highest-impact sections first

Limit the work to hero, about, projects, and contact.

Pros:

- Faster first pass
- Covers the sections most clients see first

Cons:

- Leaves the rest of the site with the old tone
- Makes consistency harder across the full site

### 3. Refresh all site copy, including dashboard/admin language

Treat the whole product as one editorial refresh.

Pros:

- Maximum consistency everywhere

Cons:

- Expands scope beyond the current problem
- Mixes customer-facing copy with admin utility copy

## Recommended Approach

Implement option 1 only.

Create a Speckit packet named `012-site-copy-refresh` that covers the public-facing copy only:

- `hero`
- `about`
- `projects`
- `skills`
- `blog`
- `services`
- `contact`
- `footer`
- supporting public labels and empty states where needed

The packet should define:

- target audience: clients first
- target tone: personal, simple, direct, and professional
- copy anti-patterns to remove: inflated claims, vague product-speak, generic AI-sounding phrasing, and filler
- review steps for Arabic and English as parallel but not literal copies

## Delivery Shape

The approved design should be materialized as:

- `specs/012-site-copy-refresh/spec.md`
- `specs/012-site-copy-refresh/plan.md`
- `specs/012-site-copy-refresh/tasks.md`

## Testing

- Verify every listed public section is represented in the Speckit packet.
- Verify the packet includes explicit tone guidance for both Arabic and English.
- Verify the tasks are detailed enough to prevent skipped sections.
- Verify dashboard/admin copy is explicitly out of scope.
